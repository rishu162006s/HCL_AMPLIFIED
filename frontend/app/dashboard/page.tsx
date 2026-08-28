import Link from "next/link";
import PageShell from "../components/Pageshell";
import ProgressBar from "../components/ProgressBar";
import GoalCard from "../components/GoalCard";
import SectionTitle from "../components/SectionTitle";

const goals = [
  {
    title: "Become a professional SQL developer",
    skill: "SQL",
    progress: 55,
    quiz: 72,
    streak: 6,
    next: "Joins",
    completed: 4,
    total: 8,
  },
  {
    title: "Master backend development",
    skill: "Backend",
    progress: 32,
    quiz: 68,
    streak: 4,
    next: "REST APIs",
    completed: 3,
    total: 10,
  },
];

export default function DashboardPage() {
  return (
    <PageShell>

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
              Your goals, learning paths, progress and AI guidance — all
              connected in one place.
            </p>
          </div>

          <Link
            href="/goals/create"
            className="w-fit rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
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
              RESUME LEARNING
            </span>

            <p className="mt-12 text-[10px] uppercase tracking-[2px] text-[#858580]">
              Current topic
            </p>

            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-5xl">
              SQL Joins — Inner, Left, Right & Full
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#aaa9a2]">
              Your AI coach identified this as your biggest opportunity for
              improvement.
            </p>

            <div className="mt-8 max-w-xl">
              <div className="mb-2 flex justify-between text-[10px] text-[#888]">
                <span>Topic mastery</span>
                <span>61%</span>
              </div>

              <ProgressBar value={61} dark />
            </div>

            <Link
              href="/learn"
              className="mt-8 inline-block rounded-xl bg-[#c8e86b] px-5 py-3 text-xs font-bold text-[#181818]"
            >
              Resume learning →
            </Link>
          </div>

          <div className="bg-[#292929] p-7 md:p-10">
            <p className="text-[10px] uppercase tracking-[2px] text-[#858580]">
              Learning streak
            </p>

            <p className="mt-7 font-display text-7xl">
              6
            </p>

            <p className="mt-2 text-sm text-[#aaa]">
              consecutive days
            </p>

            <div className="mt-12 border-t border-[#444] pt-6">
              <p className="text-[10px] text-[#888]">
                Overall goal progress
              </p>

              <p className="mt-2 font-display text-3xl">
                55%
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* METRICS */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Active goals" value="2" />
        <Metric label="Goal progress" value="44%" />
        <Metric label="Quiz average" value="72%" />
        <Metric label="Learning streak" value="6d" />
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
          {goals.map((goal) => (
            <GoalCard key={goal.title} goal={goal} />
          ))}
        </div>
      </section>

      {/* LOWER */}
      <section className="grid gap-5 lg:grid-cols-3">

        <div className="rounded-[28px] bg-[#a98cff] p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px]">
            Current path
          </p>

          <h3 className="mt-10 font-display text-3xl">
            SQL for Backend Development
          </h3>

          <p className="mt-4 text-sm">
            4 of 8 topics completed.
          </p>

          <div className="mt-7">
            <ProgressBar value={50} />
          </div>

          <Link
            href="/learn"
            className="mt-8 inline-block text-xs font-bold underline"
          >
            Continue path →
          </Link>
        </div>

        <div className="rounded-[28px] border border-[#d2cfc1] bg-white p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Mastery
          </p>

          <h3 className="mt-3 font-display text-2xl">
            Where you stand
          </h3>

          <div className="mt-8 space-y-5">
            <Mastery name="Fundamentals" value={82} />
            <Mastery name="Aggregations" value={74} />
            <Mastery name="Joins" value={61} />
            <Mastery name="Subqueries" value={58} />
          </div>

          <Link
            href="/analytics"
            className="mt-7 inline-block text-xs font-bold underline"
          >
            Detailed analytics →
          </Link>
        </div>

        <div className="rounded-[28px] bg-[#ff9d52] p-7">
          <p className="text-[10px] font-bold uppercase tracking-[2px]">
            AI Coach
          </p>

          <h3 className="mt-10 font-display text-3xl">
            Your next move is clear.
          </h3>

          <p className="mt-4 text-sm leading-6">
            Spend your next session improving SQL Joins before moving into
            advanced subqueries.
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
      <div className="mb-2 flex justify-between text-[10px]">
        <span>{name}</span>
        <strong>{value}%</strong>
      </div>

      <ProgressBar value={value} />
    </div>
  );
}