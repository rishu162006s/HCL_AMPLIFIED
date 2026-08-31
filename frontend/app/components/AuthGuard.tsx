"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({
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

  return authenticated ? children : null;
}