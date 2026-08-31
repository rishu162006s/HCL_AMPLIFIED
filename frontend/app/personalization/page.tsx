"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import PageShell from "../components/Pageshell";
import { api } from "../lib/api";

type Preferences = {
  experienceLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  dailyLearningMinutes: number;
  learningStyle: "THEORY" | "PRACTICE" | "MIXED";
  aiPersonalization: boolean;
};

type PreferencesResponse = {
  success: boolean;
  data: Preferences;
};

const learningTimes = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "2+ hours", value: 120 },
];

export default function PersonalizationPage() {
  const [preferences, setPreferences] =
    useState<Preferences>({
      experienceLevel: "INTERMEDIATE",
      dailyLearningMinutes: 60,
      learningStyle: "MIXED",
      aiPersonalization: true,
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);

        const response =
          await api.get<PreferencesResponse>(
            "/users/preferences"
          );

        if (response.success && response.data) {
          setPreferences(response.data);
        }
      } catch (err) {
        /*
         * Keep sensible defaults if the backend does not
         * expose preferences yet.
         */
        console.error(
          "Unable to load preferences:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const savePreferences = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response =
        await api.put<PreferencesResponse>(
          "/users/preferences",
          preferences
        );

      if (!response.success) {
        throw new Error(
          "Unable to save preferences."
        );
      }

      if (response.data) {
        setPreferences(response.data);
      }

      setMessage("Preferences saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save preferences."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <PageShell>
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-[#777469]">
              Loading preferences...
            </p>
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
            Your learning preferences
          </p>

          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            Make learning
            <br />
            <i>fit you.</i>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
            These preferences help Pathwise adapt your
            learning experience to your pace and current
            ability.
          </p>
        </section>

        <div className="max-w-4xl space-y-5">
          <section className="rounded-[26px] border border-[#d3d0c4] bg-white p-7">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
              Experience
            </p>

            <h2 className="mt-3 font-display text-2xl">
              Current technical level
            </h2>

            <select
              value={preferences.experienceLevel}
              onChange={(e) =>
                setPreferences((previous) => ({
                  ...previous,
                  experienceLevel:
                    e.target.value as Preferences["experienceLevel"],
                }))
              }
              className="mt-5 w-full rounded-xl border border-[#d9d5cc] bg-white p-3.5 text-sm outline-none focus:border-[#9b84ae]"
            >
              <option value="BEGINNER">
                Beginner
              </option>
              <option value="INTERMEDIATE">
                Intermediate
              </option>
              <option value="ADVANCED">
                Advanced
              </option>
            </select>
          </section>

          <section className="rounded-[26px] border border-[#d3d0c4] bg-white p-7">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
              Daily commitment
            </p>

            <h2 className="mt-3 font-display text-2xl">
              How much time can you learn?
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {learningTimes.map((time) => (
                <button
                  key={time.value}
                  type="button"
                  onClick={() =>
                    setPreferences((previous) => ({
                      ...previous,
                      dailyLearningMinutes:
                        time.value,
                    }))
                  }
                  className={`rounded-full border px-5 py-3 text-sm transition ${
                    preferences.dailyLearningMinutes ===
                    time.value
                      ? "border-[#181818] bg-[#181818] text-white"
                      : "border-[#d9d5cc] hover:bg-[#eee8f4]"
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[26px] border border-[#d3d0c4] bg-white p-7">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
              Learning style
            </p>

            <h2 className="mt-3 font-display text-2xl">
              How do you learn best?
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["THEORY", "Theory"],
                ["PRACTICE", "Practice"],
                ["MIXED", "Mixed"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setPreferences((previous) => ({
                      ...previous,
                      learningStyle:
                        value as Preferences["learningStyle"],
                    }))
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    preferences.learningStyle === value
                      ? "border-[#9b84ae] bg-[#eee8f4]"
                      : "border-[#d9d5cc] hover:bg-[#f5f3eb]"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {label}
                  </p>

                  <p className="mt-1 text-xs text-[#777469]">
                    {value === "THEORY"
                      ? "Concepts and explanations"
                      : value === "PRACTICE"
                      ? "Exercises and projects"
                      : "A balance of both"}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[26px] border border-[#d3d0c4] bg-white p-7">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                  AI personalization
                </p>

                <h2 className="mt-3 font-display text-2xl">
                  Adaptive recommendations
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#777469]">
                  Allow your progress, quiz results and
                  learning history to influence what you
                  should learn next.
                </p>
              </div>

              <button
                type="button"
                aria-label="Toggle AI personalization"
                onClick={() =>
                  setPreferences((previous) => ({
                    ...previous,
                    aiPersonalization:
                      !previous.aiPersonalization,
                  }))
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  preferences.aiPersonalization
                    ? "bg-[#181818]"
                    : "bg-[#d3d0c4]"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    preferences.aiPersonalization
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={savePreferences}
            disabled={saving}
            className="rounded-xl bg-[#181818] px-7 py-3.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save preferences →"}
          </button>
        </div>
      </PageShell>
    </AuthGuard>
  );
}