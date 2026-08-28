export default function ProgressBar({
  value,
  dark = false,
}: {
  value: number;
  dark?: boolean;
}) {
  return (
    <div
      className={`h-2 overflow-hidden rounded-full ${
        dark ? "bg-[#383837]" : "bg-[#e5e2d8]"
      }`}
    >
      <div
        className={`h-full rounded-full ${
          dark ? "bg-[#c8e86b]" : "bg-[#55734b]"
        }`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}