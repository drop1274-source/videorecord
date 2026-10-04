// Usage: node scripts/make-audio.mjs
// 1. Enhances the voice from public/raw.mp4 (rumble cut, presence boost,
//    gentle gate + compression, loudness normalisation) -> public/audio/voice.mp3
// 2. Synthesises an original royalty-free lo-fi music bed -> public/audio/music.mp3
// 3. Synthesises transition whoosh + outro hit SFX.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const SR = 44100;
const root = process.cwd();
const cache = path.join(root, ".cache");
const outDir = path.join(root, "public", "audio");
fs.mkdirSync(cache, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

const ffmpeg = (args) =>
  execSync(`npx remotion ffmpeg -y -hide_banner -loglevel error ${args}`, { stdio: "inherit" });

// ---------- WAV helpers ----------
function readWavMono(file) {
  const buf = fs.readFileSync(file);
  let offset = 12;
  while (offset < buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === "data") {
      const n = size / 2;
      const out = new Float32Array(n);
      for (let i = 0; i < n; i++) out[i] = buf.readInt16LE(offset + 8 + i * 2) / 32768;
      return out;
    }
    offset += 8 + size;
  }
  throw new Error("No data chunk");
}

function writeWav(file, channels) {
  const numCh = channels.length;
  const n = channels[0].length;
  const buf = Buffer.alloc(44 + n * numCh * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * numCh * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(numCh, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * numCh * 2, 28);
  buf.writeUInt16LE(numCh * 2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * numCh * 2, 40);
  let p = 44;
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < numCh; c++) {
      const v = Math.max(-1, Math.min(1, channels[c][i]));
      buf.writeInt16LE(Math.round(v * 32767), p);
      p += 2;
    }
  }
  fs.writeFileSync(file, buf);
}

function normalize(channels, peakDb = -1) {
  let peak = 0;
  for (const ch of channels) for (const v of ch) peak = Math.max(peak, Math.abs(v));
  const target = 10 ** (peakDb / 20);
  const g = peak > 0 ? target / peak : 1;
  for (const ch of channels) for (let i = 0; i < ch.length; i++) ch[i] *= g;
}

// ---------- DSP helpers ----------
function biquad(type, freq, q = 0.707, gainDb = 0) {
  const A = 10 ** (gainDb / 40);
  const w = (2 * Math.PI * freq) / SR;
  const cos = Math.cos(w);
  const alpha = Math.sin(w) / (2 * q);
  let b0, b1, b2, a0, a1, a2;
  if (type === "highpass") {
    b0 = (1 + cos) / 2; b1 = -(1 + cos); b2 = (1 + cos) / 2;
    a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha;
  } else if (type === "lowpass") {
    b0 = (1 - cos) / 2; b1 = 1 - cos; b2 = (1 - cos) / 2;
    a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha;
  } else if (type === "bandpass") {
    b0 = alpha; b1 = 0; b2 = -alpha;
    a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha;
  } else {
    b0 = 1 + alpha * A; b1 = -2 * cos; b2 = 1 - alpha * A;
    a0 = 1 + alpha / A; a1 = -2 * cos; a2 = 1 - alpha / A;
  }
  const c = { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 };
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x) => {
    const y = c.b0 * x + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
}

function applyChain(input, filters) {
  const out = new Float32Array(input.length);
  for (let i = 0; i < input.length; i++) {
    let v = input[i];
    for (const f of filters) v = f(v);
    out[i] = v;
  }
  return out;
}

