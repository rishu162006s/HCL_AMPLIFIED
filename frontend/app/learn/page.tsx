import PageShell from "../components/Pageshell";
import PathCard from "../components/PathCard";
import ProgressBar from "../components/ProgressBar";
import Link from "next/link";

const paths = [
  {
    title: "SQL for Backend Development",
    skill: "SQL",
    progress: 50,
    completed: 4,
    total: 8,
    current: "SQL Joins",
  },
  {
    title: "Backend Development Foundations",
    skill: "Backend",
    progress: 32,
    completed: 3,
    total: 10,
    current: "REST APIs",
  },
];

export default function LearnPage() {
  return (
    <PageShell>

      <section className="mb-12">
        <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#777469]">
          Your learning
        </p>

        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[.95] md:text-7xl">
          Learn at
          <br />
          <i>your pace.</i>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
          Your learning paths, topics, quizzes and mastery live here.
        </p>
      </section>

      <section className="mb-12">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
              Learning paths
            </p>

            <h2 className="mt-2 font-display text-3xl">
              Continue where you left off.
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {paths.map((path) => (
            <PathCard key={path.title} {...path} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">

        <div className="rounded-[28px] bg-[#c8e86b] p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px]">
            Current topic
          </p>

          <h3 className="mt-10 font-display text-3xl">
            SQL Joins
          </h3>

          <p className="mt-3 text-sm leading-6">
            Inner, Left, Right and Full joins.
          </p>

          <div className="mt-7">
            <ProgressBar value={61} />
          </div>

          <Link
            href="/ai"
            className="mt-7 inline-block text-xs font-bold underline"
          >
            Ask AI to explain →
          </Link>
        </div>

        <div className="rounded-[28px] border border-[#d2cfc1] bg-white p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Quiz performance
          </p>

          <p className="mt-8 font-display text-6xl">
            72%
          </p>

          <p className="mt-3 text-sm text-[#777469]">
            Average across recent quizzes
          </p>

          <Link
            href="/ai"
            className="mt-8 inline-block text-xs font-bold underline"
          >
            Generate a quiz →
          </Link>
        </div>

        <div className="rounded-[28px] bg-[#a98cff] p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px]">
            Skills
          </p>

          <h3 className="mt-10 font-display text-3xl">
            SQL
          </h3>

          <p className="mt-3 text-sm">
            4 topics completed · 4 remaining
          </p>

          <Link
            href="/analytics"
            className="mt-8 inline-block text-xs font-bold underline"
          >
            View skill progress →
          </Link>
        </div>

      </section>
    </PageShell>
  );
}