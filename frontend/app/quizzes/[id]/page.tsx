"use client";

import { useState } from "react";
import AuthGuard from "../../components/AuthGuard";

export default function QuizPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = [
    "INNER JOIN",
    "LEFT JOIN",
    "CROSS JOIN",
    "RIGHT JOIN",
  ];

  return (
    <AuthGuard><main className="min-h-screen bg-[#f7f5ef] px-6 py-10 text-[#1b1b1b]">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8 flex items-center justify-between">
          <span className="text-sm text-[#81778d]">
            SQL Joins • Question 3 of 10
          </span>

          <span className="rounded-full bg-[#eee8f4] px-3 py-1 text-xs">
            Intermediate
          </span>
        </div>

        <div className="h-2 rounded-full bg-[#e4e1d9]">
          <div className="h-full w-[30%] rounded-full bg-[#9b84ae]" />
        </div>

        <section className="mt-10 rounded-[30px] border border-[#dedbd2] bg-[#fffef9] p-7 lg:p-10">
          <p className="text-sm text-[#81778d]">Question</p>

          <h1 className="mt-4 text-2xl font-medium leading-9">
            Which SQL JOIN returns only rows that have matching values in
            both tables?
          </h1>

          <div className="mt-8 space-y-3">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selected === option
                    ? "border-[#9b84ae] bg-[#eee8f4]"
                    : "border-[#dedbd2] hover:bg-[#f5f2eb]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSubmitted(true)}
            disabled={!selected || submitted}
            className="mt-8 w-full rounded-full bg-[#242124] py-4 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitted ? (selected === "INNER JOIN" ? "Correct answer" : "Answer submitted") : "Submit answer"}
          </button>
        </section>
      </div>
    </main></AuthGuard>
  );
}