import { VideoPreview } from "@/components/video-preview";
import { videoConfig } from "@/remotion/config";

const commands = [
  { label: "Preview in Remotion Studio", cmd: "pnpm studio" },
  { label: "Render final MP4", cmd: "pnpm render" },
  { label: "Re-generate captions (Whisper)", cmd: "pnpm transcribe" },
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#111111]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-12 md:py-16">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E8442A]">Remotion · 1280×720 · 60fps</p>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            {videoConfig.name} — intro video
          </h1>
          <p className="text-pretty text-neutral-600">
            {videoConfig.role}. Talking-head pitch with word-level captions, project split views and a clean ending.
          </p>
        </header>

        <VideoPreview />

        <section aria-labelledby="timeline" className="flex flex-col gap-4">
          <h2 id="timeline" className="text-lg font-bold">Project timeline</h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {videoConfig.projects.map((p) => (
              <li key={p.id} className="flex flex-col gap-1 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
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
          <h2 id="commands" className="text-lg font-bold">Commands</h2>
          <ul className="flex flex-col gap-2">
            {commands.map((c) => (
              <li key={c.cmd} className="flex flex-col gap-1 rounded-xl bg-[#111111] p-4 sm:flex-row sm:items-center sm:justify-between">
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
