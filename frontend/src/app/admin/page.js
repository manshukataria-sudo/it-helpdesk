"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [resolution, setResolution] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);

      const ticketsData = await apiRequest("/tickets/all");
      const statsData = await apiRequest("/tickets/stats");

      setTickets(ticketsData.tickets);
      setStats(statsData.stats);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Assign ticket to currently logged-in admin
  const assignToMe = async (ticketId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.id) {
        throw new Error("Admin user information not found");
      }

      await apiRequest(`/tickets/${ticketId}/assign`, {
        method: "PATCH",
        body: JSON.stringify({
          assignedTo: user.id,
        }),
      });

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Change ticket status
  const updateStatus = async (ticketId, status) => {
    try {
      await apiRequest(`/tickets/${ticketId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      });

      await loadData();
    } catch (err) {
      setError(err.message);
      await loadData();
    }
  };

  // Resolve ticket
  const resolveTicket = async (ticketId) => {
    try {
      const text = resolution[ticketId];

      if (!text?.trim()) {
        setError("Please enter a resolution before resolving.");
        return;
      }

      await apiRequest(`/tickets/${ticketId}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({
          resolution: text,
        }),
      });

      setResolution((prev) => ({
        ...prev,
        [ticketId]: "",
      }));

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <p>Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and resolve IT support tickets
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
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

                  <p className="text-3xl font-bold mt-2">
                    {count}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* Tickets */}
        <div className="space-y-5">

          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-xl shadow p-6"
            >

              {/* Ticket header */}
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-xl font-bold">
                    {ticket.title}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {ticket.description}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-gray-100 capitalize">
                  {ticket.status.replace("_", " ")}
                </span>

              </div>

              {/* Ticket information */}
              <div className="grid grid-cols-4 gap-4 mt-5 text-sm">

                <div>
                  <p className="text-gray-500">
                    Employee
                  </p>
                  <p className="font-medium">
                    {ticket.createdBy?.name || "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Priority
                  </p>
                  <p className="font-medium capitalize">
                    {ticket.priority}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Category
                  </p>
                  <p className="font-medium capitalize">
                    {ticket.category}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Assigned To
                  </p>
                  <p className="font-medium">
                    {ticket.assignedTo?.name || "Unassigned"}
                  </p>
                </div>

              </div>

              {/* Admin actions */}
              <div className="border-t mt-5 pt-5">

                <p className="font-semibold mb-3">
                  Admin Actions
                </p>

                <div className="flex flex-wrap gap-3">

                  {/* Assign */}
                  {!ticket.assignedTo && (
                    <button
                      onClick={() =>
                        assignToMe(ticket._id)
                      }
                      className="bg-black text-white px-4 py-2 rounded"
                    >
                      Assign to Me
                    </button>
                  )}

                  {/* Status */}
                  {ticket.status !== "closed" && (
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          updateStatus(
                            ticket._id,
                            e.target.value
                          );
                        }
                      }}
                      className="border rounded px-3 py-2"
                    >
                      <option value="">
                        Change Status
                      </option>

                      {ticket.status === "assigned" && (
                        <option value="in_progress">
                          In Progress
                        </option>
                      )}

                      {ticket.status === "resolved" && (
                        <option value="closed">
                          Closed
                        </option>
                      )}
                    </select>
                  )}

                </div>

                {/* Resolution */}
                {ticket.status === "in_progress" && (
                  <div className="mt-4">

                    <textarea
                      rows={3}
                      value={resolution[ticket._id] || ""}
                      onChange={(e) =>
                        setResolution((prev) => ({
                          ...prev,
                          [ticket._id]: e.target.value,
                        }))
                      }
                      placeholder="Enter resolution..."
                      className="w-full border rounded p-3"
                    />

                    <button
                      onClick={() =>
                        resolveTicket(ticket._id)
                      }
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Resolve Ticket
                    </button>

                  </div>
                )}

                {/* Existing resolution */}
                {ticket.resolution && (
                  <div className="mt-4 bg-green-50 p-4 rounded">
                    <p className="font-semibold">
                      Resolution
                    </p>

                    <p className="text-gray-700 mt-1">
                      {ticket.resolution}
                    </p>
                  </div>
                )}

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}