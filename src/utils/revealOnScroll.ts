import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealOpts = {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
};

/** Shared scroll reveal — small y offset, compositor-friendly. */
export function revealOnScroll(
  scope: HTMLElement | null,
  selector: string,
  opts: RevealOpts = {},
) {
  if (!scope) return;

  const {
    y = 16,
    duration = 0.45,
    stagger = 0.06,
    start = "top 85%",
  } = opts;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(scope.querySelectorAll(selector), { clearProps: "all" });
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(scope.querySelectorAll(selector), {
      y,
      opacity: 0,
      duration,
      stagger,
      ease: "power2.out",
      scrollTrigger: {
        trigger: scope,
        start,
        toggleActions: "play none none none",
      },
    });
  });

  return () => mm.revert();
}
