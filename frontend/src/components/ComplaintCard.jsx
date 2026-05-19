import { Link } from "react-router-dom";

const ComplaintCard = ({ item }) => {
  const priorityClass = (p) => {
    if (!p) return 'bg-secondary';
    const k = p.toString().toLowerCase();
    if (k.includes('high')) return 'bg-danger text-white';
    if (k.includes('medium')) return 'bg-warning text-dark';
    return 'bg-success text-white';
  };

  const statusClass = item.status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      <div className="flex justify-between">
        <div>
          <h5 className="text-lg font-medium">{item.title}</h5>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>

        <div className="text-right">
          <div className={`inline-block px-2 py-1 rounded text-sm ${statusClass}`}>Status: {item.status}</div>
          <div className="text-xs text-gray-500 mt-2">Priority: {item.aiPriority}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">Department: {item.aiDepartment}</div>
        <Link to={`/update/${item._id}`} className="text-sm text-indigo-600 hover:underline">Update Status</Link>
      </div>
    </div>
  );
};

export default ComplaintCard;
