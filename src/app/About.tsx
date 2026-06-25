'use client';
import React, { useRef, useEffect, useState } from 'react';

export default function About() {
  const aboutRef = useRef(null);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      },
      { threshold: 0.2 }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate random stars
  useEffect(() => {
    const generatedStars = [];
    for (let i = 0; i < 60; i++) {
      generatedStars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.6 + 0.4,
      });
    }
    setStars(generatedStars);
  }, []);

  return (
    <>
      <style>{`
        /* ⭐ Stars Background Animations */
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes float {
          0% { 
            transform: translateY(0px) translateX(0px) scale(1);
          }
          25% { 
            transform: translateY(-25px) translateX(12px) scale(1.2);
          }
          50% { 
            transform: translateY(-40px) translateX(-18px) scale(0.8);
          }
          75% { 
            transform: translateY(-15px) translateX(10px) scale(1.1);
          }
          100% { 
            transform: translateY(0px) translateX(0px) scale(1);
          }
        }

        .stars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .star {
          position: absolute;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(224,242,254,0.8));
          border-radius: 50%;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 2px rgba(34,211,238,0.5));
        }

        /* Main animations */
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-80px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .about-left-animate {
          opacity: 0;
        }
        .about-left-animate.in-view {
          animation: slideFromLeft 0.75s ease-out forwards;
        }

        @keyframes gtFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .gt-card {
          animation: gtFadeUp 0.7s ease-out both;
        }
        .gt-item {
          opacity: 0;
          animation: gtFadeUp 0.6s ease-out forwards;
        }
        .gt-row {
          transition: transform 0.25s ease, background-color 0.25s ease;
          border-radius: 10px;
          padding: 6px 10px;
          margin: -6px -10px;
        }
        .gt-row:hover {
          transform: translateX(6px);
          background-color: rgba(34, 211, 238, 0.05);
        }
      `}</style>

      {/* ⭐ Stars Background */}
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out infinite, float ${star.duration * 1.8}s ease-in-out infinite`,
              animationDelay: `${star.delay}s, ${star.delay}s`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>

      <header id="about" className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center border-t border-slate-900 relative z-20">

        {/* ✅ LEFT SIDE — slides in from left when scrolled into view */}
        <div ref={aboutRef} className="about-left-animate">
          <img src="/muattar-about-logo.svg" alt="Muattar Logo" style={{height: '90px', width: 'auto', marginBottom: '20px'}} />
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Creative Developer & Designer
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-100 mb-6">
            Building Digital Solutions
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-8">
            Full-stack developer and graphic designer specializing in web development, UI/UX design, and digital branding. Transforming ideas into beautiful, functional solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="https://wa.me/923112274310?text=Hello%20Muattar%2C%20I%20am%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer" className="bg-slate-900 border border-slate-800 hover:border-green-500 hover:text-green-400 text-slate-400 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/20">
              💬 WhatsApp
            </a>
            <button onClick={() => {
              const event = new CustomEvent('openHireModal');
              window.dispatchEvent(event);
            }} className="bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 text-slate-400 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20">
              🤝 Hire Me
            </button>
            <a href="#works" className="border-2 border-cyan-500/50 hover:border-cyan-500 text-cyan-400 font-bold px-8 py-4 rounded-xl transition-all">
              View Work
            </a>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 backdrop-blur relative shadow-2xl gt-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full animate-pulse" style={{animationDuration: '4s'}} />
          <img src="/muattar-favicon.svg" alt="Muattar Logo" style={{height: '50px', width: 'auto', marginBottom: '12px'}} className="gt-item" />
          <h3 className="text-xl font-bold text-slate-200 mb-8 gt-item" style={{animationDelay: '0.05s'}}>Get In Touch</h3>
          <div className="space-y-6 text-sm">
            <div className="gt-item gt-row" style={{animationDelay: '0.1s'}}>
              <p className="text-slate-500 mb-2">WhatsApp</p>
              <a href="https://wa.me/923112274310?text=Hello%20Muattar%2C%20I%20am%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer" className="text-slate-300 font-medium hover:text-green-400 transition-colors">Message on WhatsApp</a>
            </div>

            <div className="gt-item gt-row" style={{animationDelay: '0.18s'}}>
              <p className="text-slate-500 mb-2">Email</p>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=muattarnaz7@gmail.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 font-medium hover:text-cyan-400 transition-colors">muattarnaz7@gmail.com</a>
            </div>
            <div className="gt-item gt-row" style={{animationDelay: '0.26s'}}>
              <p className="text-slate-500 mb-2">Location</p>
              <p className="text-slate-300 font-medium">Karachi, Pakistan</p>
            </div>
            <div className="pt-6 border-t border-slate-900 gt-item" style={{animationDelay: '0.34s'}}>
              <p className="text-slate-500 text-xs mb-3">Follow Me</p>
              <div className="flex gap-3">
                <a href="https://github.com/muattarnaz7-svg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center hover:border-cyan-500 hover:scale-110 hover:-translate-y-0.5 transition-all duration-300">
                  GH
                </a>
                <a href="https://linkedin.com/in/muattar-naz-8192a4401" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center hover:border-cyan-500 hover:scale-110 hover:-translate-y-0.5 transition-all duration-300">
                  LI
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}