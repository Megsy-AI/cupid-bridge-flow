import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";

// The home page is the Megsy SPA itself (same mount as the catch-all `$` route).
// Dynamic imports keep every app module out of the SSR module graph.
function loadChunk<T>(load: () => Promise<T>): Promise<T> {
  return load().catch(async (err) => {
    await new Promise((r) => setTimeout(r, 400));
    try {
      return await load();
    } catch {
      if (typeof window !== "undefined" && !sessionStorage.getItem("chunk-reloaded")) {
        sessionStorage.setItem("chunk-reloaded", "1");
        window.location.reload();
      }
      throw err;
    }
  });
}

const SpaApp = lazy(() => loadChunk(() => import("@/lib/SpaApp")));

export const Route = createFileRoute("/")({
  ssr: false,
  component: SpaMount,
  head: () => ({
    meta: [
      { title: "Megsy AI — Chat, agents and computer use in one workspace" },
      {
        name: "description",
        content:
          "Megsy AI runs real work for you: chat, deep research, images, video, slides, code and a cloud computer agent — in English and Egyptian Arabic.",
      },
      { property: "og:title", content: "Megsy AI — your AI workspace" },
      {
        property: "og:description",
        content:
          "Chat, deep research, images, video, slides, code and a cloud computer agent that actually finishes the task.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Megsy AI — your AI workspace" },
      {
        name: "twitter:description",
        content:
          "Chat, deep research, images, video, slides, code and a cloud computer agent that actually finishes the task.",
      },
    ],
  }),
});

function SpaMount() {
  const [booted, setBooted] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void loadChunk(() => import("@/lib/spaBoot")).then(
      () => {
        if (!cancelled) setBooted(true);
      },
      () => {
        // Never leave the screen stuck on the boot mark: surface a retry.
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return <BootFailed />;
  if (!booted) return null;
  return (
    <Suspense fallback={null}>
      <SpaApp />
    </Suspense>
  );
}
