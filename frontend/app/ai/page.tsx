"use client";

import { useState, useRef, useEffect } from "react";
import PageShell from "../components/Pageshell";
import { api } from "../lib/api";

type AIResponse = {
  success: boolean;
  data: unknown;
  message?: string;
};

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const extractAnswer = (data: unknown): string => {
    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object" && data !== null) {
      const result = data as Record<string, unknown>;

      const possibleFields = [
        "answer",
        "explanation",
        "content",
        "response",
        "message",
        "text",
      ];

      for (const field of possibleFields) {
        if (typeof result[field] === "string") {
          return result[field] as string;
        }
      }

      const strings = Object.values(result).filter(
        (value): value is string => typeof value === "string"
      );

      if (strings.length > 0) {
        return strings.join("\n\n");
      }
    }

    return String(data ?? "");
  };

  const handleAsk = async () => {
    const question = prompt.trim();

    if (!question || loading) {
      return;
    }

    const newMessages: Message[] = [...messages, { role: "user", text: question }];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);
    setError("");

    try {
      const response = await api.post<AIResponse>("/ai/explain", {
        concept: question,
        level: "INTERMEDIATE",
        context:
          "The learner is using the Pathwise personalized learning coach. Provide a clear, practical explanation suitable for an intermediate learner.",
      });

      if (!response.success) {
        throw new Error(
          response.message || "The AI coach could not process your request."
        );
      }

      const result = extractAnswer(response.data);

      if (!result.trim()) {
        throw new Error("The AI coach returned an empty response.");
      }

      setMessages([...newMessages, { role: "ai", text: result }]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reach the AI coach."
      );
    } finally {
      setLoading(false);
    }
  };

  const useSuggestion = (text: string) => {
    setPrompt(text);
    setError("");
  };

  return (
    <PageShell>
      <section className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#777469]">
          AI learning coach
        </p>

        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[.95] md:text-7xl">
          Ask.
          <br />
          Understand.
          <br />
          <i>Improve.</i>
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-7 text-[#6f6c63]">
          Ask questions, clarify difficult concepts and get personalized guidance
          based on your learning journey.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col rounded-[30px] bg-[#181818] p-6 text-white md:p-8">
          <div className="flex-1 overflow-y-auto min-h-[360px] max-h-[500px] mb-4 pr-2 custom-scrollbar">
            {messages.length === 0 && !loading && !error && (
              <div className="max-w-xl rounded-2xl bg-[#292929] p-5">
                <p className="text-[9px] uppercase tracking-[2px] text-[#888]">
                  AI Coach
                </p>

                <p className="mt-3 text-sm leading-7 text-[#ddd]">
                  Ask me about a concept you're learning. I can explain it step by
                  step, give examples or help you understand where you're
                  struggling.
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-5 text-sm leading-7 ${
                      msg.role === "user"
                        ? "bg-[#292929] text-white"
                        : "bg-[#c8e86b] text-[#181818]"
                    }`}
                  >
                    <p
                      className={`mb-3 text-[9px] font-bold uppercase tracking-[2px] ${
                        msg.role === "user" ? "text-[#888]" : "opacity-60"
                      }`}
                    >
                      {msg.role === "user" ? "You" : "AI Coach"}
                    </p>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-xl rounded-2xl bg-[#292929] p-5">
                    <p className="text-[9px] uppercase tracking-[2px] text-[#888]">
                      AI Coach
                    </p>
                    <p className="mt-3 text-sm text-[#ccc] flex space-x-1 items-center">
                      <span>Thinking</span>
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-start">
                  <div className="max-w-xl rounded-2xl border border-red-400/30 bg-red-500/10 p-5">
                    <p className="text-sm leading-6 text-red-300">{error}</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="rounded-2xl bg-[#292929] p-2 mt-auto shrink-0">
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              placeholder="Ask your learning coach anything..."
              className="min-h-[100px] w-full resize-none bg-transparent p-3 text-sm leading-6 outline-none placeholder:text-[#777]"
            />

            <div className="flex items-center justify-between gap-3 px-2 pb-2">
              <span className="text-[9px] text-[#777]">
                Enter to ask · Shift + Enter for a new line
              </span>

              <button
                type="button"
                onClick={handleAsk}
                disabled={loading || !prompt.trim()}
                className="rounded-xl bg-[#c8e86b] px-5 py-3 text-[10px] font-bold text-[#181818] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Ask AI →"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <AIFeature
            title="Explain a concept"
            text="Get a clear explanation at your current learning level."
            onClick={() => useSuggestion("Explain SQL JOINs with simple examples.")}
          />

          <AIFeature
            title="Help me practice"
            text="Ask for practical examples or exercises around a topic."
            onClick={() =>
              useSuggestion(
                "Give me a practical SQL JOIN exercise and explain the solution."
              )
            }
          />

          <AIFeature
            title="What should I learn?"
            text="Get guidance on what to focus on next."
            onClick={() =>
              useSuggestion(
                "What should I learn next to become a better SQL developer?"
              )
            }
          />

          <AIFeature
            title="Analyze my progress"
            text="Ask for help understanding your strengths and weaknesses."
            onClick={() =>
              useSuggestion(
                "Based on my learning journey, what should I focus on improving?"
              )
            }
          />
        </div>
      </section>
    </PageShell>
  );
}

function AIFeature({
  title,
  text,
  onClick,
}: {
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[24px] border border-[#d3d0c4] bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"
    >
      <p className="font-display text-2xl">{title}</p>

      <p className="mt-2 text-xs leading-6 text-[#777469]">{text}</p>

      <span className="mt-5 inline-block text-[10px] font-bold underline">
        Use suggestion →
      </span>
    </button>
  );
}