"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const authenticated = useSyncExternalStore(
    (callback) => {
      window.addEventListener("authchange", callback);
      return () => window.removeEventListener("authchange", callback);
    },
    () => Boolean(localStorage.getItem("token")),
    () => false
  );

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
    }
  }, [router]);

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f5e9]">
      <Navbar />
      <main className="page-width py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}