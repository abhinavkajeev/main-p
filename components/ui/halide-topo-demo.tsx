'use client';

import type { FC, ReactNode } from "react";
import { useEffect, useRef } from "react";

interface HalideLandingProps {
  children?: ReactNode;
}

const HalideLanding: FC<HalideLandingProps> = ({ children }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 30;
      const y = (window.innerHeight / 2 - e.pageY) / 30;

      canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`;

      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = (index + 1) * 20;
        const moveX = x * (index + 1) * 0.25;
        const moveY = y * (index + 1) * 0.25;
        layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px)`;
      });
    };

    canvas.style.opacity = "0";
    canvas.style.transform = "rotateX(90deg) rotateZ(0deg) scale(0.7)";

    const timeout = window.setTimeout(() => {
      canvas.style.transition = "all 3s cubic-bezier(0.16, 1, 0.3, 1)";
      canvas.style.opacity = "1";
      canvas.style.transform = "rotateX(55deg) rotateZ(-25deg) scale(1)";
    }, 500);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="halide-fullscreen-scope">
      <style>{`
        .halide-fullscreen-scope {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
        }

        .halide-fullscreen-scope .halide-bg {
          position: absolute;
          inset: 0;
          background-color: #050508;
          z-index: 0;
        }

        .halide-fullscreen-scope .halide-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.08;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
        }

        .halide-fullscreen-scope .viewport-full {
          position: absolute;
          inset: 0;
          perspective: 1800px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .halide-fullscreen-scope .canvas-3d-full {
          position: relative;
          width: min(1100px, 90vw);
          height: min(700px, 75vh);
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .halide-fullscreen-scope .layer-full {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(224, 224, 224, 0.06);
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }

        .halide-fullscreen-scope .layer-full-1 {
          background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600');
          filter: grayscale(1) contrast(1.3) brightness(0.35);
        }

        .halide-fullscreen-scope .layer-full-2 {
          background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1600');
          filter: grayscale(1) contrast(1.1) brightness(0.5);
          opacity: 0.5;
          mix-blend-mode: screen;
        }

        .halide-fullscreen-scope .layer-full-3 {
          background-image: url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1600');
          filter: grayscale(1) contrast(1.4) brightness(0.6);
          opacity: 0.35;
          mix-blend-mode: overlay;
        }

        .halide-fullscreen-scope .contours-full {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background-image: repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, rgba(255,255,255,0.03) 41px, transparent 42px);
          transform: translateZ(140px);
          pointer-events: none;
        }

        .halide-fullscreen-scope .radial-fade {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.6) 70%, rgba(5,5,8,0.95) 100%);
        }

        .halide-fullscreen-scope .content-overlay {
          position: relative;
          z-index: 3;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }

        .halide-fullscreen-scope .scan-lines {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.008) 2px,
            rgba(255,255,255,0.008) 4px
          );
        }
      `}</style>

      <div className="halide-bg" />
      <div className="halide-grain" aria-hidden="true" />
      <div className="scan-lines" aria-hidden="true" />

      <div className="viewport-full">
        <div className="canvas-3d-full" ref={canvasRef}>
          <div
            className="layer-full layer-full-1"
            ref={(el) => {
              if (el) layersRef.current[0] = el;
            }}
          />
          <div
            className="layer-full layer-full-2"
            ref={(el) => {
              if (el) layersRef.current[1] = el;
            }}
          />
          <div
            className="layer-full layer-full-3"
            ref={(el) => {
              if (el) layersRef.current[2] = el;
            }}
          />
          <div className="contours-full" aria-hidden="true" />
        </div>
      </div>

      <div className="radial-fade" />

      <div className="content-overlay">
        {children}
      </div>
    </div>
  );
};

export default HalideLanding;
