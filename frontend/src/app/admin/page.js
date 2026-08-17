"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";
import LogoutButton from "../../components/LogoutButton";
import Link from "next/link";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [resolution, setResolution] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setError("");

      const [ticketsData, statsData, usersData] =
        await Promise.all([
          apiRequest("/tickets/all"),
          apiRequest("/tickets/stats"),
          apiRequest("/users"),
        ]);

      setTickets(ticketsData.tickets || []);
      setStats(statsData.stats || {});

      setAdmins(
        (usersData.users || []).filter(
          (user) => user.role === "admin"
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Assign ticket
  const assignTicket = async (ticketId, adminId) => {
    if (!adminId) return;

    try {
      setError("");

      await apiRequest(
        `/tickets/${ticketId}/assign`,
        {
          method: "PATCH",
          body: JSON.stringify({
            assignedTo: adminId,
          }),
        }
      );

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Change ticket status
  const updateStatus = async (ticketId, status) => {
    try {
      setError("");

      await apiRequest(
        `/tickets/${ticketId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        }
      );

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Resolve ticket
  const resolveTicket = async (ticketId) => {
    try {
      setError("");

      const text = resolution[ticketId];

      if (!text?.trim()) {
        setError(
          "Please enter a resolution before resolving."
        );
        return;
      }

      await apiRequest(
        `/tickets/${ticketId}/resolve`,
        {
          method: "PATCH",
          body: JSON.stringify({
            resolution: text.trim(),
          }),
        }
      );

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
        <div className="max-w-7xl mx-auto">
          <p>Loading admin dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and resolve IT support tickets
            </p>
          </div>

          <LogoutButton />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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

        {/* No tickets */}
        {tickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold">
              No tickets found
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no support tickets.
            </p>
          </div>
        ) : (
          /* Tickets */
          <div className="space-y-5">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-xl shadow p-6"
              >

                {/* Ticket header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link
                      href={`/tickets/${ticket._id}`}
                      className="text-xl font-bold hover:underline"
                    >
                      {ticket.title}
                    </Link>

                    <p className="text-gray-500 mt-1">
                      {ticket.description}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-gray-100 capitalize whitespace-nowrap">
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>

                {/* Ticket information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm">

                  <div>
                    <p className="text-gray-500">
                      Employee
                    </p>

                    <p className="font-medium">
                      {ticket.createdBy?.name || "Unknown"}
                    </p>

                    <p className="text-gray-400">
                      {ticket.createdBy?.email || ""}
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
                      {ticket.assignedTo?.name ||
                        "Unassigned"}
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
                    <select
                      value={ticket.assignedTo?._id || ""}
                      onChange={(e) =>
                        assignTicket(
                          ticket._id,
                          e.target.value
                        )
                      }
                      className="border rounded px-3 py-2"
                    >
                      <option value="">
                        {ticket.assignedTo
                          ? "Change assignee"
                          : "Assign to..."}
                      </option>

                      {admins.map((admin) => (
                        <option
                          key={admin._id}
                          value={admin._id}
                        >
                          {admin.name}
                        </option>
                      ))}
                    </select>

                    {/* Start work */}
                    {ticket.status === "assigned" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            ticket._id,
                            "in_progress"
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Start Work
                      </button>
                    )}

                    {/* Close resolved ticket */}
                    {ticket.status === "resolved" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            ticket._id,
                            "closed"
                          )
                        }
                        className="bg-gray-800 text-white px-4 py-2 rounded"
                      >
                        Close Ticket
                      </button>
                    )}

                  </div>

                  {/* Resolution */}
                  {ticket.status === "in_progress" && (
                    <div className="mt-4">

                      <textarea
                        rows={3}
                        value={
                          resolution[ticket._id] || ""
                        }
                        onChange={(e) =>
                          setResolution((prev) => ({
                            ...prev,
                            [ticket._id]:
                              e.target.value,
                          }))
                        }
                        placeholder="Describe how the issue was resolved..."
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
        )}

      </div>
    </main>
  );
}