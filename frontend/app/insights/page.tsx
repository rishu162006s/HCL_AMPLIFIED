"use client";

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-10 text-[#1b1b1b] lg:px-10">
      <div className="mx-auto max-w-6xl">

        <p className="text-sm font-medium text-[#81778d]">
          AI learning analysis
        </p>

        <h1 className="mt-2 text-4xl font-medium">
          Your Learning Insights
        </h1>

        <div className="mt-10 rounded-[30px] bg-[#242124] p-8 text-white lg:p-10">
          <p className="text-sm text-[#c9bfd1]">AI assessment</p>

          <h2 className="mt-4 text-2xl font-medium">
            You are making good progress, but SQL Joins need attention.
          </h2>

          <p className="mt-5 max-w-3xl leading-7 text-[#c7c2c7]">
            Your consistency is strong and your quiz performance is improving.
            Your strongest areas are SQL fundamentals and aggregations, while
            joins remain the main area holding back your overall proficiency.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-white/15">
              <div className="h-full w-[55%] rounded-full bg-[#c7afd3]" />
            </div>
            <span className="text-sm">55% goal progress</span>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <InsightCard
            title="Strengths"
            items={[
              "Strong SQL fundamentals",
              "Improving quiz scores",
              "Consistent learning habit",
              "Good aggregation knowledge",
            ]}
          />

          <InsightCard
            title="Focus areas"
            items={[
              "SQL joins",
              "Remaining curriculum",
              "Hands-on practice",
              "Query optimization",
            ]}
          />
        </div>
      </div>
    </main>
  );
}

function InsightCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[26px] border border-[#dedbd2] bg-[#fffef9] p-7">
      <h2 className="text-xl font-medium">{title}</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm text-[#68645f]">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#9b84ae]" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}