"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PageShell from "../../components/Pageshell";
import { api } from "../../lib/api";

/* ─── TYPES ─────────────────────────────────────── */
type GoalResponse = {
  success: boolean;
  data?: { id: string; title: string };
  message?: string;
};

type AnalysisResult = {
  analysis: {
    skill: string;
    description: string;
    proficiencyLevel: string;
    targetLevel: string;
    topics: string[];
    estimatedDays: number;
    objective: string;
  };
  goalSkill: { id: string; skillId: string; currentLevel: string; targetLevel: string } | null;
};

type AnalysisResponse = {
  success: boolean;
  data?: AnalysisResult;
  message?: string;
};

type LearningPathResponse = {
  success: boolean;
  data?: {
    id: string;
    title: string;
    description?: string;
    steps: { id: number; order: number; milestone?: string; resource: { id: string; title: string; type: string; url: string } }[];
  };
  message?: string;
};

const RESOURCE_PREFERENCES = [
  { value: "BOOK", label: "Books", icon: "📚", desc: "Textbooks & e-books" },
  { value: "ARTICLE", label: "Articles & Papers", icon: "📄", desc: "Research & web articles" },
  { value: "COURSE", label: "Notes & Courses", icon: "📝", desc: "Structured course content" },
  { value: "VIDEO", label: "Videos", icon: "🎥", desc: "Video lectures & tutorials" },
];

const OBJECTIVES = [
  { value: "PERSONAL", label: "Personal Growth", icon: "🌱" },
  { value: "CAREER", label: "Career Advancement", icon: "💼" },
  { value: "ACADEMIC", label: "Academic Study", icon: "🎓" },
  { value: "INTERVIEW", label: "Interview Prep", icon: "🎯" },
  { value: "PROJECT", label: "Build a Project", icon: "🚀" },
];

const PROFICIENCY_LEVELS = [
  { value: "NONE", label: "No knowledge", color: "#e5e7eb" },
  { value: "BASIC", label: "Beginner", color: "#fde68a" },
  { value: "INTERMEDIATE", label: "Intermediate", color: "#86efac" },
  { value: "EXPERT", label: "Expert", color: "#a78bfa" },
];

