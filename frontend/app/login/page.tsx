"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
    const response = await api.post<{
  success: boolean;
  data: {
    token: string;
    user?: unknown;
  };
}>("/users/login", {
  email: email.trim(),
  password,
});

const token = response.data?.token;
const user = response.data?.user;

      if (!token) {
        throw new Error(
          "Login succeeded but no authentication token was returned."
        );
      }

      // Store authentication information
      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      // Go to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-6">
      <div className="w-full max-w-md">

        <Link
          href="/"
          className="text-xl font-semibold"
        >
          learnflow.
        </Link>

        <div className="mt-10 rounded-[30px] border border-[#dedbd2] bg-[#fffef9] p-8">

          <h1 className="text-3xl font-medium">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-[#77736d]">
            Continue where you left off.
          </p>

          <div className="mt-8 space-y-4">

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Email"
              autoComplete="email"
              className="w-full rounded-xl border border-[#d9d5cc] bg-transparent p-3.5 outline-none focus:border-[#9b84ae]"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-[#d9d5cc] bg-transparent p-3.5 outline-none focus:border-[#9b84ae]"
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-full bg-[#242124] py-3.5 text-sm font-medium text-white transition hover:bg-[#353136] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </div>

          <p className="mt-6 text-center text-sm text-[#77736d]">
            Don&apos;t have an account?{" "}

            <Link
              href="/register"
              className="font-medium text-[#695b72]"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}