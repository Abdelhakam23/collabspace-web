// Project accent palette, pixel-sampled from the final frame
// (docs/design-api-gaps.md); rows cycle by index.
export const PROJECT_COLORS = ["#7B2C7E", "#0DB0A8", "#005AFB", "#FF9226"];

// Priority pill tones (text on tinted bg), as drawn on the task pills.
export const PRIORITY_TONES: Record<string, { text: string; bg: string }> = {
  high: { text: "#DB302A", bg: "#FEE4E2" },
  medium: { text: "#B54708", bg: "#FEF0C7" },
  low: { text: "#067647", bg: "#D1FADF" },
};
