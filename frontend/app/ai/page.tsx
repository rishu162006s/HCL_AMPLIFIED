"use client";

import { useState } from "react";
import PageShell from "../components/Pageshell";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");

  return (
    <PageShell>

      <section className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#777469]">
          AI learning coach
        </p>

        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[.95] md:text-7xl">
          Ask.
          <br />
          Understand.
          <br />
          <i>Improve.</i>
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-7 text-[#6f6c63]">
          Your AI coach understands your goals, progress, mastery and learning
          history.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">

        <div className="rounded-[30px] bg-[#181818] p-6 text-white md:p-8">

          <div className="min-h-[360px]">
            <div className="max-w-xl rounded-2xl bg-[#292929] p-5">
              <p className="text-[9px] uppercase tracking-[2px] text-[#888]">
                AI Coach
              </p>

              <p className="mt-3 text-sm leading-7">
                You're currently weakest in SQL Joins. I recommend focusing
                on practical join problems before moving to subqueries.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#292929] p-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask your learning coach anything..."
              className="min-h-[80px] w-full resize-none bg-transparent p-3 text-sm outline-none placeholder:text-[#777]"
            />

            <div className="flex justify-end">
              <button className="rounded-xl bg-[#c8e86b] px-5 py-3 text-[10px] font-bold text-[#181818]">
                Ask AI →
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">

          <AIFeature
            title="Explain a concept"
            text="Get a personalized explanation at your level."
          />

          <AIFeature
            title="Generate a quiz"
            text="Create a quiz around your current topic."
          />

          <AIFeature
            title="What should I learn?"
            text="Get recommendations based on your progress."
          />

          <AIFeature
            title="Analyze my progress"
            text="Understand your strengths, weaknesses and trends."
          />

        </div>

      </section>
    </PageShell>
  );
}

function AIFeature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <button className="w-full rounded-[24px] border border-[#d3d0c4] bg-white p-6 text-left transition hover:-translate-y-1">
      <p className="font-display text-2xl">
        {title}
      </p>

      <p className="mt-2 text-xs leading-6 text-[#777469]">
        {text}
      </p>

      <span className="mt-5 inline-block text-[10px] font-bold underline">
        Open →
      </span>
    </button>
  );
}