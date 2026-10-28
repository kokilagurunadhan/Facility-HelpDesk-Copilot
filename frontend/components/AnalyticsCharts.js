"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsCharts({ requests }) {
  // 1. Calculate Priority Metrics dynamically from your data rows
  const highCount = requests.filter(r => r.priority === "HIGH").length;
  const medCount = requests.filter(r => r.priority === "MEDIUM").length;
  const lowCount = requests.filter(r => r.priority === "LOW").length;

  // 2. Calculate Status Metrics
  const openCount = requests.filter(r => r.status === "OPEN").length;
  const progressCount = requests.filter(r => r.status === "IN_PROGRESS").length;
  const resolvedCount = requests.filter(r => r.status === "RESOLVED").length;

  // Data layout for the Priority Bar Chart
  const barData = {
    labels: ["High Priority", "Medium Priority", "Low Priority"],
    datasets: [
      {
        label: "Tickets Count",
        data: [highCount, medCount, lowCount],
        backgroundColor: ["rgba(239, 68, 68, 0.8)", "rgba(245, 158, 11, 0.8)", "rgba(59, 130, 246, 0.8)"],
        borderWidth: 1,
      },
    ],
  };

  // Data layout for the Status Breakdown Doughnut Chart
  const doughnutData = {
    labels: ["Open", "In Progress", "Resolved"],
    datasets: [
      {
        data: [openCount, progressCount, resolvedCount],
        backgroundColor: ["#64748b", "#2563eb", "#10b981"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      {/* Priority Distribution Card */}
      <div className="rounded-lg bg-white p-4 shadow border border-slate-100">
        <h3 className="mb-4 text-md font-semibold text-slate-700">Urgency Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Operational Lifecycle Card */}
      <div className="rounded-lg bg-white p-4 shadow border border-slate-100">
        <h3 className="mb-4 text-md font-semibold text-slate-700">Ticket Status Breakdown</h3>
        <div className="h-64 flex items-center justify-center">
          <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
