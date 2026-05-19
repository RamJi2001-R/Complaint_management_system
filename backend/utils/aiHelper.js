const analyzeComplaint = async (text) => {

  let priority = "Medium";
  let department = "General Department";

  if (text.toLowerCase().includes("electricity")) {
    priority = "High";
    department = "Electricity Department";
  }

  if (text.toLowerCase().includes("water")) {
    department = "Water Department";
  }

  if (text.toLowerCase().includes("garbage")) {
    department = "Sanitation Department";
  }

  return {
    priority,
    department,
    summary: text.substring(0, 80),

    response:
      "Your complaint has been registered successfully. Our team will contact you soon."
  };
};

module.exports = analyzeComplaint;