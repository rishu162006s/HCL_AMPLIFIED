import Link from "next/link";
import ProgressBar from "./ProgressBar";

type Goal = {
  title: string;
  skill: string;
  progress: number;
  quiz: number;
  streak: number;
  next: string;
  completed: number;
  total: number;
};

export default function GoalCard({ goal }: { goal: Goal }) {
  return (
    <div className="rounded-[24px] border border-[#e0ddd3] bg-[#faf9f4] p-5 md:p-6">

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center">

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#181818] px-2.5 py-1 text-[9px] font-bold text-white">
              {goal.skill}
            </span>

            <span className="text-[10px] text-[#858278]">
              Active goal
            </span>
          </div>

          <h3 className="mt-3 text-lg font-semibold">
            {goal.title}
          </h3>

          <div className="mt-5 max-w-xl">
            <div className="mb-2 flex justify-between text-[10px] text-[#777469]">
              <span>
                {goal.completed} / {goal.total} topics
              </span>

              <span>{goal.progress}%</span>
            </div>

            <ProgressBar value={goal.progress} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 xl:w-[280px]">
          <Stat label="Quiz" value={`${goal.quiz}%`} />
          <Stat label="Streak" value={`${goal.streak}d`} />
          <Stat label="Next" value={goal.next} />
        </div>

        <Link
          href="/learn"
          className="rounded-xl bg-[#181818] px-5 py-3 text-center text-[10px] font-bold text-white"
        >
          Resume →
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="text-[8px] uppercase tracking-[1px] text-[#89877e]">
        {label}
      </p>

      <p className="mt-2 truncate text-xs font-bold">
        {value}
      </p>
    </div>
  );
}