// ---------- 1. Voice enhancement ----------
function enhanceVoice() {
  const rawWav = path.join(cache, "voice-raw.wav");
  const procWav = path.join(cache, "voice-proc.wav");
  ffmpeg(`-i public/raw.mp4 -vn -ac 1 -ar ${SR} -c:a pcm_s16le ${rawWav}`);
  const voice = readWavMono(rawWav);

  const eq = applyChain(voice, [
    biquad("highpass", 85, 0.71),
    biquad("highpass", 85, 0.71),
    biquad("peaking", 250, 1.0, -2.5), // reduce boxiness
    biquad("peaking", 3200, 0.9, 3), // presence / clarity
    biquad("peaking", 9000, 0.7, 1.5), // air
    biquad("lowpass", 15000, 0.71),
  ]);

  // Downward expander (soft noise gate) + compressor, both RMS-envelope based.
  const out = new Float32Array(eq.length);
  let env = 0;
  let gateGain = 1;
  const att = Math.exp(-1 / (0.005 * SR));
  const rel = Math.exp(-1 / (0.12 * SR));
  const gateThresh = 10 ** (-48 / 20);
  const compThreshDb = -22;
  const ratio = 3;
  for (let i = 0; i < eq.length; i++) {
    const x = eq[i];
    const level = Math.abs(x);
    env = level > env ? att * env + (1 - att) * level : rel * env + (1 - rel) * level;
    const target = env < gateThresh ? 0.35 : 1;
    gateGain += (target - gateGain) * (target > gateGain ? 0.01 : 0.0008);
    const envDb = 20 * Math.log10(env + 1e-9);
    const over = envDb - compThreshDb;
    const compDb = over > 0 ? -over * (1 - 1 / ratio) : 0;
    out[i] = x * gateGain * 10 ** (compDb / 20) * 1.6;
  }
  normalize([out], -2);
  writeWav(procWav, [out]);
  ffmpeg(
    `-i ${procWav} -af loudnorm=I=-16:TP=-1.5:LRA=9 -ar ${SR} -ac 2 -c:a libmp3lame -b:a 256k ${path.join(outDir, "voice.mp3")}`,
  );
  console.log("voice.mp3 written");
}

// ---------- 2. Music ----------
const midi = (n) => 440 * 2 ** ((n - 69) / 12);
const N = { C2: 36, D2: 38, E2: 40, F2: 41, C3: 48, D3: 50, E3: 52, F3: 53, G3: 55, A3: 57, B3: 59, C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71, C5: 72, D5: 74, E5: 76 };

function makeReverb() {
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ buf: new Float32Array(d), i: 0, fb: 0.78, lp: 0 }));
  const aps = [225, 556].map((d) => ({ buf: new Float32Array(d), i: 0 }));
  return (x) => {
    let s = 0;
    for (const c of combs) {
      const y = c.buf[c.i];
      c.lp = y * 0.7 + c.lp * 0.3;
      c.buf[c.i] = x + c.lp * c.fb;
      c.i = (c.i + 1) % c.buf.length;
      s += y;
    }
    s *= 0.25;
    for (const a of aps) {
      const b = a.buf[a.i];
      const y = -s + b;
      a.buf[a.i] = s + b * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      s = y;
    }
    return s;
  };
}

