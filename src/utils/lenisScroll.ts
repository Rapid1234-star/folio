import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function createLenisScroll(options?: {
  reducedMotion?: boolean;
}): { lenis: Lenis | null; destroy: () => void } {
  if (options?.reducedMotion || typeof window === "undefined") {
    return { lenis: null, destroy: () => {} };
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const ticker = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  const destroy = () => {
    gsap.ticker.remove(ticker);
    lenis.destroy();
  };

  return { lenis, destroy };
}
