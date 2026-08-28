import Link from "next/link";
import ProgressBar from "./ProgressBar";

export default function PathCard({
  title,
  skill,
  progress,
  completed,
  total,
  current,
}: {
  title: string;
  skill: string;
  progress: number;
  completed: number;
  total: number;
  current: string;
}) {
  return (
    <div className="rounded-[26px] border border-[#d6d3c8] bg-white p-6">

      <div className="flex items-start justify-between gap-5">
        <div>
          <span className="rounded-full bg-[#f0eee5] px-3 py-1 text-[9px] font-bold">
            {skill}
          </span>

          <h3 className="mt-5 font-display text-2xl leading-tight">
            {title}
          </h3>
        </div>

        <span className="font-display text-3xl">
          {progress}%
        </span>
      </div>

      <div className="mt-7">
        <ProgressBar value={progress} />

        <div className="mt-2 flex justify-between text-[10px] text-[#858278]">
          <span>
            {completed} of {total} completed
          </span>

          <span>Current: {current}</span>
        </div>
      </div>

      <Link
        href="/learn"
        className="mt-7 inline-block rounded-xl bg-[#181818] px-4 py-3 text-[10px] font-bold text-white"
      >
        Continue →
      </Link>
    </div>
  );
}