function makeMusic(durationSec) {
  const len = Math.ceil(durationSec * SR);
  const L = new Float32Array(len);
  const R = new Float32Array(len);
  const sendL = new Float32Array(len);
  const sendR = new Float32Array(len);
  const bpm = 88;
  const beat = 60 / bpm;
  const bar = beat * 4;
  const progression = [
    { pad: [N.F3, N.A3, N.C4, N.E4], bass: N.F2, arp: [N.A4, N.C5, N.E5, N.C5] },
    { pad: [N.E3, N.G3, N.B3, N.D4], bass: N.E2, arp: [N.G4, N.B4, N.D5, N.B4] },
    { pad: [N.D3, N.F3, N.A3, N.C4], bass: N.D2, arp: [N.F4, N.A4, N.C5, N.A4] },
    { pad: [N.C3, N.E3, N.G3, N.B3], bass: N.C2, arp: [N.E4, N.G4, N.B4, N.G4] },
  ];
  const drumsIn = bar * 2;
  const drumsOut = 64.0;
  const endChordAt = Math.ceil(64.6 / bar) * bar;
  const totalBars = Math.floor(endChordAt / bar);

  const add = (buf, start, samples, gain) => {
    const s0 = Math.floor(start * SR);
    for (let i = 0; i < samples.length && s0 + i < len; i++) buf[s0 + i] += samples[i] * gain;
  };

  // Kick-driven sidechain envelope for pad/bass "pump".
  const duck = new Float32Array(len).fill(1);

  // Pads + bass
  const padNote = (freq, start, dur, gain, pan) => {
    const n = Math.floor((dur + 1.2) * SR);
    const out = new Float32Array(n);
    const lp = biquad("lowpass", 1800, 0.6);
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const a = Math.min(1, t / 0.6) * (t > dur ? Math.exp(-(t - dur) / 0.45) : 1);
      const v =
        Math.sin(2 * Math.PI * freq * t) * 0.6 +
        Math.sin(2 * Math.PI * freq * 1.003 * t + 1) * 0.35 +
        Math.sin(2 * Math.PI * freq * 0.997 * t + 2) * 0.35 +
        Math.sin(2 * Math.PI * freq * 2 * t) * 0.08;
      out[i] = lp(v) * a;
    }
    add(L, start, out, gain * (1 - pan));
    add(R, start, out, gain * (1 + pan));
    add(sendL, start, out, gain * 0.5);
    add(sendR, start, out, gain * 0.5);
  };

  const pluck = (freq, start, gain, pan) => {
    const n = Math.floor(1.4 * SR);
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const env = Math.exp(-t / 0.32) * Math.min(1, t / 0.004);
      const mod = Math.sin(2 * Math.PI * freq * 2 * t) * 1.2 * Math.exp(-t / 0.15);
      out[i] = Math.sin(2 * Math.PI * freq * t + mod) * env;
    }
    add(L, start, out, gain * (1 - pan));
    add(R, start, out, gain * (1 + pan));
    add(sendL, start, out, gain * 0.9);
    add(sendR, start, out, gain * 0.9);
  };

  const kick = (start, gain) => {
    const n = Math.floor(0.45 * SR);
    const out = new Float32Array(n);
    let phase = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const f = 45 + 85 * Math.exp(-t / 0.04);
      phase += (2 * Math.PI * f) / SR;
      out[i] = Math.sin(phase) * Math.exp(-t / 0.18);
    }
    add(L, start, out, gain);
    add(R, start, out, gain);
    const s0 = Math.floor(start * SR);
    for (let i = 0; i < 0.3 * SR && s0 + i < len; i++) {
      duck[s0 + i] = Math.min(duck[s0 + i], 0.55 + 0.45 * (i / (0.3 * SR)));
    }
  };

  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

  const hat = (start, gain, pan) => {
    const n = Math.floor(0.08 * SR);
    const out = new Float32Array(n);
    const hp = biquad("highpass", 7000, 0.7);
    for (let i = 0; i < n; i++) out[i] = hp(rand()) * Math.exp(-(i / SR) / 0.02);
    add(L, start, out, gain * (1 - pan));
    add(R, start, out, gain * (1 + pan));
  };

  const snare = (start, gain) => {
    const n = Math.floor(0.3 * SR);
    const out = new Float32Array(n);
    const bp = biquad("bandpass", 1800, 0.8);
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      out[i] = bp(rand()) * Math.exp(-t / 0.07) * 1.4 + Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t / 0.05) * 0.5;
    }
    add(L, start, out, gain);
    add(R, start, out, gain);
    add(sendL, start, out, gain * 0.6);
    add(sendR, start, out, gain * 0.6);
  };

  for (let b = 0; b < totalBars; b++) {
    const t0 = b * bar;
    const chord = progression[b % progression.length];
    const fadeIn = Math.min(1, (b + 1) / 2);
    chord.pad.forEach((note, i) => padNote(midi(note), t0, bar, 0.05 * fadeIn, (i - 1.5) * 0.25));
    padNote(midi(chord.bass), t0, bar * 0.95, 0.09 * fadeIn, 0);

    if (b >= 1) {
      for (let s = 0; s < 8; s++) {
        const note = chord.arp[s % 4] + (s >= 4 ? 12 : 0);
        const swing = s % 2 === 1 ? beat * 0.08 : 0;
        pluck(midi(note), t0 + (s * beat) / 2 + swing, 0.07, s % 2 === 0 ? -0.35 : 0.35);
      }
    }

    if (t0 >= drumsIn && t0 < drumsOut) {
      for (let q = 0; q < 4; q++) {
        const t = t0 + q * beat;
        if (q === 0 || q === 2) kick(t, 0.5);
        if (q === 1 || q === 3) snare(t, 0.14);
        hat(t + beat / 2 + beat * 0.06, 0.05, 0.3);
        hat(t, 0.025, -0.3);
      }
      if (b % 4 === 3) kick(t0 + beat * 3.5, 0.35);
    }
  }

  // Final resolving chord: Fmaj9 that rings out under the outro card.
  [N.F3, N.A3, N.C4, N.E4, N.G4].forEach((note, i) => padNote(midi(note), endChordAt, 3.5, 0.06, (i - 2) * 0.2));
  padNote(midi(N.F2), endChordAt, 3.5, 0.1, 0);
  [N.C5, N.E5, N.A4].forEach((note, i) => pluck(midi(note), endChordAt + i * 0.12, 0.08, (i - 1) * 0.4));

  const revL = makeReverb();
  const revR = makeReverb();
  const warmL = biquad("lowpass", 12000, 0.7);
  const warmR = biquad("lowpass", 12000, 0.7);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const master = Math.min(1, t / 1.5) * (t > durationSec - 2.5 ? Math.max(0, (durationSec - t) / 2.5) : 1);
    L[i] = warmL((L[i] * duck[i] + revL(sendL[i]) * 0.45) * master);
    R[i] = warmR((R[i] * duck[i] + revR(sendR[i]) * 0.45) * master);
  }
  normalize([L, R], -1);
  return { L, R, bar };
}

