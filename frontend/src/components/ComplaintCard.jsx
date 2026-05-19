import { Link } from "react-router-dom";

const PRIORITY_STYLES = {
  High:   "bg-red-100 text-red-700 border border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Low:    "bg-green-100 text-green-700 border border-green-200"
};

const STATUS_STYLES = {
  Pending:    "bg-gray-100 text-gray-600",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved:   "bg-green-100 text-green-700",
  Rejected:   "bg-red-100 text-red-600"
};

const SENTIMENT_ICON = {
  Urgent:   "🚨",
  Negative: "😞",
  Neutral:  "😐",
  Positive: "😊"
};

const ComplaintCard = ({ item }) => {
  const priorityStyle  = PRIORITY_STYLES[item.aiPriority]  || "bg-gray-100 text-gray-600 border border-gray-200";
  const statusStyle    = STATUS_STYLES[item.status]         || "bg-gray-100 text-gray-600";
  const sentimentIcon  = SENTIMENT_ICON[item.aiSentiment]  || "😐";
  const urgency        = item.aiUrgencyScore || null;

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 mb-4 hover:shadow-md transition-shadow">

      {/* Top row: title + badges */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <h2 className="text-base font-semibold text-gray-800">{item.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {item.category && <span className="mr-2">📁 {item.category}</span>}
            {item.location && <span>📍 {item.location}</span>}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityStyle}`}>
            {item.aiPriority || "Medium"} Priority
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle}`}>
            {item.status || "Pending"}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

      {/* AI fields */}
      {(item.aiDepartment || item.aiSummary) && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-3 text-xs space-y-1">
          {item.aiDepartment && (
            <p className="text-indigo-700">
              <span className="font-semibold">🏢 Department:</span> {item.aiDepartment}
            </p>
          )}
          {item.aiSummary && (
            <p className="text-indigo-600">
              <span className="font-semibold">🤖 AI Summary:</span> {item.aiSummary}
            </p>
          )}
          {item.aiResponse && (
            <p className="text-gray-500 italic">"{item.aiResponse}"</p>
          )}
        </div>
      )}

      {/* Bottom row: sentiment + urgency + action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {item.aiSentiment && (
            <span className="text-xs text-gray-500">
              {sentimentIcon} {item.aiSentiment}
            </span>
          )}
          {urgency && (
            <div className="flex items-center gap-1.5">
              <div className="w-20 bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    urgency >= 8 ? "bg-red-500"
                    : urgency >= 5 ? "bg-yellow-400"
                    : "bg-green-400"
                  }`}
                  style={{ width: `${(urgency / 10) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{urgency}/10</span>
            </div>
          )}
        </div>

        <Link
          to={`/update/${item._id}`}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
        >
          Update Status →
        </Link>
      </div>
    </div>
  );
};

export default ComplaintCard;
