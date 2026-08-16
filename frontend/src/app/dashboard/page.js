"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";
import Link from "next/link";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await apiRequest("/tickets");
        setTickets(data.tickets);
      } catch (err) {
        setError(err.message);
      }
    };

    loadTickets();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              My Tickets
            </h1>
            <p className="text-gray-500">
              Track your IT support requests
            </p>
          </div>

          <Link
            href="/tickets/new"
            className="bg-black text-white px-5 py-3 rounded"
          >
            Create Ticket
          </Link>
        </div>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Link
              href={`/tickets/${ticket._id}`}
              key={ticket._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md"
            >
              <div className="flex justify-between">
                <h2 className="font-semibold">
                  {ticket.title}
                </h2>

                <span className="capitalize">
                  {ticket.status.replace("_", " ")}
                </span>
              </div>

              <p className="text-gray-500 mt-2">
                {ticket.description}
              </p>

              <p className="text-sm mt-3">
                Priority: {ticket.priority}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}