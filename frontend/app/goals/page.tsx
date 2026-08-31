
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../components/Pageshell";
import ProgressBar from "../components/ProgressBar";
import { api } from "../lib/api";

type Goal = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  progress?: number;
  createdAt: string;
  targetDate?: string | null;
  objective?: string | null;
};

type GoalsResponse = {
  success: boolean;
  data: Goal[];
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoading(true);
        setError("");

        // Backend route is GET /api/goals/me
        const response =
          await api.get<GoalsResponse>("/goals/me");

        if (!response.success) {
          throw new Error("Unable to load goals.");
        }

        setGoals(response.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load goals."
        );
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  const activeGoals = goals.filter(
    (goal) =>
      goal.status === "ACTIVE" ||
      goal.status === "IN_PROGRESS"
  );

  const completedGoals = goals.filter(
    (goal) => goal.status === "COMPLETED"
  );

  const getProgress = (goal: Goal) =>
    Math.max(
      0,
      Math.min(100, Math.round(goal.progress ?? 0))
    );

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[#777469]">
            Loading your goals...
          </p>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* HEADER */}
      <section className="mb-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#777469]">
              Your goals
            </p>

            <h1 className="mt-4 font-display text-5xl leading-[.95] tracking-[-2px] md:text-7xl">
              What you're
              <br />
              <i>working toward.</i>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
              Your goals drive your personalized learning paths,
              recommendations and progress.
            </p>
          </div>

          <Link
            href="/goals/create"
            className="w-fit rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white transition hover:opacity-85"
          >
            + Create Goal
          </Link>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        <SummaryCard
          label="Total goals"
          value={goals.length}
        />

        <SummaryCard
          label="Active goals"
          value={activeGoals.length}
        />

        <SummaryCard
          label="Completed"
          value={completedGoals.length}
        />
      </section>

      {/* EMPTY */}
      {goals.length === 0 ? (
        <section className="rounded-[30px] border border-[#d3d0c4] bg-white p-8 md:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            No goals yet
          </p>

          <h2 className="mt-5 font-display text-4xl">
            Start with something
            <br />
            <i>you want to achieve.</i>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#777469]">
            Tell Pathwise what you want to learn or achieve and
            we'll build a personalized learning journey around it.
          </p>

          <Link
            href="/goals/create"
            className="mt-7 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
          >
            Create your first goal →
          </Link>
        </section>
      ) : (
        <>
          {/* ACTIVE */}
          {activeGoals.length > 0 && (
            <section className="mb-8">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                    In progress
                  </p>

                  <h2 className="mt-2 font-display text-3xl">
                    Active goals
                  </h2>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {activeGoals.map((goal) => (
                  <GoalItem
                    key={goal.id}
                    goal={goal}
                    progress={getProgress(goal)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* OTHER */}
          {goals.filter(
            (goal) =>
              !activeGoals.some(
                (active) => active.id === goal.id
              )
          ).length > 0 && (
            <section>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                Completed & other goals
              </p>

              <div className="grid gap-5 lg:grid-cols-2">
                {goals
                  .filter(
                    (goal) =>
                      !activeGoals.some(
                        (active) => active.id === goal.id
                      )
                  )
                  .map((goal) => (
                    <GoalItem
                      key={goal.id}
                      goal={goal}
                      progress={getProgress(goal)}
                    />
                  ))}
              </div>
            </section>
          )}
        </>
      )}
    </PageShell>
  );
}

function GoalItem({
  goal,
  progress,
}: {
  goal: Goal;
  progress: number;
}) {
  const completed = goal.status === "COMPLETED";

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="group rounded-[28px] border border-[#d3d0c4] bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <span
            className={`rounded-full px-3 py-1 text-[9px] font-bold ${
              completed
                ? "bg-[#dcefc1] text-[#46602c]"
                : "bg-[#eee8f4] text-[#695b72]"
            }`}
          >
            {completed ? "COMPLETED" : goal.status}
          </span>

          <h2 className="mt-6 font-display text-3xl leading-tight">
            {goal.title}
          </h2>

          {goal.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#777469]">
              {goal.description}
            </p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="font-display text-4xl">
            {progress}%
          </p>

          <p className="text-[9px] uppercase tracking-[1px] text-[#8a877d]">
            progress
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ProgressBar value={progress} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 text-xs text-[#777469]">
        <span>
          {goal.objective || "Learning goal"}
        </span>

        <span className="font-bold text-[#181818] transition group-hover:translate-x-1">
          View goal →
        </span>
      </div>

      {goal.targetDate && (
        <p className="mt-4 text-[10px] text-[#99958a]">
          Target:{" "}
          {new Date(goal.targetDate).toLocaleDateString()}
        </p>
      )}
    </Link>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[22px] border border-[#d2cfc1] bg-white p-5">
      <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#858278]">
        {label}
      </p>

      <p className="mt-5 font-display text-4xl">
        {value}
      </p>
    </div>
  );
}

