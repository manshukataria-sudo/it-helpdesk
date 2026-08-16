"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);

  const loadData = async () => {
    const ticketsData =
      await apiRequest("/tickets/all");

    const statsData =
      await apiRequest("/tickets/stats");

    setTickets(ticketsData.tickets);
    setStats(statsData.stats);
  };

  useEffect(() => {
    loadData().catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>

        {stats && (
          <div className="grid grid-cols-5 gap-4 mb-8">
            {Object.entries(stats).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="bg-white p-5 rounded-xl shadow"
                >
                  <p className="capitalize text-gray-500">
                    {status.replace("_", " ")}
                  </p>

                  <p className="text-3xl font-bold">
                    {count}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Ticket</th>
                <th className="text-left p-4">Employee</th>
                <th className="text-left p-4">Priority</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="border-b"
                >
                  <td className="p-4">
                    {ticket.title}
                  </td>

                  <td className="p-4">
                    {ticket.createdBy?.name}
                  </td>

                  <td className="p-4">
                    {ticket.priority}
                  </td>

                  <td className="p-4 capitalize">
                    {ticket.status.replace("_", " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}