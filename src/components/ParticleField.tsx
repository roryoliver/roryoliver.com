"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  baseOpacity: number;
  shimmerSpeed: number;
  shimmerOffset: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const STAR_COUNT = 350;
    const COLORS = ["#ffffff", "#e2d6ff", "#c4b5fd", "#a78bfa", "#818cf8"];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStars(w, h);
    }

    function createStars(w: number, h: number) {
      const stars: Star[] = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random(),
          baseOpacity: 0.15 + Math.random() * 0.6,
          shimmerSpeed: 0.2 + Math.random() * 0.8,
          shimmerOffset: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    }

    function draw(time: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = time * 0.001;
      const stars = starsRef.current;
      const mouse = mouseRef.current;

      ctx!.clearRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Shimmer
        const shimmer = Math.sin(t * star.shimmerSpeed + star.shimmerOffset);
        const shimmerNorm = shimmer * 0.5 + 0.5;
        const opacity = star.baseOpacity * (0.3 + shimmerNorm * 0.7);

        // Size from depth
        const size = 0.5 + star.z * 1.8;

        // Mouse proximity glow — wider radius, stronger effect
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proxBoost = dist < 250 ? (1 - dist / 250) * 0.8 : 0;

        const finalOpacity = Math.min(opacity + proxBoost, 1);
        const finalSize = size + proxBoost * 3;

        const colorIndex = Math.floor(star.z * (COLORS.length - 1));
        const color = COLORS[colorIndex];

        // Draw star dot
        ctx!.globalAlpha = finalOpacity;
        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, finalSize, 0, Math.PI * 2);
        ctx!.fill();

        // Soft glow on brighter stars and hovered stars
        if (star.z > 0.45 || proxBoost > 0.05) {
          const glowRadius = finalSize * (proxBoost > 0.1 ? 6 : 4);
          const grad = ctx!.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, glowRadius
          );
          grad.addColorStop(0, color);
          grad.addColorStop(1, "transparent");
          ctx!.globalAlpha = finalOpacity * (proxBoost > 0.1 ? 0.3 : 0.15);
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Very slow drift
        star.x += Math.sin(t * 0.1 + star.shimmerOffset) * 0.03;
        star.y += Math.cos(t * 0.08 + star.shimmerOffset) * 0.02;

        // Wrap
        if (star.x < -10) star.x = w + 10;
        if (star.x > w + 10) star.x = -10;
        if (star.y < -10) star.y = h + 10;
        if (star.y > h + 10) star.y = -10;
      }

      ctx!.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    resize();
    animRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
