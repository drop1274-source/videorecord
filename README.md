# videorecord

Remotion intro video for Saransh (Full-Stack Engineer).

- `pnpm dev` — web page with the player and an in-browser **1080p HQ export** button (Chrome/Edge)
- `pnpm studio` — preview in Remotion Studio
- `pnpm audio` — regenerate enhanced voice, the original music bed and SFX into `public/audio/`
- `pnpm render:hq` — render `public/intro-video-1080p.mp4` (1920×1080, CRF 16, 320k audio)
- `pnpm transcribe` — regenerate `remotion/captions.json` with Whisper

Edit names, timings, music volumes, colour grade, screenshots and labels in `remotion/config.ts`.
