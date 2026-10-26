export default function TechnicianQueue({ technicians }) {
  return (
    <ul className="space-y-3">
      {technicians.map((t) => (
        <li key={t.name}>
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {t.name} <span className="text-slate-400">({t.specialty})</span>
            </span>
            <span>{t.active} active</span>
          </div>
          <div className="mt-1 h-2 rounded bg-slate-200">
            <div
              className="h-2 rounded bg-indigo-500"
              style={{ width: `${Math.min(t.active * 20, 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}