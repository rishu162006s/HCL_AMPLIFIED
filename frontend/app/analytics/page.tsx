"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../components/Pageshell";
import ProgressBar from "../components/ProgressBar";
import { api } from "../lib/api";

type Analytics = {
  overallProgress: number;

  goals: {
    total: number;
    active: number;
    completed: number;
  };

  resources: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };

  averageQuizScore: number;
  averageTopicMastery: number;
  quizzesAttempted: number;
  topicsTracked: number;
};

type AnalyticsResponse = {
  success: boolean;
  data: Analytics;
  message?: string;
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<AnalyticsResponse>(
          "/analytics/overview"
        );

        if (!response.success) {
          throw new Error(
            response.message || "Unable to load analytics."
          );
        }

        setAnalytics(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[#777469]">
            Loading your analytics...
          </p>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-[#181818] px-5 py-2.5 text-xs font-bold text-white"
          >
            Try again
          </button>
        </div>
      </PageShell>
    );
  }

  if (!analytics) {
    return (
      <PageShell>
        <div className="rounded-[28px] border border-[#d3d0c4] bg-white p-8">
          <h2 className="font-display text-2xl">
            No analytics available yet.
          </h2>

          <p className="mt-3 text-sm text-[#777469]">
            Start learning and your analytics will appear here.
          </p>

          <Link
            href="/goals"
            className="mt-6 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
          >
            View your goals →
          </Link>
        </div>
      </PageShell>
    );
  }

  const resourceTotal = analytics.resources.total;

  const completedPercentage =
    resourceTotal === 0
      ? 0
      : Math.round(
          (analytics.resources.completed / resourceTotal) * 100
        );

  const inProgressPercentage =
    resourceTotal === 0
      ? 0
      : Math.round(
          (analytics.resources.inProgress / resourceTotal) * 100
        );

  const notStartedPercentage =
    resourceTotal === 0
      ? 0
      : Math.round(
          (analytics.resources.notStarted / resourceTotal) * 100
        );

  return (
    <PageShell>
      <section className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
          Analytics
        </p>

        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-5xl leading-[.95] tracking-[-2px] md:text-7xl">
              Understand
              <br />
              <i>your progress.</i>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
              See how your goals, resources, quizzes and topic
              mastery are progressing across your learning journey.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="w-fit rounded-xl border border-[#d3d0c4] bg-white px-5 py-3 text-xs font-bold"
          >
            Back to dashboard →
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric
          title="Overall progress"
          value={`${analytics.overallProgress}%`}
        />

        <Metric
          title="Quiz average"
          value={`${analytics.averageQuizScore}%`}
        />

        <Metric
          title="Topics tracked"
          value={String(analytics.topicsTracked)}
        />

        <Metric
          title="Quizzes attempted"
          value={String(analytics.quizzesAttempted)}
        />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] border border-[#d3d0c4] bg-white p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Resource progress
          </p>

          <h2 className="mt-3 font-display text-3xl">
            Your learning activity
          </h2>

          {resourceTotal === 0 ? (
            <div className="mt-8 rounded-2xl bg-[#f7f5ef] p-5">
              <p className="text-sm text-[#777469]">
                No resources are being tracked yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <ProgressMetric
                name="Completed"
                count={analytics.resources.completed}
                value={completedPercentage}
              />

              <ProgressMetric
                name="In progress"
                count={analytics.resources.inProgress}
                value={inProgressPercentage}
              />

              <ProgressMetric
                name="Not started"
                count={analytics.resources.notStarted}
                value={notStartedPercentage}
              />
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3">
            <MiniStat
              label="Tracked resources"
              value={String(analytics.resources.total)}
            />

            <MiniStat
              label="Completed"
              value={String(analytics.resources.completed)}
            />
          </div>
        </div>

        <div className="rounded-[28px] bg-[#dcefc1] p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px]">
            Learning overview
          </p>

          <h2 className="mt-8 font-display text-3xl">
            Your current learning state.
          </h2>

          <p className="mt-5 text-sm leading-7">
            You have completed{" "}
            <strong>{analytics.resources.completed}</strong> of{" "}
            <strong>{analytics.resources.total}</strong> tracked
            resources.
          </p>

          <div className="mt-8 border-t border-black/10 pt-6">
            <p className="text-[10px] uppercase tracking-[1px]">
              Topic mastery
            </p>

            <p className="mt-2 font-display text-5xl">
              {analytics.averageTopicMastery}%
            </p>

            <div className="mt-5">
              <ProgressBar
                value={analytics.averageTopicMastery}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <MiniStat
              label="Topics"
              value={String(analytics.topicsTracked)}
            />

            <MiniStat
              label="Quiz attempts"
              value={String(analytics.quizzesAttempted)}
            />
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Goal analytics
          </p>

          <h2 className="mt-2 font-display text-3xl">
            How much are you working toward?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Metric
            title="Total goals"
            value={String(analytics.goals.total)}
          />

          <Metric
            title="Active goals"
            value={String(analytics.goals.active)}
          />

          <Metric
            title="Completed goals"
            value={String(analytics.goals.completed)}
          />
        </div>
      </section>

      <section className="mt-5 rounded-[28px] bg-[#181818] p-7 text-white md:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#888]">
              Keep going
            </p>

            <h2 className="mt-3 font-display text-3xl">
              Progress comes from consistency.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#aaa]">
              Continue your current learning path, complete resources
              and use quizzes to keep improving your mastery.
            </p>
          </div>

          <Link
            href="/learning-paths"
            className="w-fit rounded-xl bg-[#c8e86b] px-5 py-3 text-xs font-bold text-[#181818]"
          >
            Continue learning →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-[#d3d0c4] bg-white p-5">
      <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#777469]">
        {title}
      </p>

      <p className="mt-5 font-display text-4xl">
        {value}
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#f7f5ef] p-4">
      <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#777469]">
        {label}
      </p>

      <p className="mt-2 font-display text-2xl">
        {value}
      </p>
    </div>
  );
}

function ProgressMetric({
  name,
  count,
  value,
}: {
  name: string;
  count: number;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-xs">
        <span>{name}</span>

        <strong>
          {count} · {value}%
        </strong>
      </div>

      <ProgressBar value={value} />
    </div>
  );
}