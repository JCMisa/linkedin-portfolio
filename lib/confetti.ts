const COLORS = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
const DURATION_MS = 3000;

/**
 * Celebration burst from both screen edges. canvas-confetti is loaded on
 * first use, so it never weighs down the initial page bundle.
 */
export async function showConfetti() {
  const { default: confetti } = await import("canvas-confetti");
  const end = Date.now() + DURATION_MS;

  const frame = () => {
    if (Date.now() > end) return;
    for (const [angle, x] of [
      [60, 0],
      [120, 1],
    ] as const) {
      confetti({
        particleCount: 2,
        angle,
        spread: 55,
        startVelocity: 60,
        origin: { x, y: 0.5 },
        colors: COLORS,
      });
    }
    requestAnimationFrame(frame);
  };

  frame();
}
