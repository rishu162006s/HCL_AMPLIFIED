import Link from "next/link";

export default function SectionTitle({
  eyebrow,
  title,
  action,
  href,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
          {eyebrow}
        </p>

        <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
          {title}
        </h2>
      </div>

      {action && href && (
        <Link href={href} className="text-xs font-bold underline">
          {action} →
        </Link>
      )}
    </div>
  );
}