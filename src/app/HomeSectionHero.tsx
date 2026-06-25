"use client";
import React, { useState, useEffect, useRef } from 'react';

interface HomeSectionHeroProps {
  onHireClick: () => void;
}

export default function HomeSectionHero({ onHireClick }: HomeSectionHeroProps) {
  // Hero network background — moving particles connected by lines
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = networkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    let rafId: number;
    let width = 0, height = 0;

    const PARTICLE_COUNT = 70;
    const LINK_DISTANCE = 150;

    const init = () => {
      const parent = canvas.parentElement!;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 1.2,
      }));
    };
    init();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            const opacity = 1 - dist / LINK_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.35})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.fill();
      });
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Typewriter effect
  const heroTagline = 'Creative Developer & Designer';
  const [typedTagline, setTypedTagline] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedTagline(heroTagline.slice(0, i));
      if (i >= heroTagline.length) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative pt-20 pb-32 min-h-screen flex items-center justify-center text-center overflow-hidden"
    >
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-1 { opacity: 0; animation: heroFadeUp 0.6s ease-out 2.6s forwards; }
        .hero-fade-2 { opacity: 0; animation: heroFadeUp 0.6s ease-out 2.7s forwards; }
        .hero-fade-3 { opacity: 0; animation: heroFadeUp 0.6s ease-out 2.8s forwards; }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-90px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(90px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .btn-slide-left { opacity: 0; animation: slideInLeft 0.6s ease-out 3.4s forwards; }
        .btn-slide-right { opacity: 0; animation: slideInRight 0.6s ease-out 3.5s forwards; }

        @keyframes blinkCaret { 50% { opacity: 0; } }
        .typing-caret { margin-left: 2px; animation: blinkCaret 0.8s step-end infinite; }
      `}</style>

      <canvas ref={networkCanvasRef} className="absolute inset-0 w-full h-full z-0 opacity-70" />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-6 hero-fade-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Welcome to My Portfolio
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-tight text-slate-100 mb-6 hero-fade-2">
          Muattar Irfan
        </h1>

        <p className="text-2xl md:text-3xl text-cyan-400 font-bold mb-6">
          {typedTagline}<span className="typing-caret">|</span>
        </p>

        <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto hero-fade-3">
          Full-stack developer and graphic designer specializing in web development, UI/UX design, and digital branding. Transforming ideas into beautiful, functional solutions.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/923112274310?text=Hello%20Muattar%2C%20I%20am%20interested%20in%20your%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 border border-slate-800 hover:border-green-500 hover:text-green-400 text-slate-400 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/20 btn-slide-left"
          >
            💬 WhatsApp Message
          </a>
          <button
            onClick={onHireClick}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 text-slate-400 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 btn-slide-right"
          >
            🤝 Hire Me
          </button>
        </div>
      </div>
    </section>
  );
}