// Usage: node scripts/transcribe.mjs
// Extracts 16kHz audio from public/raw.mp4, runs whisper.cpp locally and
// writes word-level captions to remotion/captions.json (editable).
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const WHISPER_VERSION = "1.5.5";
const MODEL = process.env.WHISPER_MODEL ?? "small.en";
const whisperPath = path.join(process.cwd(), "whisper.cpp");
const wavPath = path.join(process.cwd(), ".cache", "audio.wav");
const outPath = path.join(process.cwd(), "remotion", "captions.json");

fs.mkdirSync(path.dirname(wavPath), { recursive: true });

execSync(
  `npx remotion ffmpeg -y -hide_banner -loglevel error -i public/raw.mp4 -ar 16000 -ac 1 -c:a pcm_s16le ${wavPath}`,
  { stdio: "inherit" },
);

await installWhisperCpp({ to: whisperPath, version: WHISPER_VERSION });
await downloadWhisperModel({ model: MODEL, folder: whisperPath });

const output = await transcribe({
  inputPath: wavPath,
  whisperPath,
  whisperCppVersion: WHISPER_VERSION,
  model: MODEL,
  tokenLevelTimestamps: true,
  splitOnWord: true,
});

const { captions } = toCaptions({ whisperCppOutput: output });
fs.writeFileSync(outPath, JSON.stringify(captions, null, 2));
console.log(`Wrote ${captions.length} words to ${outPath}`);
