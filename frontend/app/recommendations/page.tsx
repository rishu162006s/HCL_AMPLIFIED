
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";
import PageShell from "../components/Pageshell";
import { api } from "../lib/api";

type Recommendation = {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  resourceId?: string | null;
  topicId?: string | null;
  resource?: {
    id: string;
    title: string;
    url?: string | null;
  } | null;
  topic?: {
    id: string;
    name: string;
  } | null;
};

type RecommendationsResponse = {
  success: boolean;
  data: Recommendation[];
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<RecommendationsResponse>(
            "/recommendations"
          );

        if (!response.success) {
          throw new Error(
            "Unable to load recommendations."
          );
        }

        setRecommendations(response.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const startRecommendation = (
    recommendation: Recommendation
  ) => {
    if (recommendation.resource?.url) {
      window.open(
        recommendation.resource.url,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    if (recommendation.topicId) {
      window.location.href =
        `/topics/${recommendation.topicId}`;
      return;
    }

    window.location.href = "/resources";
  };

  if (loading) {
    return (
      <AuthGuard>
        <PageShell>
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-[#777469]">
              Loading recommendations...
            </p>
          </div>
        </PageShell>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <PageShell>
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        </PageShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <PageShell>
        <section className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Personalized for you
          </p>

          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            What to learn
            <br />
            <i>next.</i>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
            Recommendations are based on your goals,
            progress, quiz results and learning history.
          </p>
        </section>

        {recommendations.length === 0 ? (
          <div className="rounded-[28px] border border-[#d4d1c6] bg-white p-8">
            <h2 className="font-display text-2xl">
              No recommendations yet.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#777469]">
              Keep learning and completing quizzes.
              Your personalized recommendations will
              appear here as the system learns more about
              your progress.
            </p>

            <Link
              href="/resources"
              className="mt-6 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
            >
              Explore resources →
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="rounded-[26px] border border-[#d4d1c6] bg-white p-7 transition hover:-translate-y-1"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#eee8f4] px-3 py-1 text-[9px] font-bold text-[#695b72]">
                    {item.type}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-[9px] font-bold ${
                      item.priority === "HIGH"
                        ? "bg-[#ffeadb]"
                        : item.priority === "MEDIUM"
                        ? "bg-[#f0eee5]"
                        : "bg-[#e8f1d8]"
                    }`}
                  >
                    {item.priority} PRIORITY
                  </span>
                </div>

                <h2 className="mt-5 font-display text-2xl">
                  {item.title}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#68645f]">
                  {item.description}
                </p>

                {(item.topic || item.resource) && (
                  <div className="mt-5 rounded-2xl bg-[#f7f5ef] p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#777469]">
                      Based on
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      {item.topic?.name ||
                        item.resource?.title}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    startRecommendation(item)
                  }
                  className="mt-6 rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
                >
                  Start →
                </button>
              </div>
            ))}
          </div>
        )}
      </PageShell>
    </AuthGuard>
  );
}

