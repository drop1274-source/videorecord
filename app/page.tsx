import { DownloadPanel } from "@/components/download-panel";
import { VideoPreview } from "@/components/video-preview";
import { videoConfig } from "@/remotion/config";

const commands = [
  { label: "Preview in Remotion Studio", cmd: "pnpm studio" },
  { label: "Regenerate enhanced voice + music + SFX", cmd: "pnpm audio" },
  { label: "Render 1080p HQ MP4 locally", cmd: "pnpm render:hq" },
  { label: "Re-generate captions (Whisper)", cmd: "pnpm transcribe" },
];

const edits = [
  "Framed talking head over a blurred backdrop",
  "Colour grade, film grain, vignette & slow push-in",
  "Viewfinder frame with live REC timecode",
  "Enhanced voice: EQ, gate, compression, -16 LUFS",
  "Original lo-fi music bed that ducks under speech",
  "Whoosh SFX on transitions, black & white ending",
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0B0B0C] text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-12 md:py-16">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E8442A]">
            Remotion · 1280×720 · 60fps · export up to 1080p
          </p>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-5xl">
            {videoConfig.name} — intro video
          </h1>
          <p className="max-w-2xl text-pretty text-neutral-400">
            {videoConfig.role}. Talking-head pitch with music, word-level captions, project split views and a
            cinematic black &amp; white ending.
          </p>
        </header>

        <VideoPreview />

        <DownloadPanel />

        <section aria-labelledby="cover-photo" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 id="cover-photo" className="text-lg font-bold">
                Cinematic Cover Photo / Thumbnail
              </h2>
              <p className="text-xs text-neutral-400">
                Custom developer session cover with system architecture backdrop &amp; interactive HUD
              </p>
            </div>
            <a
              href="/cover-photo.png"
              download="saransh-cover-photo.png"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#E8442A] hover:underline"
            >
              Download Full HD PNG &rarr;
            </a>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cover-photo.png"
              alt="Developer Workspace Cover Photo"
              className="w-full h-auto object-cover aspect-video transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>
        </section>

        <section aria-labelledby="edit" className="flex flex-col gap-4">
          <h2 id="edit" className="text-lg font-bold">
            {"What's in the edit"}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {edits.map((e) => (
              <li key={e} className="flex items-start gap-2 rounded-xl border border-white/10 p-4 text-sm text-neutral-300">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#E8442A]" />
                {e}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="timeline" className="flex flex-col gap-4">
          <h2 id="timeline" className="text-lg font-bold">
            Project timeline
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {videoConfig.projects.map((p) => (
              <li key={p.id} className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8442A]">{p.label}</span>
                <span className="font-bold">{p.title}</span>
                <span className="font-mono text-xs text-neutral-500">
                  {p.url} · {fmt(p.start)}–{fmt(p.end)}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="commands" className="flex flex-col gap-4">
          <h2 id="commands" className="text-lg font-bold">
            Commands
          </h2>
          <ul className="flex flex-col gap-2">
            {commands.map((c) => (
              <li
                key={c.cmd}
                className="flex flex-col gap-1 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm text-neutral-400">{c.label}</span>
                <code className="font-mono text-sm text-white">{c.cmd}</code>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
