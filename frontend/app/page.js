"use client";

import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import RequestTable from "../components/RequestTable";
import TechnicianQueue from "../components/TechnicianQueue";
import AnalyticsCharts from "../components/AnalyticsCharts"; // 📊 Imported AnalyticsCharts
import { sampleTechnicians } from "../data/sample";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/requests?limit=100`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        setRequests(
          data.map((r) => ({
            ...r,
            due: r.due_at ? r.due_at.slice(0, 10) : "-",
          }))
        );
      } catch (e) {
        setError("Could not load requests. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🛡️ Safe metric calculations that guarantee no system crash even if database drops out
  const open = Array.isArray(requests) ? requests.filter((r) => r.status === "OPEN").length : 0;
  const inProgress = Array.isArray(requests) ? requests.filter((r) => r.status === "IN_PROGRESS").length : 0;
  const overdue = Array.isArray(requests) ? requests.filter(
    (r) => r.status !== "RESOLVED" && r.due && r.due !== "-" && new Date(r.due) < new Date()
  ).length : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-indigo-700 px-6 py-4 text-white shadow">
        <h1 className="text-xl font-semibold">Facility Helpdesk Copilot</h1>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
        )}

        {/* 1. Numerical Statistics Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Open" value={loading ? "--" : open} color="text-slate-800" />
          <StatCard label="In progress" value={loading ? "--" : inProgress} color="text-blue-600" />
          <StatCard label="Overdue" value={loading ? "--" : overdue} color="text-red-600" />
        </div>

        {/* 2. Visual Analytics Charts Layout Panel */}
        {!loading && Array.isArray(requests) && requests.length > 0 && (
          <AnalyticsCharts requests={requests} />
        )}

        {/* 3. Operational Queue Splitting Columns */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-lg bg-white p-4 shadow lg:col-span-2">
            <h2 className="mb-3 text-lg font-semibold">Requests</h2>
            {loading ? (
              <p className="text-slate-500">Loading...</p>
            ) : (
              <RequestTable requests={requests} />
            )}
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
