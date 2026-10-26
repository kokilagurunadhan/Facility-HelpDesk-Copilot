import StatCard from "../components/StatCard";
import RequestTable from "../components/RequestTable";
import TechnicianQueue from "../components/TechnicianQueue";
import { sampleRequests, sampleTechnicians } from "../data/sample";

export default function Home() {
  const open = sampleRequests.filter((r) => r.status === "OPEN").length;
  const inProgress = sampleRequests.filter((r) => r.status === "IN_PROGRESS").length;
  const overdue = sampleRequests.filter(
    (r) => r.status !== "RESOLVED" && new Date(r.due) < new Date()
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-indigo-700 px-6 py-4 text-white shadow">
        <h1 className="text-xl font-semibold">Facility Helpdesk Copilot</h1>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Open" value={open} color="text-slate-800" />
          <StatCard label="In progress" value={inProgress} color="text-blue-600" />
          <StatCard label="Overdue" value={overdue} color="text-red-600" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-lg bg-white p-4 shadow lg:col-span-2">
            <h2 className="mb-3 text-lg font-semibold">Requests</h2>
            <RequestTable requests={sampleRequests} />
          </section>

          <section className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-semibold">Technician queues</h2>
            <TechnicianQueue technicians={sampleTechnicians} />
          </section>
        </div>
      </main>
    </div>
  );
}