/* ─── STEP INDICATOR ────────────────────────────── */
function StepIndicator({ step, total }: { step: number; total: number }) {
  const labels = ["Goal", "Preferences", "Knowledge", "Your Path"];
  return (
    <div className="mb-10 flex items-center justify-center gap-0">
      {labels.map((label, i) => {
        const idx = i + 1;
        const done = idx < step;
        const active = idx === step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  done
                    ? "bg-[#c8e86b] text-[#181818]"
                    : active
                    ? "bg-[#181818] text-white"
                    : "bg-[#e5e3db] text-[#999]"
                }`}
              >
                {done ? "✓" : idx}
              </div>
              <span
                className={`hidden text-[9px] font-semibold uppercase tracking-[1.5px] sm:block ${
                  active ? "text-[#181818]" : "text-[#aaa]"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < total && (
              <div
                className={`mx-2 h-0.5 w-12 sm:w-20 transition-all ${
                  done ? "bg-[#c8e86b]" : "bg-[#d8d5c8]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────── */
export default function CreateGoalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  /* Step 1 */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objective, setObjective] = useState("CAREER");

  /* Step 2 */
  const [selectedResources, setSelectedResources] = useState<string[]>(["COURSE"]);
  const [weeklyHours, setWeeklyHours] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [learningStyle, setLearningStyle] = useState("BALANCED");

  /* Step 3 */
  const [goalId, setGoalId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [userLevel, setUserLevel] = useState("NONE");

  /* Step 4 */
  const [learningPath, setLearningPath] = useState<LearningPathResponse["data"] | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Helpers ───────────────────────────────────── */
  const toggleResource = (val: string) => {
    setSelectedResources((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  /* ── Step 1 → 2 ───────────────────────────────── */
  const handleStep1 = () => {
    if (!title.trim()) {
      setError("Please enter a goal title.");
      return;
    }
    setError("");
    setStep(2);
  };

  /* ── Step 2 → 3: Create Goal + Analyze ────────── */
  const handleStep2 = async () => {
    if (selectedResources.length === 0) {
      setError("Please select at least one resource type.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      /* Create the goal */
      const goalRes = await api.post<GoalResponse>("/goals", {
        title: title.trim(),
        description: description.trim() || undefined,
        objective,
        targetDate: targetDate || undefined,
        weeklyHours: weeklyHours ? Number(weeklyHours) : undefined,
        preferredResourceTypes: selectedResources,
        theoryPracticeRatio: learningStyle,
      });

      if (!goalRes.success || !goalRes.data) {
        throw new Error(goalRes.message || "Unable to create goal.");
      }

      const createdGoalId = goalRes.data.id;
      setGoalId(createdGoalId);

      /* AI analyze the goal */
      const analysisRes = await api.post<AnalysisResponse>("/ai/goals/analyze", {
        goal: `${title.trim()}. ${description.trim()}`,
        goalId: createdGoalId,
      });

      if (!analysisRes.success || !analysisRes.data) {
        throw new Error(analysisRes.message || "AI could not analyze your goal.");
      }

      setAnalysis(analysisRes.data);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3 → 4: Update skill level + Generate path ── */
  const handleStep3 = async () => {
    if (!goalId || !analysis) return;
    setError("");
    setLoading(true);

    try {
      /* If we have a goalSkill from the analysis, update its currentLevel */
      if (analysis.goalSkill) {
        await api.patch(`/goals/${goalId}/skills/${analysis.goalSkill.skillId}`, {
          currentLevel: userLevel,
          targetLevel: "EXPERT",
        });
      }

      /* Generate the learning path */
      const pathRes = await api.post<LearningPathResponse>("/learning-paths/generate", {
        goalId,
      });

      if (!pathRes.success || !pathRes.data) {
        throw new Error(pathRes.message || "Could not generate learning path.");
      }

      setLearningPath(pathRes.data);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 4: Start learning ───────────────────── */
  const handleStartLearning = () => {
    if (learningPath) {
      router.push(`/learning-paths/${learningPath.id}`);
    }
  };

  /* ─── RENDER ─────────────────────────────────── */
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <section className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#777469]">
            Create new goal
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[.95] tracking-[-2px] md:text-6xl">
            {step === 1 && <>What do you want<br /><i>to achieve?</i></>}
            {step === 2 && <>How do you<br /><i>like to learn?</i></>}
            {step === 3 && <>What&apos;s your<br /><i>starting point?</i></>}
            {step === 4 && <>Your path<br /><i>is ready.</i></>}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#6f6c63]">
            {step === 1 && "Tell Pathwise what you want to accomplish. Be as specific as you like — our AI will understand."}
            {step === 2 && "Help us personalize your resources and schedule."}
            {step === 3 && "Tell us your current knowledge level so we can build the right path for you."}
            {step === 4 && "Your AI-generated personalized learning path is ready. Let's start!"}
          </p>
        </section>

        <StepIndicator step={step} total={4} />

        {/* ── STEP 1 ────────────────────────────── */}
        {step === 1 && (
          <div className="rounded-[30px] border border-[#d3d0c4] bg-white p-7 md:p-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                  Goal title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setError(""); }}
                  placeholder="e.g. Become a Machine Learning engineer"
                  className="mt-3 w-full rounded-2xl border border-[#d3d0c4] bg-[#fffef9] px-5 py-4 text-sm outline-none transition focus:border-[#9b84ae]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                  Description <span className="text-[#aaa] normal-case">(optional — helps AI understand better)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="I want to learn Python and ML algorithms so I can work on real-world AI projects..."
                  rows={4}
                  className="mt-3 w-full resize-none rounded-2xl border border-[#d3d0c4] bg-[#fffef9] px-5 py-4 text-sm leading-6 outline-none transition focus:border-[#9b84ae]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                  Objective
                </label>
                <div className="mt-3 grid gap-2 sm:grid-cols-3 md:grid-cols-5">
                  {OBJECTIVES.map((obj) => (
                    <button
                      key={obj.value}
                      type="button"
                      onClick={() => setObjective(obj.value)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                        objective === obj.value
                          ? "border-[#9b84ae] bg-[#eee8f4]"
                          : "border-[#d9d5cc] hover:bg-[#f5f3eb]"
                      }`}
                    >
                      <span className="text-2xl">{obj.icon}</span>
                      <span className="text-[10px] font-semibold leading-tight">{obj.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleStep1}
                  disabled={!title.trim()}
                  className="rounded-xl bg-[#181818] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 ────────────────────────────── */}
        {step === 2 && (
          <div className="rounded-[30px] border border-[#d3d0c4] bg-white p-7 md:p-10">
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                  Preferred resource types
                </label>
                <p className="mt-1 text-xs text-[#999]">Select all that apply — we&apos;ll prioritize these resources for you</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {RESOURCE_PREFERENCES.map((pref) => (
                    <button
                      key={pref.value}
                      type="button"
                      onClick={() => toggleResource(pref.value)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition ${
                        selectedResources.includes(pref.value)
                          ? "border-[#9b84ae] bg-[#eee8f4]"
                          : "border-[#d9d5cc] hover:bg-[#f5f3eb]"
                      }`}
                    >
                      <span className="text-3xl">{pref.icon}</span>
                      <span className="text-xs font-semibold">{pref.label}</span>
                      <span className="text-[10px] text-[#999]">{pref.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                  Learning style
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {[
                    { v: "MORE_THEORY", l: "Theory-focused", d: "Deep concepts & explanations" },
                    { v: "BALANCED", l: "Balanced", d: "Theory + practice mix" },
                    { v: "MORE_PRACTICE", l: "Practice-focused", d: "Hands-on exercises & projects" },
                  ].map(({ v, l, d }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setLearningStyle(v)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        learningStyle === v
                          ? "border-[#9b84ae] bg-[#eee8f4]"
                          : "border-[#d9d5cc] hover:bg-[#f5f3eb]"
                      }`}
                    >
                      <p className="text-sm font-semibold">{l}</p>
                      <p className="mt-1 text-[10px] text-[#777]">{d}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                    Weekly commitment (hours)
                  </label>
                  <input
                    type="number"
                    min="1" max="168"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(e.target.value)}
                    placeholder="e.g. 10"
                    className="mt-3 w-full rounded-2xl border border-[#d3d0c4] bg-[#fffef9] px-5 py-4 text-sm outline-none focus:border-[#9b84ae]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                    Target date <span className="text-[#aaa] normal-case">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-3 w-full rounded-2xl border border-[#d3d0c4] bg-[#fffef9] px-5 py-4 text-sm outline-none focus:border-[#9b84ae]"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  className="rounded-xl border border-[#d3d0c4] px-6 py-3 text-sm font-bold transition hover:bg-[#f7f5ef]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleStep2}
                  disabled={loading}
                  className="rounded-xl bg-[#181818] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Analyzing with AI...
                    </span>
                  ) : "Continue →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 ────────────────────────────── */}
        {step === 3 && analysis && (
          <div className="space-y-5">
            {/* AI analysis result */}
            <div className="rounded-[28px] bg-[#181818] p-7 text-white md:p-8">
              <span className="rounded-full bg-[#c8e86b] px-3 py-1.5 text-[9px] font-bold text-[#181818]">
                AI DETECTED
              </span>
              <h2 className="mt-5 font-display text-3xl">
                {analysis?.analysis?.skill || "Required Skill"}
              </h2>
              {analysis?.analysis?.description && (
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#aaa9a2]">
                  {analysis.analysis.description}
                </p>
              )}
              {analysis?.analysis?.topics && analysis.analysis.topics.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {analysis.analysis.topics.slice(0, 6).map((t) => (
                    <span key={t} className="rounded-full bg-[#292929] px-3 py-1 text-[10px] text-[#ccc]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Current knowledge */}
            <div className="rounded-[28px] border border-[#d3d0c4] bg-white p-7 md:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                Your current level
              </p>
              <h3 className="mt-2 font-display text-2xl">
                How well do you know {analysis?.analysis?.skill || "this skill"}?
              </h3>
              <p className="mt-2 text-sm text-[#777469]">
                Be honest — this helps us build the right path for you.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {PROFICIENCY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setUserLevel(level.value)}
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      userLevel === level.value
                        ? "border-[#181818] bg-[#f7f5ef]"
                        : "border-[#d9d5cc] hover:bg-[#f5f3eb]"
                    }`}
                  >
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: level.color }}
                    />
                    <p className="mt-2 text-sm font-semibold">{level.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => { setStep(2); setError(""); }}
                className="rounded-xl border border-[#d3d0c4] px-6 py-3 text-sm font-bold transition hover:bg-[#f7f5ef]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleStep3}
                disabled={loading}
                className="rounded-xl bg-[#181818] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Building your path...
                  </span>
                ) : "Generate My Learning Path →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4 ────────────────────────────── */}
        {step === 4 && learningPath && (
          <div className="space-y-5">
            {/* Path overview */}
            <div className="rounded-[28px] bg-[#a98cff] p-7 md:p-8">
              <span className="rounded-full bg-[#181818] px-3 py-1.5 text-[9px] font-bold text-white">
                YOUR PERSONALIZED PATH
              </span>
              <h2 className="mt-5 font-display text-3xl">
                {learningPath.title}
              </h2>
              {learningPath.description && (
                <p className="mt-3 max-w-xl text-sm leading-6">
                  {learningPath.description}
                </p>
              )}
              <p className="mt-4 text-sm font-semibold">
                {learningPath.steps.length} learning resources across your path
              </p>
            </div>

            {/* Preview of steps */}
            <div className="rounded-[28px] border border-[#d3d0c4] bg-white p-7 md:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                Learning steps preview
              </p>
              <div className="mt-5 space-y-3">
                {learningPath.steps.slice(0, 5).map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-4 rounded-2xl border border-[#e4e1d8] p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0eee5] text-[10px] font-bold text-[#777]">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{step.resource.title}</p>
                      {step.milestone && (
                        <p className="mt-0.5 text-[10px] text-[#999]">{step.milestone}</p>
                      )}
                      <span className="mt-1 inline-block rounded-full bg-[#f0eee5] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[1px] text-[#777]">
                        {step.resource.type}
                      </span>
                    </div>
                  </div>
                ))}
                {learningPath.steps.length > 5 && (
                  <p className="text-center text-xs text-[#999]">
                    + {learningPath.steps.length - 5} more resources in your path
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartLearning}
              className="w-full rounded-2xl bg-[#181818] py-5 text-sm font-bold text-white transition hover:bg-[#303030]"
            >
              Start Learning →
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
