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

  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("priority", form.priority);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await apiRequest("/tickets", {
        method: "POST",
        body: formData,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
          <p className="text-red-600 mb-4">
            {error}
          </p>
        )}

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Ticket title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
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

        {/* Attachment */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Attachment{" "}
            <span className="text-gray-500">
              (optional)
            </span>
          </label>

          <input
            type="file"
            onChange={(e) =>
              setAttachment(e.target.files[0] || null)
            }
            className="w-full border p-3 rounded"
          />

          {attachment && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {attachment.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white p-3 rounded disabled:opacity-50"
        >
          {submitting
            ? "Creating Ticket..."
            : "Create Ticket"}
        </button>
      </form>
    </main>
  );
}