import PageShell from "../components/Pageshell";
import GoalCard from "../components/GoalCard";
import Link from "next/link";

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

export default function GoalsPage() {
  return (
    <PageShell>

      <section className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Goals
          </p>

          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            What are you
            <br />
            <i>building toward?</i>
          </h1>
        </div>

        <Link
          href="/goals/create"
          className="w-fit rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
        >
          + Create Goal
        </Link>
      </section>

      <div className="mb-8 flex gap-2">
        <Filter active label="All goals" />
        <Filter label="Active" />
        <Filter label="Completed" />
      </div>

      <section className="space-y-4">
        {goals.map((goal) => (
          <GoalCard key={goal.title} goal={goal} />
        ))}
      </section>

    </PageShell>
  );
}

function Filter({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-[10px] font-bold ${
        active
          ? "bg-[#181818] text-white"
          : "border border-[#ccc9bd] bg-white"
      }`}
    >
      {label}
    </button>
  );
}