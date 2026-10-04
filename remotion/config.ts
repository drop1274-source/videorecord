// Edit everything about the video from this file. All times are in seconds
// and were picked from the word timestamps in captions.json.

export type Project = {
  id: string;
  screenshot: string;
  url: string;
  label: string;
  title: string;
  start: number;
  end: number;
};

export const videoConfig = {
  name: "Saransh",
  role: "Full-Stack Engineer",

  width: 1280,
  height: 720,
  fps: 60,
  video: "raw.mp4",
  /** Only used until the real duration is read from raw.mp4. */
  fallbackDurationSec: 65.97,

  colors: {
    text: "#111111",
    accent: "#E8442A",
    background: "#F7F7F5",
  },

  lowerThird: { start: 0.3, end: 4.4 },

  captions: {
    maxWordsPerPage: 4,
    breakOnPauseMs: 450,
    tailMs: 350,
    fontSize: 30,
    bottom: 26,
  },

  transitions: { inSec: 0.8, outSec: 0.8 },

  layout: {
    faceCard: { x: 48, y: 56, width: 360, height: 560, radius: 22 },
    browser: { x: 440, y: 56, width: 792, height: 560 },
    callout: { x: 464, y: 528 },
    /** Vertical focus point (%) of the portrait recording in each layout. */
    faceFocusY: { full: 63, card: 90 },
  },

  projects: [
    {
      id: "ecommerce",
      screenshot: "screens/ecommerce.png",
      url: "trioenterprises.in",
      label: "The one that shaped me",
      title: "End-to-end e-commerce",
      start: 25.3,
      end: 37.75,
    },
    {
      id: "ai-products",
      screenshot: "screens/ai-summarizer.png",
      url: "saranslh.vercel.app",
      label: "AI-integrated product",
      title: "Article summarizer",
      start: 37.75,
      end: 41.05,
    },
    {
      id: "ai-page-builder",
      screenshot: "screens/ai-page-builder.png",
      url: "ai-page-builder.app",
      label: "Webflow, but with",
      title: "AI page building",
      start: 41.05,
      end: 43.4,
    },
    {
      id: "school-bus",
      screenshot: "screens/school-bus.png",
      url: "bus-tracker.app",
      label: "Real-time",
      title: "School bus tracking",
      start: 43.4,
      end: 46.2,
    },
    {
      id: "crm-erp",
      screenshot: "screens/crm-erp.png",
      url: "crm-erp.app",
      label: "CRM + ERP",
      title: "Real-world client products",
      start: 46.2,
      end: 51.0,
    },
  ] satisfies Project[] as Project[],

  ending: {
    label: "Looking for",
    title: "More ownership",
    start: 51.8,
    end: 62.0,
    letsTalk: { text: "Let's talk.", start: 63.7 },
  },
};
