"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "../../../lib/api";

export default function TicketDetails() {
  const params = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    const loadData = async () => {
      try {
        const ticketData = await apiRequest(`/tickets/${params.id}`);
        const commentData = await apiRequest(`/comments/${params.id}`);

        setTicket(ticketData.ticket);
        setComments(commentData.comments);
      } catch (err) {
        console.error("Ticket details error:", err);
        setError(err.message);
      }
    };

    loadData();
  }, [params.id]);

  const addComment = async () => {
    if (!message.trim()) return;

    try {
      await apiRequest(`/comments/${params.id}`, {
        method: "POST",
        body: JSON.stringify({
          message,
        }),
      });

      setMessage("");

      const commentData = await apiRequest(`/comments/${params.id}`);

      setComments(commentData.comments);
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadAttachment = async (attachment) => {
    try {
      setDownloading(attachment.blobName);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${params.id}/attachments/${encodeURIComponent(
          attachment.blobName,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Download API error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        throw new Error(`Download failed (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Attachment download error:", err);
      setError(err.message);
    } finally {
      setDownloading(null);
    }
  };

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Ticket */}
        <div className="bg-white p-8 rounded-xl shadow">
          <h1 className="text-3xl font-bold">{ticket.title}</h1>

          <p className="text-gray-600 mt-4">{ticket.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <p>
              <strong>Status:</strong> {ticket.status.replace("_", " ")}
            </p>

            <p>
              <strong>Priority:</strong> {ticket.priority}
            </p>

            <p>
              <strong>Category:</strong> {ticket.category}
            </p>

            {ticket.createdBy && (
              <p>
                <strong>Created by:</strong> {ticket.createdBy.name}
              </p>
            )}

            {ticket.assignedTo && (
              <p>
                <strong>Assigned to:</strong> {ticket.assignedTo.name}
              </p>
            )}
          </div>

          {ticket.resolution && (
            <div className="mt-6 p-4 bg-green-50 rounded">
              <strong>Resolution</strong>

              <p className="mt-2">{ticket.resolution}</p>
            </div>
          )}

          {/* Attachments */}
          {ticket.attachments?.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Attachments</h2>

              <div className="space-y-3">
                {ticket.attachments.map((attachment) => (
                  <div
                    key={attachment.blobName}
                    className="flex items-center justify-between border rounded-lg p-4"
                  >
                    <div>
                      <p className="font-medium">📎 {attachment.fileName}</p>

                      <p className="text-sm text-gray-500 mt-1">
                        {attachment.contentType} ·{" "}
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <button
                      onClick={() => downloadAttachment(attachment)}
                      disabled={downloading === attachment.blobName}
                      className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      {downloading === attachment.blobName
                        ? "Downloading..."
                        : "Download"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white p-8 rounded-xl shadow mt-6">
          <h2 className="text-xl font-bold mb-4">Comments</h2>

          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="border-b pb-3">
                  <strong>{comment.author?.name || "User"}</strong>

                  <p className="mt-1">{comment.message}</p>
                </div>
              ))
            )}
          </div>

          <textarea
            className="w-full border rounded p-3"
            rows={4}
            placeholder="Write a comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={addComment}
            className="mt-3 bg-black text-white px-5 py-3 rounded"
          >
            Add Comment
          </button>
        </div>
      </div>
    </main>
  );
}
