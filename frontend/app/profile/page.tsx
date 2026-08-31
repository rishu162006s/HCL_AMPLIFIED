"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../components/Pageshell";
import AuthGuard from "../components/AuthGuard";
import { api } from "../lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  technicalLevel?: string | null;
  createdAt?: string;
};

type UserResponse = {
  success: boolean;
  data: User;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response =
          await api.get<UserResponse>("/users/me");

        if (response.success && response.data) {
          setUser(response.data);
          localStorage.setItem(
            "user",
            JSON.stringify(response.data)
          );
        }
      } catch (error) {
        console.error(
          "Unable to load profile:",
          error
        );

        try {
          const storedUser =
            localStorage.getItem("user");

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch {
          // Ignore invalid local user data.
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const name = user?.name || "Learner";
  const initial = name.charAt(0).toUpperCase();

  const level = user?.technicalLevel
    ? formatValue(user.technicalLevel)
    : "Not set";

  const learningSince = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : "2026";

  return (
    <AuthGuard>
      <PageShell>
        <section className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Profile
          </p>

          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            Your learning
            <br />
            <i>identity.</i>
          </h1>
        </section>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="text-sm text-[#777469]">
              Loading your profile...
            </p>
          </div>
        ) : (
          <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="rounded-[28px] bg-[#a98cff] p-7">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[#181818] font-display text-3xl text-white">
                {initial}
              </div>

              <h2 className="mt-7 font-display text-3xl">
                {name}
              </h2>

              <p className="mt-2 text-sm">
                {user?.email || "Personalized learner"}
              </p>

              <div className="mt-10 border-t border-black/10 pt-6">
                <p className="text-[10px] uppercase tracking-[1px]">
                  Learning since
                </p>

                <p className="mt-2 text-sm">
                  {learningSince}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d3d0c4] bg-white p-7">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                Account
              </p>

              <div className="mt-8 space-y-5">
                <Setting
                  title="Name"
                  value={name}
                />

                <Setting
                  title="Email"
                  value={user?.email || "Not available"}
                />

                <Setting
                  title="Technical level"
                  value={level}
                />

                <Setting
                  title="Account status"
                  value="Active"
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/personalization"
                  className="rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
                >
                  Edit preferences →
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-[#d3d0c4] px-5 py-3 text-xs font-bold"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </section>
        )}
      </PageShell>
    </AuthGuard>
  );
}

function Setting({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-[#eeeae0] pb-5">
      <span className="text-sm">{title}</span>

      <span className="max-w-[60%] truncate text-right text-xs text-[#777469]">
        {value}
      </span>
    </div>
  );
}

function formatValue(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}