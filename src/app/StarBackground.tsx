"use client";
import React, { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let rafId: number;

    // ── Resize canvas to full document height ──────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Star factory ───────────────────────────────────────────────────────
    const STAR_COUNT = 80;

    interface Star {
      x: number; y: number;
      size: number;           // base arm-length
      speedX: number;
      speedY: number;
      phase: number;          // twinkle phase offset
      twinkleSpeed: number;
      color: string;
    }

    const COLORS = [
      'rgba(167, 139, 250,',  // violet-400
      'rgba(196, 181, 253,',  // violet-300
      'rgba(216, 180, 254,',  // purple-300
      'rgba(232, 121, 249,',  // fuchsia-400
      'rgba(255, 255, 255,',  // white
    ];

    const makeStars = (): Star[] =>
      Array.from({ length: STAR_COUNT }, () => {
        const docH = document.documentElement.scrollHeight;
        return {
          x:            Math.random() * window.innerWidth,
          y:            Math.random() * docH,
          size:         Math.random() * 14 + 4,   // 4px – 18px arm length
          speedX:       (Math.random() - 0.5) * 0.35,
          speedY:       (Math.random() - 0.5) * 0.35,
          phase:        Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          color:        COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      });

    let stars = makeStars();

    // Re-generate when window resizes so stars fill new height
    const onResize = () => {
      resize();
      stars = makeStars();
    };
    window.addEventListener('resize', onResize);

    // ── Draw a 4-point star (cross / lens-flare shape) ─────────────────────
    const drawStar = (s: Star, opacity: number) => {
      const { x, y, size, color } = s;
      ctx.save();

      // Glow
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
      grad.addColorStop(0,   `${color} ${(opacity * 0.6).toFixed(2)})`);
      grad.addColorStop(1,   `${color} 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 4-point arms
      ctx.strokeStyle = `${color} ${opacity.toFixed(2)})`;
      ctx.lineWidth   = size * 0.18;
      ctx.lineCap     = 'round';

      // Horizontal arm
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.stroke();

      // Vertical arm
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();

      // Diagonal thin arms (shorter, softer)
      const d = size * 0.45;
      ctx.lineWidth = size * 0.08;
      ctx.globalAlpha = opacity * 0.5;
      ctx.beginPath();
      ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d); ctx.stroke();

      ctx.restore();
    };

    // ── Animation loop ─────────────────────────────────────────────────────
    let tick = 0;
    const render = () => {
      tick++;
      const docH = document.documentElement.scrollHeight;
      // Only resize height when document grew
      if (canvas.height !== docH) canvas.height = docH;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        // Move
        s.x += s.speedX;
        s.y += s.speedY;

        // Wrap around edges
        if (s.x < -30)              s.x = canvas.width + 30;
        if (s.x > canvas.width + 30) s.x = -30;
        if (s.y < -30)              s.y = canvas.height + 30;
        if (s.y > canvas.height + 30) s.y = -30;

        // Twinkle
        s.phase += s.twinkleSpeed;
        const opacity = 0.3 + 0.7 * ((Math.sin(s.phase) + 1) / 2);

        drawStar(s, opacity);
      });

      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}