function makeWhoosh() {
  const dur = 0.9;
  const n = Math.floor(dur * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  let seed = 3;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  let low = 0, band = 0;
  for (let i = 0; i < n; i++) {
    const t = i / dur / SR;
    const f = 250 + 3800 * Math.sin(Math.PI * Math.min(1, t * 1.1)) ** 2;
    const fc = 2 * Math.sin((Math.PI * f) / SR);
    const x = rand();
    const high = x - low - 0.6 * band;
    band += fc * high;
    low += fc * band;
    const env = Math.sin(Math.PI * t) ** 1.6;
    const pan = -0.8 + 1.6 * t;
    L[i] = band * env * (1 - pan) * 0.5;
    R[i] = band * env * (1 + pan) * 0.5;
  }
  normalize([L, R], -3);
  return [L, R];
}

function makeOutroHit() {
  const dur = 3.2;
  const n = Math.floor(dur * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const revL = makeReverb();
  const revR = makeReverb();
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  const lp = biquad("lowpass", 900, 0.7);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    phase += (2 * Math.PI * (42 + 60 * Math.exp(-t / 0.08))) / SR;
    const boom = Math.sin(phase) * Math.exp(-t / 0.7);
    const air = lp(rand()) * Math.exp(-t / 0.25) * 0.6;
    const bell = Math.sin(2 * Math.PI * 698.46 * t) * Math.exp(-t / 1.1) * 0.12 + Math.sin(2 * Math.PI * 1046.5 * t) * Math.exp(-t / 0.9) * 0.08;
    const dry = boom + air + bell;
    L[i] = dry + revL(dry) * 0.5;
    R[i] = dry + revR(dry) * 0.5;
  }
  normalize([L, R], -2);
  return [L, R];
}

function encodeStereo(name, channels, bitrate = "256k") {
  const wav = path.join(cache, `${name}.wav`);
  writeWav(wav, channels);
  ffmpeg(`-i ${wav} -c:a libmp3lame -b:a ${bitrate} ${path.join(outDir, `${name}.mp3`)}`);
  console.log(`${name}.mp3 written`);
}

enhanceVoice();
const music = makeMusic(72);
encodeStereo("music", [music.L, music.R], "320k");
encodeStereo("whoosh", makeWhoosh(), "192k");
encodeStereo("outro-hit", makeOutroHit(), "192k");
