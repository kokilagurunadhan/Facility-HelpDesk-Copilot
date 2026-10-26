const priorityStyle = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-green-100 text-green-700",
};

const statusStyle = {
  OPEN: "bg-slate-200 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
};

function isOverdue(request) {
  return request.status !== "RESOLVED" && new Date(request.due) < new Date();
}

export default function RequestTable({ requests }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b text-slate-500">
          <tr>
            <th className="py-2 pr-4">ID</th>
            <th className="py-2 pr-4">Title</th>
            <th className="py-2 pr-4">Priority</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Technician</th>
            <th className="py-2">Due</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="py-2 pr-4">#{r.id}</td>
              <td className="py-2 pr-4">{r.title}</td>
              <td className="py-2 pr-4">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${priorityStyle[r.priority]}`}>
                  {r.priority}
                </span>
              </td>
              <td className="py-2 pr-4">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyle[r.status]}`}>
                  {r.status}
                </span>
              </td>
              <td className="py-2 pr-4">{r.technician ?? "Unassigned"}</td>
              <td className={`py-2 ${isOverdue(r) ? "font-semibold text-red-600" : ""}`}>
                {r.due}
                {isOverdue(r) && " (overdue)"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}