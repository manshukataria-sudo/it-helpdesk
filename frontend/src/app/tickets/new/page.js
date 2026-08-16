"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";

export default function NewTicket() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "hardware",
    priority: "medium",
  });

  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await apiRequest("/tickets", {
        method: "POST",
        body: JSON.stringify(form),
      });

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <form
        onSubmit={submit}
        className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow"
      >
        <h1 className="text-3xl font-bold mb-6">
          Create Support Ticket
        </h1>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Ticket title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <textarea
          className="w-full border p-3 rounded mb-4"
          placeholder="Describe your problem"
          rows={6}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          required
        />

        <select
          className="w-full border p-3 rounded mb-4"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        >
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="network">Network</option>
          <option value="access">Access</option>
          <option value="other">Other</option>
        </select>

        <select
          className="w-full border p-3 rounded mb-6"
          value={form.priority}
          onChange={(e) =>
            setForm({
              ...form,
              priority: e.target.value,
            })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <button className="w-full bg-black text-white p-3 rounded">
          Create Ticket
        </button>
      </form>
    </main>
  );
}