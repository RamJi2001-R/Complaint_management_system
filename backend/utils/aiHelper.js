const axios = require("axios");

/**
 * Analyzes a complaint using OpenRouter AI.
 * Tries multiple free models with retry on rate-limit / loop errors.
 * Falls back to keyword-based logic if all models fail.
 */

const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-20b:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "google/gemma-4-31b-it:free"
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const analyzeComplaint = async ({ title = "", description = "", category = "", location = "" }) => {

  const apiKey = process.env.OPENROUTER_API_KEY;

  // ── Fallback: keyword-based logic ─────────────────────────────────────────
  const fallback = (reason = "") => {
    if (reason) console.warn("[AI] Using keyword fallback. Reason:", reason);

    const text = `${title} ${description} ${category}`.toLowerCase();
    let priority   = "Medium";
    let department = "General Department";

    if      (text.includes("electricity") || text.includes("power") || text.includes("outage") || text.includes("light"))
      { priority = "High";   department = "Electricity Department"; }
    else if (text.includes("water")       || text.includes("flood") || text.includes("drainage") || text.includes("pipe"))
      { priority = "High";   department = "Water Department"; }
    else if (text.includes("garbage")     || text.includes("waste") || text.includes("sanit") || text.includes("trash"))
      { priority = "Medium"; department = "Sanitation Department"; }
    else if (text.includes("road")        || text.includes("pothole") || text.includes("traffic") || text.includes("street"))
      { priority = "Medium"; department = "Roads & Transport Department"; }
    else if (text.includes("noise")       || text.includes("pollution") || text.includes("smoke"))
      { priority = "Low";    department = "Environment Department"; }
    else if (text.includes("hospital")    || text.includes("health") || text.includes("clinic") || text.includes("medical"))
      { priority = "High";   department = "Health Department"; }
    else if (text.includes("school")      || text.includes("education") || text.includes("college"))
      { priority = "Medium"; department = "Education Department"; }
    else if (text.includes("crime")       || text.includes("safety") || text.includes("theft") || text.includes("police"))
      { priority = "High";   department = "Public Safety Department"; }

    const shortDesc = description.length > 100 ? description.substring(0, 97) + "..." : description;

    return {
      priority,
      department,
      summary:      `Complaint about "${title}" in ${location || "the area"}. ${shortDesc}`,
      sentiment:    "Neutral",
      urgencyScore: priority === "High" ? 8 : priority === "Medium" ? 5 : 2,
      response:     `Thank you for submitting your complaint regarding "${title}". It has been registered and routed to the ${department}. Our team will review it and contact you shortly.`
    };
  };

  if (!apiKey || apiKey === "your_openrouter_api_key_here") {
    return fallback("OPENROUTER_API_KEY not set");
  }

  // ── Build prompt (kept short and non-repetitive to avoid loop detection) ───
  const buildPrompt = (complaintText) => ({
    system: `You are a complaint routing assistant. Read the complaint and respond with a single JSON object.

Choose department from: Electricity Department, Water Department, Sanitation Department, Roads & Transport Department, Environment Department, Health Department, Education Department, Public Safety Department, Building & Infrastructure Department, General Department.

Respond with exactly this JSON and nothing else:
{"priority":"High|Medium|Low","department":"<name>","summary":"<1 sentence describing the issue>","sentiment":"Urgent|Negative|Neutral|Positive","urgencyScore":<1-10>,"response":"<2 sentence reply to citizen>"}`,

    user: complaintText
  });

  // Trim description to avoid overly long inputs that cause looping
  const trimmedDesc = description.length > 300 ? description.substring(0, 297) + "..." : description;
  const complaintText = `Title: ${title}\nCategory: ${category || "General"}\nLocation: ${location || "Not specified"}\nDescription: ${trimmedDesc}`;

  // ── Try each model ─────────────────────────────────────────────────────────
  for (const model of FREE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[AI] Trying ${model} (attempt ${attempt})`);
        const { system, user } = buildPrompt(complaintText);

        const res = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: [
              { role: "system", content: system },
              { role: "user",   content: user   }
            ],
            temperature: 0.5,
            max_tokens:  256   // short output = less chance of looping
          },
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type":  "application/json",
              "HTTP-Referer":  "https://complaint-management-system.app",
              "X-Title":       "Smart Complaint Management System"
            },
            timeout: 30000
          }
        );

        const raw = res.data?.choices?.[0]?.message?.content || "";
        console.log(`[AI] Raw (${model}):`, raw.substring(0, 200));

        // Extract JSON from response
        let cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
        const jsonStart = cleaned.indexOf("{");
        const jsonEnd   = cleaned.lastIndexOf("}");
        if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found");

        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(cleaned);

        const missing = ["priority", "department", "summary", "response"].filter((k) => !parsed[k]);
        if (missing.length > 0) throw new Error(`Missing fields: ${missing.join(", ")}`);

        console.log(`[AI] ✅ Success — priority: ${parsed.priority}, dept: ${parsed.department}`);

        return {
          priority:     parsed.priority,
          department:   parsed.department,
          summary:      parsed.summary,
          sentiment:    parsed.sentiment    || "Neutral",
          urgencyScore: Number(parsed.urgencyScore) || 5,
          response:     parsed.response
        };

      } catch (err) {
        const status  = err.response?.status;
        const errBody = err.response?.data?.error;
        const errMsg  = errBody?.message || err.message || "";

        // Rate limited — wait and retry once
        if (status === 429) {
          const wait = ((errBody?.metadata?.retry_after_seconds) || 8) * 1000;
          console.warn(`[AI] 429 on ${model}, waiting ${wait}ms...`);
          if (attempt < 2) { await sleep(wait); continue; }
          else { console.warn(`[AI] Still limited, next model...`); break; }
        }

        // Loop detection or model output error — skip model immediately (no retry)
        if (errMsg.toLowerCase().includes("loop") || errMsg.toLowerCase().includes("output error")) {
          console.warn(`[AI] Loop/output error on ${model}, skipping to next model.`);
          break;
        }

        // Model not found
        if (status === 404) {
          console.warn(`[AI] Model not found: ${model}, skipping.`);
          break;
        }

        // Other errors — log and try next model
        console.error(`[AI] Error on ${model} (${status || "net"}):`, errMsg.substring(0, 120));
        break;
      }
    }
  }

  return fallback("All models failed");
};

module.exports = analyzeComplaint;