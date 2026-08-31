"use client";

import { useState } from "react";
import { api } from "../lib/api";
import AuthGuard from "../components/AuthGuard";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      setStatus("Please choose a rating first.");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      await api.post("/feedback", { rating, comment: comment.trim() || undefined });
      setStatus("Thanks for your feedback.");
      setComment("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to send feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard><main className="min-h-screen bg-[#f7f5ef] px-6 py-10 text-[#1b1b1b]">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-[30px] border border-[#dedbd2] bg-[#fffef9] p-8 lg:p-10">
          <p className="text-sm text-[#81778d]">Help us improve</p>

          <h1 className="mt-2 text-3xl font-medium">
            How is your learning experience?
          </h1>

          <p className="mt-3 text-[#68645f]">
            Your feedback helps us make your personalized learning experience
            better.
          </p>

          <div className="mt-8 flex gap-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                  rating >= value
                    ? "border-[#9b84ae] bg-[#eee8f4]"
                    : "border-[#dedbd2]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Tell us what you think..."
            className="mt-8 min-h-40 w-full resize-none rounded-2xl border border-[#dedbd2] bg-transparent p-4 outline-none focus:border-[#9b84ae]"
          />

          {status && <p className="mt-4 text-sm text-[#68645f]">{status}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 rounded-full bg-[#242124] px-7 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send feedback"}
          </button>
        </div>
      </div>
    </main></AuthGuard>
  );
}