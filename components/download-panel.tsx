"use client";

import { useRef, useState } from "react";
import { Download, Loader2, X } from "lucide-react";
import { renderMediaOnWeb } from "@remotion/web-renderer";
import { Button } from "@/components/ui/button";
import { IntroVideo } from "@/remotion/IntroVideo";
import { videoConfig } from "@/remotion/config";
import { cn } from "@/lib/utils";

const presets = [
  {
    id: "1080p",
    label: "1080p HQ",
    detail: "1920×1080 · 60fps · very-high bitrate",
    scale: 1.5,
    videoBitrate: "very-high",
  },
  {
    id: "720p",
    label: "720p",
    detail: "1280×720 · 60fps · faster export",
    scale: 1,
    videoBitrate: "high",
  },
] as const;

type PresetId = (typeof presets)[number]["id"];

type Status =
  | { kind: "idle" }
  | { kind: "rendering"; progress: number; etaMs: number | null }
  | { kind: "done"; url: string; sizeMb: number }
  | { kind: "error"; message: string };

const durationInFrames = Math.floor(
  (videoConfig.fallbackDurationSec + videoConfig.outro.durationSec) * videoConfig.fps,
);

export function DownloadPanel() {
  const [presetId, setPresetId] = useState<PresetId>("1080p");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const preset = presets.find((p) => p.id === presetId) ?? presets[0];
  const isRendering = status.kind === "rendering";

  async function startRender() {
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus({ kind: "rendering", progress: 0, etaMs: null });

    try {
      const { getBlob } = await renderMediaOnWeb({
        composition: {
          id: "IntroVideo",
          component: IntroVideo,
          durationInFrames,
          fps: videoConfig.fps,
          width: videoConfig.width,
          height: videoConfig.height,
          defaultProps: { videoDurationSec: videoConfig.fallbackDurationSec },
        },
        inputProps: { videoDurationSec: videoConfig.fallbackDurationSec },
        scale: preset.scale,
        videoBitrate: preset.videoBitrate,
        audioBitrate: "very-high",
        sampleRate: 48000,
        signal: controller.signal,
        metadata: { title: `${videoConfig.name} — Intro`, artist: videoConfig.name },
        onProgress: ({ progress, renderEstimatedTime }) =>
          setStatus({ kind: "rendering", progress, etaMs: renderEstimatedTime ?? null }),
      });
      const blob = await getBlob();
      const url = URL.createObjectURL(blob);
      setStatus({ kind: "done", url, sizeMb: blob.size / 1024 / 1024 });
      triggerDownload(url, presetId);
    } catch (err) {
      if (controller.signal.aborted) {
        setStatus({ kind: "idle" });
        return;
      }
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Render failed" });
    } finally {
      abortRef.current = null;
    }
  }

  function triggerDownload(url: string, id: PresetId) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoConfig.name.toLowerCase()}-intro-${id}.mp4`;
    a.click();
  }

  return (
    <section
      aria-labelledby="download-heading"
      className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="download-heading" className="text-lg font-bold text-white">
          Download high quality
        </h2>
        <p className="text-sm text-neutral-400">
          Renders the final edit — enhanced voice, music, SFX and the black &amp; white ending — right in your browser.
          Keep this tab open while it exports.
        </p>
      </div>

      <div role="radiogroup" aria-label="Export quality" className="grid gap-3 sm:grid-cols-2">
        {presets.map((p) => {
          const selected = p.id === presetId;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={isRendering}
              onClick={() => setPresetId(p.id)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors disabled:opacity-60",
                selected ? "border-[#E8442A] bg-[#E8442A]/10" : "border-white/10 hover:border-white/25",
              )}
            >
              <span className="font-semibold text-white">{p.label}</span>
              <span className="font-mono text-xs text-neutral-400">{p.detail}</span>
            </button>
          );
        })}
      </div>

      {status.kind === "rendering" && (
        <div className="flex flex-col gap-2" aria-live="polite">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#E8442A] transition-[width] duration-300"
              style={{ width: `${Math.round(status.progress * 100)}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs text-neutral-400">
            <span>Rendering… {Math.round(status.progress * 100)}%</span>
            {status.etaMs !== null && <span>~{Math.max(1, Math.round(status.etaMs / 1000))}s left</span>}
          </div>
        </div>
      )}

      {status.kind === "error" && (
        <p role="alert" className="text-sm text-red-400">
          {status.message}. Try Chrome or Edge (WebCodecs required).
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {isRendering ? (
          <Button variant="secondary" onClick={() => abortRef.current?.abort()}>
            <X aria-hidden="true" />
            Cancel
          </Button>
        ) : (
          <>
            <Button onClick={startRender} className="bg-[#E8442A] text-white hover:bg-[#d23a22]">
              <Download aria-hidden="true" />
              Export {preset.label} MP4
            </Button>
            <a
              href="/cover-photo.png"
              download="saransh-portfolio-cover.png"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/15 transition-colors"
            >
              <Download className="size-4" aria-hidden="true" />
              Download Cover Photo (HD)
            </a>
          </>
        )}
        {isRendering && <Loader2 className="size-4 animate-spin text-neutral-400" aria-hidden="true" />}
        {status.kind === "done" && (
          <Button variant="outline" onClick={() => triggerDownload(status.url, presetId)}>
            Download again ({status.sizeMb.toFixed(1)} MB)
          </Button>
        )}
      </div>
    </section>
  );
}
