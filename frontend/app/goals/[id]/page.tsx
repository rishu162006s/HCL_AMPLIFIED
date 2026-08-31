"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PageShell from "../../components/Pageshell";
import ProgressBar from "../../components/ProgressBar";
import { api } from "../../lib/api";

type GoalSkill = {
  id: string;
  skill?: {
    id: string;
    name: string;
  } | null;
  requiredLevel?: string | null;
  currentLevel?: string | null;
};

type ResumeData = {
  stepId: number;
  resourceId: string;
  resourceTitle: string;
  resourceUrl: string;
};

type Goal = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  objective?: string | null;
  targetDate?: string | null;
  createdAt: string;
  progress?: number;
  skills?: GoalSkill[];
  goalSkills?: GoalSkill[];
  learningPath?: {
    id: string;
    title: string;
    description?: string | null;
  } | null;
  resume?: ResumeData | null;
};

type GoalResponse = {
  success: boolean;
  data: Goal;
};

export default function GoalDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadGoal = async () => {
    if (!params.id) return;
    try {
      setLoading(true);
      setError("");

      const response = await api.get<GoalResponse>(`/goals/${params.id}`);

      if (!response.success || !response.data) {
        throw new Error("Unable to load this goal.");
      }

      setGoal(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load this goal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoal();
  }, [params.id]);

  const handleAnalyzeAndGenerate = async () => {
    if (!goal) return;
    try {
      setActionLoading(true);
      setError("");

      /* Step 1: Analyze goal to get skills if not present */
      await api.post("/ai/goals/analyze", {
        goal: `${goal.title}. ${goal.description || ""}`,
        goalId: goal.id,
      });

      /* Step 2: Generate learning path */
      const res = await api.post<{ success: boolean; data: { id: string } }>("/learning-paths/generate", {
        goalId: goal.id,
      });

      if (res.success && res.data?.id) {
        router.push(`/learning-paths/${res.data.id}`);
      } else {
        await loadGoal();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate learning path.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[#777469]">Loading your goal...</p>
        </div>
      </PageShell>
    );
  }

  if (error || !goal) {
    return (
      <PageShell>
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error || "Goal not found."}
        </div>
      </PageShell>
    );
  }

  const progress = Math.max(0, Math.min(100, Math.round(goal.progress ?? 0)));
  const skills = goal.skills ?? goal.goalSkills ?? [];
  const completed = goal.status === "COMPLETED" || progress >= 100;

  return (
    <PageShell>
      <Link href="/goals" className="text-xs font-bold text-[#777469] hover:underline">
        ← All goals
      </Link>

      {/* HERO */}
      <section className="mt-7 overflow-hidden rounded-[32px] bg-[#181818] text-white">
        <div className="p-7 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1.5 text-[9px] font-bold ${
                completed ? "bg-[#c8e86b] text-[#181818]" : "bg-[#eee8f4] text-[#695b72]"
              }`}
            >
              {completed ? "COMPLETED" : goal.status}
            </span>

            {goal.objective && (
              <span className="text-[10px] uppercase tracking-[1.5px] text-[#999]">
                {goal.objective}
              </span>
            )}
          </div>

          <h1 className="mt-7 max-w-4xl font-display text-4xl leading-tight md:text-6xl">
            {goal.title}
          </h1>

          {goal.description && (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#aaa9a2]">
              {goal.description}
            </p>
          )}

          <div className="mt-10 max-w-2xl">
            <div className="mb-2 flex justify-between text-[10px] text-[#999]">
              <span>Overall progress</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} dark />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <HeroMetric value={`${progress}%`} label="Progress" />
            <HeroMetric value={String(skills.length)} label="Required skills" />
            <HeroMetric
              value={goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : "—"}
              label="Target date"
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        {/* LEARNING */}
        <div className="rounded-[28px] border border-[#d3d0c4] bg-white p-7 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Learning journey
          </p>

          <h2 className="mt-3 font-display text-3xl">Your personalized path</h2>

          {goal.learningPath ? (
            <div className="mt-8 rounded-[24px] bg-[#f7f5ef] p-6">
              <span className="rounded-full bg-[#eee8f4] px-3 py-1 text-[9px] font-bold text-[#695b72]">
                LEARNING PATH READY
              </span>

              <h3 className="mt-5 font-display text-2xl">{goal.learningPath.title}</h3>

              {goal.learningPath.description && (
                <p className="mt-3 text-sm leading-6 text-[#777469]">
                  {goal.learningPath.description}
                </p>
              )}

              <Link
                href={`/learning-paths/${goal.learningPath.id}`}
                className="mt-6 inline-block rounded-xl bg-[#181818] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#303030]"
              >
                Open learning path →
              </Link>
            </div>
          ) : (
            <div className="mt-8 rounded-[24px] bg-[#f7f5ef] p-6">
              <h3 className="font-display text-2xl">No path generated yet</h3>
              <p className="mt-3 text-sm leading-6 text-[#777469]">
                Click below to let AI analyze your goal and build a structured, step-by-step learning path.
              </p>

              <button
                type="button"
                onClick={handleAnalyzeAndGenerate}
                disabled={actionLoading}
                className="mt-6 rounded-xl bg-[#181818] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#303030] disabled:opacity-50"
              >
                {actionLoading ? "Generating Path with AI..." : "Generate AI Learning Path →"}
              </button>
            </div>
          )}

          {goal.resume && (
            <div className="mt-5 rounded-[24px] bg-[#a98cff] p-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[2px]">Continue learning</p>
              <h3 className="mt-3 font-display text-2xl">{goal.resume.resourceTitle}</h3>
              <p className="mt-2 text-sm text-white/90">Resume from where you left off.</p>

              <a
                href={goal.resume.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#303030]"
              >
                Resume resource →
              </a>
            </div>
          )}
        </div>

        {/* SKILLS */}
        <div className="rounded-[28px] border border-[#d3d0c4] bg-white p-7 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Required skills
          </p>

          <h2 className="mt-3 font-display text-3xl">What you&apos;ll learn</h2>

          <div className="mt-8 space-y-3">
            {skills.length > 0 ? (
              skills.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#e4e1d8] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">
                      {item.skill?.name || "Required skill"}
                    </span>
                    {item.requiredLevel && (
                      <span className="rounded-full bg-[#f0eee5] px-3 py-1 text-[9px] font-bold text-[#777469]">
                        {item.requiredLevel}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-[#777469]">
                No required skills detected yet. Generate a path to automatically detect required skills.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* META */}
      <section className="mt-5 rounded-[28px] border border-[#d3d0c4] bg-white p-7 md:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Status" value={goal.status} />
          <Info label="Created" value={new Date(goal.createdAt).toLocaleDateString()} />
          <Info
            label="Target date"
            value={goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : "Not set"}
          />
        </div>
      </section>
    </PageShell>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[1.5px] text-[#888]">{label}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#858278]">{label}</p>
      <p className="mt-3 text-sm font-medium">{value}</p>
    </div>
  );
}