"use client";

import { useEffect, useRef } from "react";

interface SchemaProjectCardProps {
  name: string;
  summary: string;
  tech: string[];
  accentColor?: string;
  link?: string;
  videoSrc?: string;
  imageSrc?: string;
}

export default function SchemaProjectCard({
  name,
  summary,
  tech,
  accentColor = "indigo",
  link = "#",
  videoSrc,
  imageSrc,
}: SchemaProjectCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const colors: Record<string, [number, number, number]> = {
      indigo: [99, 102, 241],
      orange: [249, 115, 22],
      pink: [236, 72, 153],
      emerald: [16, 185, 129],
      violet: [139, 92, 246],
      cyan: [6, 182, 212],
    };

    const [r, g, b] = colors[accentColor] ?? colors.indigo;

    const waveData = Array.from({ length: 6 }).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      targetValue: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
    }));

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function draw() {
      if (!ctx || !canvas) return;
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(0,0,0,0.95)";
      ctx.fillRect(0, 0, w, h);

      waveData.forEach((data, i) => {
        if (Math.random() < 0.01) data.targetValue = Math.random() * 0.7 + 0.1;
        data.value += (data.targetValue - data.value) * data.speed;

        const freq = data.value * 7;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const nx = (x / w) * 2 - 1;
          const px = nx + i * 0.04 + freq * 0.03;
          const py =
            Math.sin(px * 10 + time) *
            Math.cos(px * 2) *
            freq *
            0.1 *
            ((i + 1) / 6);
          const y = (py + 1) * (h / 2);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const intensity = Math.min(1, freq * 0.3);
        ctx.lineWidth = 1 + i * 0.2;
        ctx.strokeStyle = `rgba(${r + intensity * 60},${g + intensity * 60},${b},${0.4 + intensity * 0.2})`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    function animate() {
      time += 0.02;
      draw();
      animId = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [accentColor]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm transition hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Preview: video or wave canvas */}
      <div className="relative h-40 overflow-hidden">
        {videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : imageSrc ? (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={imageSrc}
            alt={name}
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />
        )}
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Card body */}
      <div className="space-y-3 p-5">
        {/* Tech badge */}
        <div className="flex flex-wrap gap-1.5">
          {tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-block rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/50"
            >
              {t}
            </span>
          ))}
          {tech.length > 3 && (
            <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-white/30">
              +{tech.length - 3}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white">{name}</h3>

        <p className="text-xs leading-relaxed text-white/50 line-clamp-3">
          {summary}
        </p>

        <div className="flex items-center justify-between pt-1">
          <a
            href={link}
            className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/[0.1] hover:text-white"
          >
            View
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/30">
            Live
          </span>
        </div>
      </div>
    </div>
  );
}
