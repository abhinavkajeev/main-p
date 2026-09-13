"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function PixelCat() {
  const catRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 200, y: 500 });
  const targetRef = useRef({ x: 200, y: 500 });
  const velRef = useRef({ x: 0, y: 0 });
  const idleCountRef = useRef(0);
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);

  const [frame, setFrame] = useState<string>("front-sit");
  const [flip, setFlip] = useState(false);

  const updateFrame = useCallback(() => {
    const pos = posRef.current;
    const target = targetRef.current;
    const vel = velRef.current;

    const dx = target.x - pos.x;
    const dy = target.y - pos.y;
    const dist = Math.hypot(dx, dy);

    tickRef.current++;

    if (dist > 50) {
      const speed = Math.min(4.5, dist * 0.05);
      vel.x += (dx / dist) * speed * 0.18;
      vel.y += (dy / dist) * speed * 0.18;
      idleCountRef.current = 0;

      const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

      let dir: string;
      let shouldFlip = false;

      if (angle >= 337.5 || angle < 22.5) {
        dir = "side"; shouldFlip = false;
      } else if (angle >= 22.5 && angle < 67.5) {
        dir = "front-diag"; shouldFlip = false;
      } else if (angle >= 67.5 && angle < 112.5) {
        dir = "front";
      } else if (angle >= 112.5 && angle < 157.5) {
        dir = "front-diag"; shouldFlip = true;
      } else if (angle >= 157.5 && angle < 202.5) {
        dir = "side"; shouldFlip = true;
      } else if (angle >= 202.5 && angle < 247.5) {
        dir = "back-diag"; shouldFlip = true;
      } else if (angle >= 247.5 && angle < 292.5) {
        dir = "back";
      } else {
        dir = "back-diag"; shouldFlip = false;
      }

      setFlip(shouldFlip);

      // 4 walk frames for side, 2 for others
      if (dir === "side") {
        const walkIdx = Math.floor(tickRef.current / 5) % 4;
        setFrame(`side-run${walkIdx}`);
      } else {
        const walkIdx = Math.floor(tickRef.current / 6) % 2;
        setFrame(`${dir}-walk${walkIdx}`);
      }
    } else {
      idleCountRef.current++;
      if (idleCountRef.current > 300) {
        // ~5 seconds idle → sleep!
        setFlip(false);
        const breathe = Math.floor(tickRef.current / 40) % 2;
        setFrame(breathe === 0 ? "sleep0" : "sleep1");
      } else if (idleCountRef.current > 20) {
        setFlip(false);
        const blink = tickRef.current % 150 < 8;
        setFrame(blink ? "front-blink" : "front-sit");
      }
    }

    vel.x *= 0.86;
    vel.y *= 0.86;
    pos.x += vel.x;
    pos.y += vel.y;
    pos.x = Math.max(24, Math.min(window.innerWidth - 24, pos.x));
    pos.y = Math.max(24, Math.min(window.innerHeight - 24, pos.y));

    if (catRef.current) {
      catRef.current.style.transform = `translate(${pos.x - 14}px, ${pos.y - 24}px) scaleX(${flip ? -1 : 1})`;
    }

    rafRef.current = requestAnimationFrame(updateFrame);
  }, [flip]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);
    rafRef.current = requestAnimationFrame(updateFrame);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateFrame]);

  const isSleeping = frame.startsWith("sleep");

  return (
    <div
      ref={catRef}
      className="pointer-events-none fixed z-50"
      style={{ willChange: "transform", imageRendering: "pixelated" }}
    >
      {/* Floating Zzz animation */}
      {isSleeping && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2" style={{ imageRendering: "auto" }}>
          <span
            className="absolute text-[10px] font-bold text-white/60"
            style={{
              animation: "zzz-float 2.4s ease-in-out infinite",
              left: 0,
              top: 0,
            }}
          >
            z
          </span>
          <span
            className="absolute text-[8px] font-bold text-white/40"
            style={{
              animation: "zzz-float 2.4s ease-in-out 0.6s infinite",
              left: 8,
              top: -2,
            }}
          >
            z
          </span>
          <span
            className="absolute text-[6px] font-bold text-white/25"
            style={{
              animation: "zzz-float 2.4s ease-in-out 1.2s infinite",
              left: 14,
              top: -4,
            }}
          >
            z
          </span>
        </div>
      )}
      <CatSprite frame={frame} />

      {/* Zzz keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes zzz-float {
          0% {
            opacity: 0;
            transform: translateY(0px) scale(0.7);
          }
          20% {
            opacity: 1;
            transform: translateY(-4px) scale(1);
          }
          80% {
            opacity: 0.6;
            transform: translateY(-14px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
        }
      `}} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   8-DIRECTIONAL FLUFFY PIXEL CAT
   
   Side view: 18×15 grid, scaled to 32×28px
   Other views: 16×15 grid, scaled to 28×28px
   
   Chibi proportions: BIG round head, small body, fluffy
   ═══════════════════════════════════════════════════════ */

const P = 3; // pixel size — smaller & cute
const W = "#ffffff";    // white body
const F = "#f5f0eb";    // off-white fluff
const E = "#1a1a2e";    // eye dark
const G = "#34d399";    // pupil emerald
const K = "#f9a8d4";    // pink nose/ear
const T = "#d4d4d8";    // whisker/tip grey
const SZ = 28;          // base svg size

// Pixel helper
const b = (x: number, y: number, c: string) => (
  <rect key={`${x}.${y}.${c}`} x={x * P} y={y * P} width={P} height={P} fill={c} />
);
const row = (xs: number[], y: number, c: string) => xs.map(x => b(x, y, c));

function CatSprite({ frame }: { frame: string }) {
  const vbFront = `0 0 ${16 * P} ${15 * P}`;
  const vbSide = `0 0 ${18 * P} ${15 * P}`;

  /* ─────────── SHARED : Front-facing head ─────────── */
  const frontHead = (eyesOpen: boolean) => (
    <>
      {/* Ears pointy */}
      {b(3,0,W)}{b(4,0,W)}{b(11,0,W)}{b(12,0,W)}
      {b(3,1,W)}{b(4,1,K)}{b(11,1,K)}{b(12,1,W)}
      {/* Head — big & round */}
      {row([3,4,5,6,7,8,9,10,11,12],2,W)}
      {row([2,3,4,5,6,7,8,9,10,11,12,13],3,W)}
      {row([2,3,4,5,6,7,8,9,10,11,12,13],4,W)}
      {row([2,3,4,5,6,7,8,9,10,11,12,13],5,W)}
      {row([3,4,5,6,7,8,9,10,11,12],6,W)}
      {/* Eyes */}
      {eyesOpen ? (<>
        {b(4,4,E)}{b(5,4,E)}{b(4,5,E)}{b(5,5,E)}
        {b(10,4,E)}{b(11,4,E)}{b(10,5,E)}{b(11,5,E)}
        {/* Pupils — sparkle */}
        {b(5,4,G)}{b(11,4,G)}
        {/* Highlight dots */}
        {b(4,4,"#ffffff80")}
        {b(10,4,"#ffffff80")}
      </>) : (<>
        {b(4,5,E)}{b(5,5,E)}
        {b(10,5,E)}{b(11,5,E)}
      </>)}
      {/* Nose */}
      {b(7,6,K)}{b(8,6,K)}
      {/* Blush / whisker dots */}
      {b(2,5,K)}{b(13,5,K)}
    </>
  );

  /* ─────────── SHARED : Side-facing head (right) ─────────── */
  const sideHead = (
    <>
      {/* Far ear (back) */}
      {b(10,0,W)}{b(11,0,W)}{b(12,0,W)}
      {b(10,1,W)}{b(11,1,K)}{b(12,1,W)}
      {/* Near ear (front) — partially visible */}
      {b(7,0,W)}{b(8,0,W)}
      {b(7,1,W)}{b(8,1,K)}
      {/* Head — big round chibi */}
      {row([8,9,10,11,12,13],1,W)}
      {row([7,8,9,10,11,12,13],2,W)}
      {row([6,7,8,9,10,11,12,13,14],3,W)}
      {row([6,7,8,9,10,11,12,13,14],4,W)}
      {row([7,8,9,10,11,12,13],5,W)}
      {row([8,9,10,11,12],6,W)}
      {/* Eye — big & round */}
      {b(11,3,E)}{b(12,3,E)}{b(13,3,E)}
      {b(11,4,E)}{b(12,4,E)}{b(13,4,E)}
      {/* Pupil + sparkle */}
      {b(13,3,G)}{b(12,3,G)}
      {b(11,3,"#ffffff80")}
      {/* Nose */}
      {b(13,5,K)}{b(14,5,K)}
      {/* Mouth */}
      {b(13,6,K)}
      {/* Blush */}
      {b(14,4,K)}
      {/* Cheek fluff */}
      {b(6,4,F)}{b(6,5,F)}
    </>
  );

  const sprites: Record<string, JSX.Element> = {

    /* ════════════ FRONT SIT ════════════ */
    "front-sit": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {frontHead(true)}
        {/* Body */}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,F)}
        {row([5,6,7,8,9,10],10,W)}
        {/* Paws tucked */}
        {b(5,11,W)}{b(6,11,W)}{b(9,11,W)}{b(10,11,W)}
        {/* Tail */}
        {b(12,9,W)}{b(13,8,W)}{b(14,8,T)}
      </svg>
    ),

    /* ════════════ FRONT BLINK ════════════ */
    "front-blink": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {frontHead(false)}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,F)}
        {row([5,6,7,8,9,10],10,W)}
        {b(5,11,W)}{b(6,11,W)}{b(9,11,W)}{b(10,11,W)}
        {b(12,9,W)}{b(13,8,W)}{b(14,8,T)}
      </svg>
    ),

    /* ════════════ FRONT WALK 0 ════════════ */
    "front-walk0": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {frontHead(true)}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,F)}
        {row([5,6,7,8,9,10],10,W)}
        {/* Left paw forward */}
        {b(4,11,W)}{b(4,12,W)}
        {b(10,11,W)}{b(11,11,W)}
        {b(12,9,W)}{b(13,8,W)}{b(14,8,T)}
      </svg>
    ),
    "front-walk1": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {frontHead(true)}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,F)}
        {row([5,6,7,8,9,10],10,W)}
        {/* Right paw forward */}
        {b(5,11,W)}{b(5,12,W)}
        {b(11,11,W)}{b(11,12,W)}
        {b(13,9,W)}{b(14,8,W)}{b(14,7,T)}
      </svg>
    ),

    /* ════════════ BACK WALK ════════════ */
    "back-walk0": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {/* Ears from behind */}
        {b(3,0,W)}{b(4,0,T)}{b(11,0,T)}{b(12,0,W)}
        {b(3,1,W)}{b(4,1,W)}{b(11,1,W)}{b(12,1,W)}
        {/* Back of head */}
        {row([3,4,5,6,7,8,9,10,11,12],2,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],3,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],4,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],5,W)}
        {row([3,4,5,6,7,8,9,10,11,12],6,W)}
        {b(2,4,T)}{b(13,4,T)}
        {/* Body */}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,W)}
        {row([5,6,7,8,9,10],10,W)}
        {b(4,11,W)}{b(4,12,W)}
        {b(10,11,W)}{b(11,11,W)}
        {/* Tail poking up behind head */}
        {b(7,0,T)}{b(8,0,T)}
      </svg>
    ),
    "back-walk1": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {b(3,0,W)}{b(4,0,T)}{b(11,0,T)}{b(12,0,W)}
        {b(3,1,W)}{b(4,1,W)}{b(11,1,W)}{b(12,1,W)}
        {row([3,4,5,6,7,8,9,10,11,12],2,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],3,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],4,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],5,W)}
        {row([3,4,5,6,7,8,9,10,11,12],6,W)}
        {b(2,4,T)}{b(13,4,T)}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,W)}
        {row([5,6,7,8,9,10],10,W)}
        {b(5,11,W)}{b(5,12,W)}
        {b(11,11,W)}{b(11,12,W)}
        {b(7,0,T)}{b(8,0,T)}
      </svg>
    ),

    /* ════════════════════════════════════════
       SIDE VIEW — 4 RUN FRAMES (big & cute!)
       Uses wider viewbox for horizontal body
       ════════════════════════════════════════ */

    /* ── Run 0: Contact (legs under body) ── */
    "side-run0": (
      <svg width={32} height={SZ} viewBox={vbSide}>
        {sideHead}
        {/* Body — round & fluffy */}
        {row([4,5,6,7,8,9],6,W)}
        {row([3,4,5,6,7,8,9,10],7,W)}
        {row([2,3,4,5,6,7,8,9,10],8,W)}
        {row([2,3,4,5,6,7,8,9,10],9,W)}
        {row([3,4,5,6,7,8,9],10,W)}
        {/* Belly fluff */}
        {b(5,8,F)}{b(6,8,F)}{b(7,8,F)}{b(8,8,F)}
        {b(5,9,F)}{b(6,9,F)}{b(7,9,F)}
        {/* Legs together */}
        {b(4,11,W)}{b(5,11,W)}
        {b(8,11,W)}{b(9,11,W)}
        {/* Tail — curled up gracefully */}
        {b(1,7,W)}{b(0,6,T)}{b(0,5,T)}{b(1,4,T)}
      </svg>
    ),

    /* ── Run 1: Front reaches, back pushes (stride!) ── */
    "side-run1": (
      <svg width={32} height={SZ} viewBox={vbSide}>
        {sideHead}
        {row([4,5,6,7,8,9],6,W)}
        {row([3,4,5,6,7,8,9,10],7,W)}
        {row([2,3,4,5,6,7,8,9,10],8,W)}
        {row([2,3,4,5,6,7,8,9,10],9,W)}
        {row([3,4,5,6,7,8,9],10,W)}
        {b(5,8,F)}{b(6,8,F)}{b(7,8,F)}{b(8,8,F)}
        {b(5,9,F)}{b(6,9,F)}{b(7,9,F)}
        {/* Front leg reaches forward! */}
        {b(9,11,W)}{b(10,11,W)}{b(11,11,W)}{b(11,12,W)}
        {/* Back leg pushes back */}
        {b(3,11,W)}{b(2,11,W)}{b(1,11,W)}{b(1,12,W)}
        {/* Tail UP — running high */}
        {b(1,6,W)}{b(0,5,T)}{b(0,4,T)}{b(1,3,T)}
      </svg>
    ),

    /* ── Run 2: Airborne! (legs tucked, body slightly higher) ── */
    "side-run2": (
      <svg width={32} height={SZ} viewBox={vbSide}>
        {sideHead}
        {row([4,5,6,7,8,9],6,W)}
        {row([3,4,5,6,7,8,9,10],7,W)}
        {row([2,3,4,5,6,7,8,9,10],8,W)}
        {row([2,3,4,5,6,7,8,9,10],9,W)}
        {row([3,4,5,6,7,8,9],10,W)}
        {b(5,8,F)}{b(6,8,F)}{b(7,8,F)}{b(8,8,F)}
        {b(5,9,F)}{b(6,9,F)}{b(7,9,F)}
        {/* Legs tucked under — airborne! */}
        {b(5,11,W)}{b(6,11,W)}
        {b(7,11,W)}{b(8,11,W)}
        {/* Tail mid-high */}
        {b(1,7,W)}{b(0,6,T)}{b(0,5,T)}
      </svg>
    ),

    /* ── Run 3: Opposite stride ── */
    "side-run3": (
      <svg width={32} height={SZ} viewBox={vbSide}>
        {sideHead}
        {row([4,5,6,7,8,9],6,W)}
        {row([3,4,5,6,7,8,9,10],7,W)}
        {row([2,3,4,5,6,7,8,9,10],8,W)}
        {row([2,3,4,5,6,7,8,9,10],9,W)}
        {row([3,4,5,6,7,8,9],10,W)}
        {b(5,8,F)}{b(6,8,F)}{b(7,8,F)}{b(8,8,F)}
        {b(5,9,F)}{b(6,9,F)}{b(7,9,F)}
        {/* Front leg pushes back */}
        {b(5,11,W)}{b(4,11,W)}{b(3,12,W)}
        {/* Back leg reaches forward */}
        {b(8,11,W)}{b(9,11,W)}{b(10,12,W)}
        {/* Tail swoops down */}
        {b(1,8,W)}{b(0,8,T)}{b(0,9,T)}
      </svg>
    ),

    /* ════════════ FRONT-DIAGONAL ════════════ */
    "front-diag-walk0": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {/* Ears - right more visible */}
        {b(3,0,W)}{b(4,0,W)}
        {b(10,0,W)}{b(11,0,W)}{b(12,0,W)}
        {b(3,1,W)}{b(4,1,K)}
        {b(10,1,W)}{b(11,1,K)}{b(12,1,W)}
        {/* Head turned */}
        {row([3,4,5,6,7,8,9,10,11,12],2,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],3,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],4,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],5,W)}
        {row([3,4,5,6,7,8,9,10,11,12],6,W)}
        {/* Eyes — right bigger (closer) */}
        {b(4,4,E)}{b(5,4,E)}{b(4,5,E)}{b(5,5,E)}
        {b(5,4,G)}
        {b(10,4,E)}{b(11,4,E)}{b(12,4,E)}
        {b(10,5,E)}{b(11,5,E)}{b(12,5,E)}
        {b(12,4,G)}{b(11,4,G)}
        {/* Nose offset */}
        {b(8,6,K)}{b(9,6,K)}
        {b(2,5,K)}{b(13,5,K)}
        {/* Body */}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,F)}
        {row([5,6,7,8,9,10],10,W)}
        {b(4,11,W)}{b(4,12,W)}
        {b(10,11,W)}{b(11,11,W)}
        {b(3,8,W)}{b(2,7,T)}
      </svg>
    ),
    "front-diag-walk1": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {b(3,0,W)}{b(4,0,W)}
        {b(10,0,W)}{b(11,0,W)}{b(12,0,W)}
        {b(3,1,W)}{b(4,1,K)}
        {b(10,1,W)}{b(11,1,K)}{b(12,1,W)}
        {row([3,4,5,6,7,8,9,10,11,12],2,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],3,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],4,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],5,W)}
        {row([3,4,5,6,7,8,9,10,11,12],6,W)}
        {b(4,4,E)}{b(5,4,E)}{b(4,5,E)}{b(5,5,E)}
        {b(5,4,G)}
        {b(10,4,E)}{b(11,4,E)}{b(12,4,E)}
        {b(10,5,E)}{b(11,5,E)}{b(12,5,E)}
        {b(12,4,G)}{b(11,4,G)}
        {b(8,6,K)}{b(9,6,K)}
        {b(2,5,K)}{b(13,5,K)}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,F)}
        {row([5,6,7,8,9,10],10,W)}
        {b(5,11,W)}{b(5,12,W)}
        {b(11,11,W)}{b(11,12,W)}
        {b(3,9,W)}{b(2,8,T)}
      </svg>
    ),

    /* ════════════ BACK-DIAGONAL ════════════ */
    "back-diag-walk0": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {b(3,0,W)}{b(4,0,T)}{b(11,0,T)}{b(12,0,W)}
        {b(3,1,W)}{b(4,1,W)}{b(11,1,W)}{b(12,1,W)}
        {row([3,4,5,6,7,8,9,10,11,12],2,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],3,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],4,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],5,W)}
        {row([3,4,5,6,7,8,9,10,11,12],6,W)}
        {/* Partial eye on far side */}
        {b(12,4,E)}{b(13,4,T)}
        {b(13,3,T)}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,W)}
        {row([5,6,7,8,9,10],10,W)}
        {b(4,11,W)}{b(4,12,W)}
        {b(10,11,W)}{b(11,11,W)}
        {b(3,8,W)}{b(2,7,T)}{b(1,6,T)}
      </svg>
    ),
    "back-diag-walk1": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {b(3,0,W)}{b(4,0,T)}{b(11,0,T)}{b(12,0,W)}
        {b(3,1,W)}{b(4,1,W)}{b(11,1,W)}{b(12,1,W)}
        {row([3,4,5,6,7,8,9,10,11,12],2,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],3,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],4,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],5,W)}
        {row([3,4,5,6,7,8,9,10,11,12],6,W)}
        {b(12,4,E)}{b(13,4,T)}
        {b(13,3,T)}
        {row([4,5,6,7,8,9,10,11],7,W)}
        {row([4,5,6,7,8,9,10,11],8,W)}
        {row([5,6,7,8,9,10],9,W)}
        {row([5,6,7,8,9,10],10,W)}
        {b(5,11,W)}{b(5,12,W)}
        {b(11,11,W)}{b(11,12,W)}
        {b(3,9,W)}{b(2,9,T)}{b(1,8,T)}
      </svg>
    ),

    /* ════════════ SLEEP — curled up, eyes closed ════════════ */
    /* Two frames alternate for a gentle breathing animation */

    "sleep0": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {/* Ears — relaxed, droopy */}
        {b(3,2,W)}{b(4,2,W)}{b(11,2,W)}{b(12,2,W)}
        {b(3,3,W)}{b(4,3,K)}{b(11,3,K)}{b(12,3,W)}
        {/* Head resting */}
        {row([3,4,5,6,7,8,9,10,11,12],4,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],5,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],6,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],7,W)}
        {row([3,4,5,6,7,8,9,10,11,12],8,W)}
        {/* Closed eyes — happy sleep lines */}
        {b(4,6,E)}{b(5,6,E)}{b(6,6,E)}
        {b(9,6,E)}{b(10,6,E)}{b(11,6,E)}
        {/* Nose */}
        {b(7,8,K)}{b(8,8,K)}
        {/* Blush */}
        {b(2,7,K)}{b(13,7,K)}
        {/* Body curled — compact */}
        {row([4,5,6,7,8,9,10,11],9,W)}
        {row([3,4,5,6,7,8,9,10,11,12],10,W)}
        {row([3,4,5,6,7,8,9,10,11,12],11,W)}
        {b(5,10,F)}{b(6,10,F)}{b(7,10,F)}{b(8,10,F)}
        {/* Paws tucked in front */}
        {b(4,12,W)}{b(5,12,W)}{b(10,12,W)}{b(11,12,W)}
        {/* Tail wrapping around */}
        {b(13,10,W)}{b(14,10,W)}{b(14,11,T)}{b(13,12,T)}{b(12,12,T)}
      </svg>
    ),

    "sleep1": (
      <svg width={SZ} height={SZ} viewBox={vbFront}>
        {/* Ears — relaxed */}
        {b(3,2,W)}{b(4,2,W)}{b(11,2,W)}{b(12,2,W)}
        {b(3,3,W)}{b(4,3,K)}{b(11,3,K)}{b(12,3,W)}
        {/* Head resting */}
        {row([3,4,5,6,7,8,9,10,11,12],4,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],5,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],6,W)}
        {row([2,3,4,5,6,7,8,9,10,11,12,13],7,W)}
        {row([3,4,5,6,7,8,9,10,11,12],8,W)}
        {/* Closed eyes */}
        {b(4,6,E)}{b(5,6,E)}{b(6,6,E)}
        {b(9,6,E)}{b(10,6,E)}{b(11,6,E)}
        {/* Nose */}
        {b(7,8,K)}{b(8,8,K)}
        {/* Blush */}
        {b(2,7,K)}{b(13,7,K)}
        {/* Body curled — slightly expanded (breathing) */}
        {row([4,5,6,7,8,9,10,11],9,W)}
        {row([3,4,5,6,7,8,9,10,11,12],10,W)}
        {row([3,4,5,6,7,8,9,10,11,12],11,W)}
        {row([4,5,6,7,8,9,10,11],12,W)}
        {b(5,10,F)}{b(6,10,F)}{b(7,10,F)}{b(8,10,F)}{b(9,10,F)}
        {/* Paws */}
        {b(4,12,W)}{b(11,12,W)}
        {/* Tail */}
        {b(13,10,W)}{b(14,10,W)}{b(14,11,T)}{b(13,12,T)}{b(12,12,T)}
      </svg>
    ),
  };

  return <>{sprites[frame] || sprites["front-sit"]}</>;
}
