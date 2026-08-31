"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import PageShell from "../components/Pageshell";
import { api } from "../lib/api";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type:
    | "COURSE"
    | "PROJECT"
    | "ARTICLE"
    | "VIDEO"
    | "BOOK"
    | "ASSESSMENT";
  difficulty:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED"
    | null;
};

type ResourcesResponse = {
  success: boolean;
  data: Resource[];
};

type ProgressResponse = {
  success: boolean;
  data: {
    id: string;
    resourceId: string;
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    progress: number;
  };
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingResource, setOpeningResource] = useState<string | null>(null);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<ResourcesResponse>("/resources");

        if (!response.success) {
          throw new Error("Unable to load resources.");
        }

        setResources(response.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load resources."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const openResource = async (resource: Resource) => {
    try {
      setOpeningResource(resource.id);

      try {
        await api.post<ProgressResponse>("/progress", {
          resourceId: resource.id,
          status: "IN_PROGRESS",
          progress: 1,
        });
      } catch (err) {
        console.error("Unable to update resource progress:", err);
      }

      window.open(
        resource.url,
        "_blank",
        "noopener,noreferrer"
      );
    } finally {
      setOpeningResource(null);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      resource.title.toLowerCase().includes(query) ||
      resource.description?.toLowerCase().includes(query) ||
      resource.type.toLowerCase().includes(query) ||
      resource.difficulty?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <AuthGuard>
        <PageShell>
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-[#777469]">
              Loading resources...
            </p>
          </div>
        </PageShell>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <PageShell>
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        </PageShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <PageShell>
        <section className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Resources
          </p>

          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            Learn from
            <br />
            <i>the right material.</i>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
            Explore courses, articles, videos, projects and
            other learning material.
          </p>
        </section>

        <div className="mb-7 rounded-2xl border border-[#d3d0c4] bg-white p-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, videos, documentation..."
            className="w-full bg-transparent px-4 py-3 text-sm outline-none"
          />
        </div>

        {resources.length === 0 ? (
          <div className="rounded-[28px] border border-[#d4d1c6] bg-white p-8">
            <h3 className="font-display text-2xl">
              No resources available.
            </h3>

            <p className="mt-3 text-sm text-[#777469]">
              Resources will appear here once they are added
              to the platform.
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-[28px] border border-[#d4d1c6] bg-white p-8">
            <h3 className="font-display text-2xl">
              No matching resources.
            </h3>

            <p className="mt-3 text-sm text-[#777469]">
              Try searching with a different title,
              resource type or difficulty.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-[26px] border border-[#d4d1c6] bg-white p-6 transition hover:-translate-y-1"
              >
                <span className="rounded-full bg-[#f0eee5] px-3 py-1 text-[9px] font-bold">
                  {resource.type}
                </span>

                <h3 className="mt-8 font-display text-2xl">
                  {resource.title}
                </h3>

                {resource.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#777469]">
                    {resource.description}
                  </p>
                )}

                {resource.difficulty && (
                  <div className="mt-4">
                    <span className="rounded-full bg-[#f5f3eb] px-3 py-1 text-[9px] font-bold text-[#777469]">
                      {resource.difficulty}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => openResource(resource)}
                  disabled={openingResource === resource.id}
                  className="mt-7 text-xs font-bold underline disabled:opacity-50"
                >
                  {openingResource === resource.id
                    ? "Opening..."
                    : "Open resource →"}
                </button>
              </div>
            ))}
          </div>
        )}
      </PageShell>
    </AuthGuard>
  );
}