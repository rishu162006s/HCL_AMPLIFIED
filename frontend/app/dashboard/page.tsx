"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../components/Pageshell";
import ProgressBar from "../components/ProgressBar";
import GoalCard from "../components/GoalCard";
import SectionTitle from "../components/SectionTitle";
import { api } from "../lib/api";

type ResumeData = {
  stepId: number;
  resourceId: string;
  resourceTitle: string;
  resourceUrl: string;
};

type GoalProgress = {
  goalId: string;
  title: string;
  status: string;
  progress: number;
  completedResources: number;
  totalResources: number;
  resume: ResumeData | null;
};

type DashboardResponse = {
  success: boolean;
  data: {
    user: {
      name: string;
    };
    totalGoals: number;
    activeGoals: number;
    goalProgress: GoalProgress[];
    quizPercentage: number;
  };
};

type GoalCardData = {
  goalId: string;
  title: string;
  skill: string;
  progress: number;
  quiz: number;
  streak: number;
  next: string;
  completed: number;
  total: number;
  resume: ResumeData | null;
};

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse["data"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<DashboardResponse>("/dashboard");

        if (!response.success || !response.data) {
          throw new Error("Unable to load dashboard.");
        }

        setDashboard(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[#777469]">
            Loading your dashboard...
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

  if (!dashboard) {
    return null;
  }

  const goals: GoalCardData[] =
    dashboard.goalProgress.map((goal) => ({
      goalId: goal.goalId,
      title: goal.title,
      skill: "Learning",
      progress: goal.progress,
      quiz: dashboard.quizPercentage,
      streak: 0,
      next:
        goal.resume?.resourceTitle ||
        (goal.progress >= 100
          ? "Goal completed"
          : "Start learning"),
      completed: goal.completedResources,
      total: goal.totalResources,
      resume: goal.resume,
    }));

  const overallProgress =
    dashboard.goalProgress.length === 0
      ? 0
      : Math.round(
          dashboard.goalProgress.reduce(
            (sum, goal) => sum + goal.progress,
            0
          ) / dashboard.goalProgress.length
        );

  const currentGoal =
    dashboard.goalProgress.find(
      (goal) => goal.resume !== null && goal.progress < 100
    ) ||
    dashboard.goalProgress.find(
      (goal) => goal.progress < 100
    ) ||
    dashboard.goalProgress[0];

  const currentTopic =
    currentGoal?.resume?.resourceTitle ||
    (currentGoal
      ? currentGoal.progress >= 100
        ? "Goal completed"
        : "Continue your learning path"
      : "No learning activity yet");

  const currentProgress =
    currentGoal?.progress ?? 0;

  const currentResumeUrl =
    currentGoal?.resume?.resourceUrl ?? null;

  return (
    <PageShell>
      {/* HEADER */}
      <section className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#777469]">
          Your learning dashboard
        </p>

        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-5xl leading-[.95] tracking-[-2px] md:text-7xl">
              Keep moving
              <br />
              <i>forward.</i>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
              Welcome back,{" "}
              <strong>{dashboard.user.name}</strong>.
              Your goals, learning paths, progress and
              AI guidance are connected in one place.
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

      {/* RESUME */}
      <section className="mb-5 overflow-hidden rounded-[30px] bg-[#181818] text-white">
        <div className="grid lg:grid-cols-[1fr_350px]">
          <div className="p-7 md:p-10">
            <span className="rounded-full bg-[#c8e86b] px-3 py-1.5 text-[9px] font-bold text-[#181818]">
              {currentGoal?.progress === 100
                ? "GOAL COMPLETED"
                : "RESUME LEARNING"}
            </span>

            <p className="mt-12 text-[10px] uppercase tracking-[2px] text-[#858580]">
              Current topic
            </p>

            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-5xl">
              {currentTopic}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#aaa9a2]">
              {currentGoal?.resume
                ? "Continue from where you last left off."
                : currentGoal
                  ? "Your learning path is ready. Start a resource to begin tracking your progress."
                  : "Create your first goal and build your personalized learning path."}
            </p>

            <div className="mt-8 max-w-xl">
              <div className="mb-2 flex justify-between text-[10px] text-[#888]">
                <span>Goal progress</span>
                <span>{currentProgress}%</span>
              </div>

              <ProgressBar
                value={currentProgress}
                dark
              />
            </div>

            {currentResumeUrl ? (
              <a
                href={currentResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-xl bg-[#c8e86b] px-5 py-3 text-xs font-bold text-[#181818] transition hover:opacity-85"
              >
                Resume learning →
              </a>
            ) : currentGoal ? (
              <Link
                href={`/goals/${currentGoal.goalId}`}
                className="mt-8 inline-block rounded-xl bg-[#c8e86b] px-5 py-3 text-xs font-bold text-[#181818] transition hover:opacity-85"
              >
                View learning goal →
              </Link>
            ) : (
              <Link
                href="/goals/create"
                className="mt-8 inline-block rounded-xl bg-[#c8e86b] px-5 py-3 text-xs font-bold text-[#181818] transition hover:opacity-85"
              >
                Create your first goal →
              </Link>
            )}
          </div>

          <div className="bg-[#292929] p-7 md:p-10">
            <p className="text-[10px] uppercase tracking-[2px] text-[#858580]">
              Learning overview
            </p>

            <p className="mt-7 font-display text-7xl">
              {overallProgress}%
            </p>

            <p className="mt-2 text-sm text-[#aaa]">
              overall goal progress
            </p>

            <div className="mt-12 border-t border-[#444] pt-6">
              <p className="text-[10px] text-[#888]">
                Active goals
              </p>

              <p className="mt-2 font-display text-3xl">
                {dashboard.activeGoals}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric
          label="Active goals"
          value={String(dashboard.activeGoals)}
        />

        <Metric
          label="Overall progress"
          value={`${overallProgress}%`}
        />

        <Metric
          label="Quiz average"
          value={`${dashboard.quizPercentage}%`}
        />

        <Metric
          label="Where you stand"
          value={
            dashboard.quizPercentage >= 90
              ? "Expert 🏆"
              : dashboard.quizPercentage >= 75
              ? "Advanced 🌟"
              : dashboard.quizPercentage >= 50
              ? "Intermediate 📈"
              : "Beginner 🌱"
          }
        />
      </div>

      {/* GOALS */}
      <section className="mb-5 rounded-[28px] border border-[#d2cfc1] bg-white p-6 md:p-8">
        <SectionTitle
          eyebrow="Your goals"
          title="Everything you're working toward."
          action="View all"
          href="/goals"
        />

        <div className="space-y-4">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard
                key={goal.goalId}
                goal={goal}
              />
            ))
          ) : (
            <div className="rounded-2xl bg-[#f7f5ef] p-6 text-sm text-[#777469]">
              You don't have any goals yet.

              <Link
                href="/goals/create"
                className="ml-1 font-bold underline"
              >
                Create your first goal →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* LOWER GRID */}
      <section className="grid gap-5 lg:grid-cols-3">
        {/* CURRENT PATH */}
        <div className="rounded-[28px] bg-[#a98cff] p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px]">
            Current path
          </p>

          <h3 className="mt-10 font-display text-3xl">
            {currentGoal?.title ||
              "No active learning path"}
          </h3>

          <p className="mt-4 text-sm">
            {currentGoal
              ? `${currentGoal.completedResources} of ${currentGoal.totalResources} resources completed.`
              : "Create a goal to begin your personalized learning path."}
          </p>

          <div className="mt-7">
            <ProgressBar
              value={currentGoal?.progress ?? 0}
            />
          </div>

          <Link
            href={
              currentGoal
                ? `/goals/${currentGoal.goalId}`
                : "/goals/create"
            }
            className="mt-8 inline-block text-xs font-bold underline"
          >
            {currentGoal
              ? "View goal →"
              : "Create goal →"}
          </Link>
        </div>

        {/* PROGRESS */}
        <div className="rounded-[28px] border border-[#d2cfc1] bg-white p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Progress
          </p>

          <h3 className="mt-3 font-display text-2xl">
            Where you stand
          </h3>

          <div className="mt-8 space-y-5">
            {dashboard.goalProgress
              .slice(0, 4)
              .map((goal) => (
                <Mastery
                  key={goal.goalId}
                  name={goal.title}
                  value={goal.progress}
                />
              ))}

            {dashboard.goalProgress.length === 0 && (
              <p className="text-sm text-[#777469]">
                No progress data available yet.
              </p>
            )}
          </div>

          <Link
            href="/analytics"
            className="mt-7 inline-block text-xs font-bold underline"
          >
            Detailed analytics →
          </Link>
        </div>

        {/* AI COACH */}
        <div className="rounded-[28px] bg-[#ff9d52] p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px]">
            AI Coach
          </p>

          <h3 className="mt-10 font-display text-3xl">
            Your next move is clear.
          </h3>

          <p className="mt-4 text-sm leading-6">
            {currentGoal?.resume
              ? `Continue with "${currentGoal.resume.resourceTitle}" to keep progressing toward your goal.`
              : currentGoal
                ? "Start a learning resource for your active goal and your progress will update automatically."
                : "Create a learning goal and your AI coach will guide your next steps."}
          </p>

          <Link
            href="/ai"
            className="mt-8 inline-block text-xs font-bold underline"
          >
            Open AI Coach →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
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

function Mastery({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-[10px]">
        <span className="truncate">{name}</span>

        <strong>{value}%</strong>
      </div>

      <ProgressBar value={value} />
    </div>
  );
}