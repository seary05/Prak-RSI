import { useLayoutEffect, type RefObject } from "react";
import { gsap as gsapLib } from "gsap";

type Vars = Record<string, unknown>;
interface GsapLike {
  context(fn: () => void, scope?: Element | null): { revert: () => void };
  from(target: string, vars: Vars): unknown;
  to(target: string, vars: Vars): unknown;
}

// null jika gsap tidak dipasang -> semua hook di bawah otomatis tidak melakukan apa-apa
const gsap = (gsapLib ?? null) as GsapLike | null;

export const motionEnabled = gsap !== null;

function reduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Elemen ber-atribut [data-reveal] muncul bertahap (fade + naik). Dipakai untuk daftar kartu. */
export function useStaggerIn(
  scope: RefObject<HTMLElement | null>,
  selector = "[data-reveal]",
  deps: unknown[] = []
) {
  useLayoutEffect(() => {
    const el = scope.current;
    if (!gsap || !el || reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        opacity: 0,
        y: 26,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.06,
        clearProps: "all",
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Intro hero: [data-hero] muncul berurutan, [data-float] melayang pelan terus-menerus. */
export function useHeroIntro(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scope.current;
    if (!gsap || !el || reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero]", {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
      });
      gsap.to("[data-float]", {
        y: -14,
        rotation: 5,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.4, from: "random" },
      });
    }, el);
    return () => ctx.revert();
  }, [scope]);
}