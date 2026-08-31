"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [technicalLevel, setTechnicalLevel] = useState("BEGINNER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/users/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        technicalLevel,
      });

      const response = await api.post<{ success: boolean; data: { token: string; user: any } }>("/users/login", {
        email: email.trim(),
        password,
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("authchange"));
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-6">
      <div className="w-full max-w-md">

        <Link href="/" className="text-xl font-semibold">
          learnflow.
        </Link>

        <div className="mt-10 rounded-[30px] border border-[#dedbd2] bg-[#fffef9] p-8">
          <h1 className="text-3xl font-medium">
            Build your learning path
          </h1>

          <p className="mt-2 text-sm text-[#77736d]">
            Create an account and start learning around your goals.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-[#d9d5cc] bg-transparent p-3.5 outline-none focus:border-[#9b84ae]"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-[#d9d5cc] bg-transparent p-3.5 outline-none focus:border-[#9b84ae]"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-[#d9d5cc] bg-transparent p-3.5 outline-none focus:border-[#9b84ae]"
            />

            <select
              value={technicalLevel}
              onChange={(e) => setTechnicalLevel(e.target.value)}
              className="w-full rounded-xl border border-[#d9d5cc] bg-[#fffef9] p-3.5 outline-none focus:border-[#9b84ae]"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading || !name.trim() || !email.trim() || !password}
              className="w-full rounded-full bg-[#242124] py-3.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-[#77736d]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#695b72]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}