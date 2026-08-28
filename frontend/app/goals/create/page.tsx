"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateGoalPage() {
  const [goal, setGoal] = useState("");

  return (
    <main className="min-h-screen bg-[#f7f5e9]">
      <div className="mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-16">

        <Link
          href="/dashboard"
          className="text-xs font-bold underline"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_420px]">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#777469]">
              New goal
            </p>

            <h1 className="mt-5 font-display text-5xl leading-[.95] md:text-7xl">
              Tell us what
              <br />
              you want to
              <br />
              <i>become.</i>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-[#6f6c63]">
              Don't worry about formatting. Write your goal naturally.
              Pathwise's AI will understand the skill, timeline, target level
              and objective.
            </p>

            <div className="mt-10 rounded-[28px] border border-[#d4d1c5] bg-white p-6">

              <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                Your goal
              </label>

              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Example: I want to become a professional Python developer in one month..."
                className="mt-5 min-h-[180px] w-full resize-none rounded-2xl bg-[#f7f5e9] p-5 text-base outline-none placeholder:text-[#aaa79d] focus:ring-2 focus:ring-[#a98cff]"
              />

              <button
                disabled={!goal.trim()}
                className="mt-4 w-full rounded-xl bg-[#181818] px-5 py-4 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Understand my goal with AI →
              </button>

            </div>
          </div>

          <div className="h-fit rounded-[30px] bg-[#a98cff] p-7 md:p-9">
            <p className="text-[10px] font-bold uppercase tracking-[2px]">
              What happens next?
            </p>

            <div className="mt-10 space-y-7">

              <Info
                number="01"
                title="AI understands your goal"
                text="Your natural language goal is converted into structured learning requirements."
              />

              <Info
                number="02"
                title="Your path is generated"
                text="The system creates the skills, topics and progression needed to reach your target."
              />

              <Info
                number="03"
                title="Your journey adapts"
                text="Your quiz results and progress influence what you should learn next."
              />

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function Info({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <span className="text-xs font-bold">
        {number}
      </span>

      <h3 className="mt-2 font-display text-2xl">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6">
        {text}
      </p>
    </div>
  );
}