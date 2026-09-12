import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function MatrixRain({ opacity = 0.6 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars =
      "0101010101010101010101010101010101010101010101010101010101010101010101010011001100110011001100110011001100110011001100110011001100110011001123456789234567892345678923ABCDEFGHIJKLMNOPQRSTUVWXYZアァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプ";
    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100;
    }

    let animationId: number;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    // Scroll velocity tracking
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.min(
        Math.abs(currentScrollY - lastScrollY) * 0.1,
        5,
      );
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);

    const draw = (time: number) => {
      animationId = requestAnimationFrame(draw);

      if (opacity <= 0 || prefersReducedMotion || time - lastTime < interval)
        return;
      lastTime = time;

      // Decay scroll velocity
      scrollVelocity *= 0.9;

      ctx.fillStyle = "rgba(5, 5, 5, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));

        if (Math.random() > 0.95) {
          ctx.fillStyle = "#fff";
        } else {
          ctx.fillStyle = "#00ff41";
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }

        // Base drop speed + scroll velocity boost
        drops[i] += 1 + scrollVelocity;
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, [opacity, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-500"
      style={{ opacity }}
    />
  );
}
