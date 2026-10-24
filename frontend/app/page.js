export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-indigo-700 px-6 py-4 text-white shadow">
        <h1 className="text-xl font-semibold">Facility Helpdesk Copilot</h1>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Open" value="--" />
          <StatCard label="In progress" value="--" />
          <StatCard label="Overdue" value="--" />
        </div>

        <section className="mt-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 text-lg font-semibold">Requests</h2>
          <p className="text-slate-500">The ticket list will appear here.</p>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}