"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/learn", label: "Learn" },
  { href: "/goals", label: "Goals" },
  { href: "/ai", label: "AI Coach" },
  { href: "/resources", label: "Resources" },
  { href: "/analytics", label: "Analytics" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d5c8] bg-[#f7f5e9]/95 backdrop-blur-xl">
      <div className="page-width">
        <div className="flex h-[74px] items-center justify-between gap-5">

          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#181818] text-sm text-white">
              ↗
            </span>

            <span className="font-display text-xl tracking-tight">
              pathwise
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3.5 py-2.5 text-[11px] font-medium transition ${
                    active
                      ? "bg-[#181818] text-white"
                      : "text-[#68665e] hover:bg-white hover:text-[#181818]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/goals/create"
              className="hidden rounded-xl bg-[#181818] px-4 py-2.5 text-[11px] font-bold text-white transition hover:-translate-y-0.5 sm:block"
            >
              + Create Goal
            </Link>

            <Link
              href="/profile"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#a98cff] text-xs font-bold"
            >
              K
            </Link>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-[#cbc8ba] bg-white px-3.5 py-2 text-[10px] font-semibold"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}