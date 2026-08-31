import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f5e9] text-[#181818]">

      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#181818] text-white">
            ↗
          </span>

          <span className="font-display text-xl">
            pathwise
          </span>
        </div>

        <div className="hidden items-center gap-8 text-xs md:flex">
          <a href="#how">How it works</a>
          <a href="#ai">AI Coach</a>
          <a href="#features">Features</a>
        </div>

        <Link
          href="/dashboard"
          className="rounded-xl bg-[#181818] px-5 py-3 text-[11px] font-bold text-white"
        >
          Enter Pathwise →
        </Link>
      </nav>

      <section className="mx-auto max-w-[1400px] px-5 pb-20 pt-16 md:px-8 md:pt-24">

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">

          <div>
            <p className="mb-6 text-[10px] font-bold uppercase tracking-[3px] text-[#777469]">
              Personalized learning, reimagined
            </p>

            <h1 className="max-w-4xl font-display text-[58px] leading-[.9] tracking-[-4px] md:text-[94px]">
              Your goal.
              <br />
              <i>Your path.</i>
              <br />
              Your pace.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-[#69675e]">
              Pathwise turns what you want to achieve into an adaptive learning
              journey — powered by AI that understands where you are and what
              you need next.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/goals/create"
                className="rounded-xl bg-[#181818] px-6 py-4 text-xs font-bold text-white"
              >
                Create your goal →
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl border border-[#c7c4b8] bg-white px-6 py-4 text-xs font-bold"
              >
                Explore dashboard
              </Link>
            </div>
          </div>

          <div className="relative">

            <div className="rounded-[36px] bg-[#181818] p-7 text-white shadow-2xl md:p-9">

              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#c8e86b] px-3 py-1.5 text-[9px] font-bold text-[#181818]">
                  AI LEARNING PATH
                </span>

                <span className="text-[10px] text-[#888]">
                  Personalized
                </span>
              </div>

              <p className="mt-12 text-[10px] uppercase tracking-[2px] text-[#888]">
                Your goal
              </p>

              <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
                Become a professional SQL developer
              </h2>

              <div className="mt-9 space-y-3">
                {[
                  ["✓", "SQL Fundamentals", "82%"],
                  ["✓", "Aggregations", "74%"],
                  ["→", "SQL Joins", "61%"],
                  ["○", "Subqueries", "Locked"],
                ].map(([icon, title, value]) => (
                  <div
                    key={title}
                    className="flex items-center gap-4 rounded-2xl bg-[#272727] p-4"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#353535] text-xs">
                      {icon}
                    </span>

                    <span className="flex-1 text-xs">
                      {title}
                    </span>

                    <span className="text-[10px] text-[#aaa]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-[10px] text-[#888]">
                  AI recommends continuing with Joins
                </span>

                <span className="rounded-xl bg-[#c8e86b] px-4 py-3 text-[10px] font-bold text-[#181818]">
                  Continue →
                </span>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-6 hidden rounded-2xl bg-[#a98cff] p-5 shadow-xl sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[1.5px]">
                Learning streak
              </p>

              <p className="mt-2 font-display text-4xl">
                6
              </p>

              <p className="text-[9px]">
                days in a row
              </p>
            </div>

            <div className="absolute -right-5 -top-6 hidden rounded-2xl bg-[#ff9d52] p-5 shadow-xl sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[1.5px]">
                AI insight
              </p>

              <p className="mt-2 max-w-[150px] text-xs font-semibold">
                Focus on your weakest topic.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section id="how" className="border-y border-[#d8d5c8] bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">

          <p className="text-[10px] font-bold uppercase tracking-[3px] text-[#777469]">
            How Pathwise works
          </p>

          <h2 className="mt-4 max-w-2xl font-display text-4xl md:text-6xl">
            Learning that adapts
            <br />
            <i>to you.</i>
          </h2>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <Step number="01" title="Tell us your goal">
              Write your goal naturally. Our AI understands the skill,
              objective, timeline and target.
            </Step>

            <Step number="02" title="Get your path">
              Pathwise builds a structured learning journey around your actual
              needs and current ability.
            </Step>

            <Step number="03" title="Keep improving">
              Your progress, quizzes and mastery continuously inform what you
              should learn next.
            </Step>
          </div>
        </div>
      </section>

      <section
        id="ai"
        className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28"
      >
        <div className="rounded-[36px] bg-[#a98cff] p-8 md:p-14">

          <p className="text-[10px] font-bold uppercase tracking-[3px]">
            AI Coach
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">

            <h2 className="font-display text-5xl leading-[.95] md:text-7xl">
              Not just a
              <br />
              chatbot.
              <br />
              <i>A coach.</i>
            </h2>

            <div className="flex flex-col justify-end">
              <p className="text-lg leading-8">
                Ask why you&apos;re struggling. Ask what to study next. Ask for an
                explanation. Generate a quiz. Get recommendations based on
                your actual learning history.
              </p>

              <Link
                href="/ai"
                className="mt-8 w-fit rounded-xl bg-[#181818] px-5 py-4 text-xs font-bold text-white"
              >
                Meet your AI Coach →
              </Link>
            </div>

          </div>
        </div>
      </section>

      <footer className="border-t border-[#d8d5c8] px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-5 text-xs md:flex-row">
          <span className="font-display text-lg">pathwise</span>
          <span className="text-[#777469]">
            Learn with direction.
          </span>
        </div>
      </footer>
    </main>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-[#d9d6ca] p-7">
      <span className="font-display text-4xl text-[#aaa79c]">
        {number}
      </span>

      <h3 className="mt-10 font-display text-2xl">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-[#6e6c63]">
        {children}
      </p>
    </div>
  );
}