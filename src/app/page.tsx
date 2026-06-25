"use client";
import React, { useState, useEffect, useRef } from 'react';

// ─── Section Components ───────────────────────────────────────────────────────
import HomeSectionHero from './HomeSectionHero';
import HomeServices    from './HomeServices';
import HomeWorks       from './HomeWorks';
import HomeContact     from './HomeContact';

// ─── Other Existing Components ────────────────────────────────────────────────
import About     from './About';
import SnakeGame from './SnakeGame';

// ─── Hire Me Roles ────────────────────────────────────────────────────────────
const HIRE_ROLES = ['Web Development', 'Graphic Design', 'UI/UX Design'];

export default function Home() {
  // ── Cursor trail (whole site) ──────────────────────────────────────────────
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailPoints     = useRef<{ x: number; y: number; t: number }[]>([]);

  useEffect(() => {
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const DOT_LIFETIME = 800;
    const MIN_DISTANCE = 6;

    const handleMove = (e: MouseEvent) => {
      const last = trailPoints.current[trailPoints.current.length - 1];
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        if (Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE) return;
      }
      trailPoints.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
    };
    window.addEventListener('mousemove', handleMove);

    let rafId: number;
    const render = () => {
      const now = Date.now();
      trailPoints.current = trailPoints.current.filter((p) => now - p.t < DOT_LIFETIME);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trailPoints.current.forEach((p) => {
        const progress = (now - p.t) / DOT_LIFETIME;
        const opacity  = 1 - progress;
        const radius   = Math.max(5 - progress * 3, 1.2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle   = `rgba(239, 68, 68, ${opacity})`;
        ctx.shadowColor = `rgba(239, 68, 68, ${opacity * 0.9})`;
        ctx.shadowBlur  = 10;
        ctx.fill();
      });
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Stats counting animation ───────────────────────────────────────────────
  const statsRef      = useRef<HTMLElement>(null);
  const statsAnimated = useRef(false);
  const [counts, setCounts] = useState({ projects: 0, clients: 0, skills: 0, years: 0 });

  useEffect(() => {
    const targets  = { projects: 10, clients: 5, skills: 7, years: 2 };
    const duration = 1800;
    const steps    = 60;
    const stepTime = duration / steps;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsAnimated.current) {
          statsAnimated.current = true;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased    = 1 - Math.pow(1 - progress, 3);
            setCounts({
              projects: Math.round(eased * targets.projects),
              clients:  Math.round(eased * targets.clients),
              skills:   Math.round(eased * targets.skills),
              years:    Math.round(eased * targets.years),
            });
            if (step >= steps) clearInterval(timer);
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Technical Stack scroll animation ──────────────────────────────────────
  const stackRef      = useRef<HTMLDivElement>(null);
  const stackAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !stackAnimated.current) {
          stackAnimated.current = true;
          entry.target.classList.add('stack-visible');
        }
      },
      { threshold: 0.1 }
    );
    if (stackRef.current) observer.observe(stackRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Internships scroll animation ───────────────────────────────────────────
  const internshipsRef      = useRef<HTMLDivElement>(null);
  const internshipsAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !internshipsAnimated.current) {
          internshipsAnimated.current = true;
          entry.target.classList.add('internships-visible');
        }
      },
      { threshold: 0.1 }
    );
    if (internshipsRef.current) observer.observe(internshipsRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Hire Me modal state ────────────────────────────────────────────────────
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireStep,      setHireStep]      = useState<'role' | 'platform'>('role');
  const [selectedRole,  setSelectedRole]  = useState<string | null>(null);

  const openHireModal = () => {
    setHireStep('role');
    setSelectedRole(null);
    setHireModalOpen(true);
  };
  const closeHireModal = () => setHireModalOpen(false);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setHireStep('platform');
  };

  const handlePlatformSelect = (platform: 'whatsapp' | 'gmail') => {
    const message = `Hello Muattar, I am interested in hiring you for the ${selectedRole} role.`;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/923112274310?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=muattarnaz7@gmail.com&su=${encodeURIComponent('Hiring Inquiry')}&body=${encodeURIComponent(message)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
    closeHireModal();
  };

  // Listen for custom event from About component
  useEffect(() => {
    window.addEventListener('openHireModal', openHireModal);
    return () => window.removeEventListener('openHireModal', openHireModal);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden scroll-smooth">

      {/* Glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <style>{`
        @keyframes navBounceIn {
          0%   { opacity: 0; transform: translateY(-100%); }
          55%  { opacity: 1; transform: translateY(14px); }
          75%  { transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .nav-bounce-in {
          opacity: 0;
          transform: translateY(-100%);
          animation: navBounceIn 0.9s ease-out 1.7s forwards;
        }
      `}</style>

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 border-b border-slate-900 bg-slate-950/95 backdrop-blur-md z-50 w-full nav-bounce-in">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#home" className="hover:text-cyan-400 transition-colors">
            <img src="/muattar-navbar-logo.svg" alt="Muattar Logo" style={{ height: '40px', width: 'auto' }} />
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#home"     className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#about"    className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#works"    className="hover:text-cyan-400 transition-colors">Works</a>
            <a href="#contact"  className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/muattarnaz7-svg" target="_blank" rel="noopener noreferrer"
               className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs font-semibold px-3 py-2 rounded-full transition-all">
              GitHub
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=muattarnaz7@gmail.com" target="_blank" rel="noopener noreferrer"
               className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-950 text-xs font-semibold px-4 py-2 rounded-full transition-all">
              Email Me
            </a>
            <a href="https://linkedin.com/in/muattar-naz-8192a4401" target="_blank" rel="noopener noreferrer"
               className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs font-semibold px-3 py-2 rounded-full transition-all">
              LinkedIn
            </a>
          </div>
        </div>
      </nav>

      {/* ── HOME SECTION ────────────────────────────────────────────────────── */}
      <HomeSectionHero onHireClick={openHireModal} />

      {/* ── ABOUT SECTION ───────────────────────────────────────────────────── */}
      <About />

      {/* ── STATS SECTION ───────────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-20 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-cyan-400 mb-2">{counts.projects}+</div>
            <p className="text-slate-400">Projects Completed</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-teal-400 mb-2">{counts.clients}+</div>
            <p className="text-slate-400">Clients Served</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-purple-400 mb-2">{counts.skills}+</div>
            <p className="text-slate-400">Skills Mastered</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">{counts.years}+</div>
            <p className="text-slate-400">Years Experience</p>
          </div>
        </div>
      </section>

      {/* ── SNAKE GAME ──────────────────────────────────────────────────────── */}
      <SnakeGame />

      {/* ── SERVICES SECTION ────────────────────────────────────────────────── */}
      <HomeServices />

      {/* ── FEATURED WORKS SECTION ──────────────────────────────────────────── */}
      <HomeWorks />

      {/* ── INTERNSHIPS SECTION ─────────────────────────────────────────────── */}
      <section id="internships" className="py-32 border-t border-slate-900">
        <style>{`
          @keyframes internshipsFadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .internship-card { opacity: 0; }
          .internships-visible .internship-card {
            animation: internshipsFadeUp 0.6s ease-out forwards;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Experience</span>
          <h2 className="text-5xl font-extrabold text-slate-100 mt-3 mb-20">Internships</h2>

          <div ref={internshipsRef} className="grid md:grid-cols-2 gap-12">
            <div className="group internship-card bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-cyan-500/50 transition-all">
              <span className="inline-block text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full mb-4">Web Development Intern</span>
              <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-cyan-400 transition-colors">Frontend Web Development Internship</h3>
              <p className="text-slate-400 mb-6">Assisted in building and maintaining responsive websites using React and Next.js, collaborating with senior developers to implement UI components and fix bugs.</p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'Tailwind CSS'].map(t => <span key={t} className="text-xs bg-slate-950 px-3 py-1 rounded text-slate-400 border border-slate-800">{t}</span>)}
              </div>
            </div>

            <div className="group internship-card bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-teal-500/50 transition-all" style={{ animationDelay: '0.1s' }}>
              <span className="inline-block text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full mb-4">Graphic Design Intern</span>
              <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-teal-400 transition-colors">Graphic Design Internship</h3>
              <p className="text-slate-400 mb-6">Designed marketing visuals, social media creatives, and branding assets for client projects, ensuring consistency with brand guidelines.</p>
              <div className="flex flex-wrap gap-2">
                {['Illustrator', 'Photoshop', 'Branding'].map(t => <span key={t} className="text-xs bg-slate-950 px-3 py-1 rounded text-slate-400 border border-slate-800">{t}</span>)}
              </div>
            </div>

            <div className="group internship-card bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-purple-500/50 transition-all" style={{ animationDelay: '0.2s' }}>
              <span className="inline-block text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full mb-4">UI/UX Design Intern</span>
              <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-purple-400 transition-colors">UI/UX Design Internship</h3>
              <p className="text-slate-400 mb-6">Created wireframes and interactive prototypes for web and mobile apps, conducting basic user research to improve interface usability.</p>
              <div className="flex flex-wrap gap-2">
                {['Figma', 'Wireframing', 'Prototyping'].map(t => <span key={t} className="text-xs bg-slate-950 px-3 py-1 rounded text-slate-400 border border-slate-800">{t}</span>)}
              </div>
            </div>

            <div className="group internship-card bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-orange-500/50 transition-all" style={{ animationDelay: '0.3s' }}>
              <span className="inline-block text-xs font-mono text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full mb-4">MS Office Intern</span>
              <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-orange-400 transition-colors">Data Entry & MS Office Internship</h3>
              <p className="text-slate-400 mb-6">Managed data entry, prepared reports and presentations, and organized documentation using Excel, Word, and PowerPoint for daily office operations.</p>
              <div className="flex flex-wrap gap-2">
                {['Excel', 'Word', 'PowerPoint'].map(t => <span key={t} className="text-xs bg-slate-950 px-3 py-1 rounded text-slate-400 border border-slate-800">{t}</span>)}
              </div>
            </div>

            <div className="group internship-card bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-blue-500/50 transition-all md:col-span-2" style={{ animationDelay: '0.4s' }}>
              <span className="inline-block text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-4">Teaching Intern</span>
              <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-blue-400 transition-colors">Teaching & Content Internship</h3>
              <p className="text-slate-400 mb-6">Supported lesson planning, classroom presentations, and student communication, sharpening organizational skills and the ability to explain complex topics clearly.</p>
              <div className="flex flex-wrap gap-2">
                {['Lesson Planning', 'Presentation', 'Communication'].map(t => <span key={t} className="text-xs bg-slate-950 px-3 py-1 rounded text-slate-400 border border-slate-800">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECHNICAL STACK SECTION ─────────────────────────────────────────── */}
      <section className="py-32 border-t border-slate-900">
        <style>{`
          @keyframes stackSlideIn {
            from { opacity: 0; transform: translateX(-24px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          .stack-row { opacity: 0; }
          .stack-visible .stack-row {
            animation: stackSlideIn 0.5s ease-out forwards;
          }
          .hire-assemble-wrap { min-height: 64px; }
          .hire-piece {
            position: absolute; top: 50%; left: 50%;
            width: 26px; height: 26px; border-radius: 8px;
            background: linear-gradient(135deg, #22d3ee, #2dd4bf);
            opacity: 0; z-index: 5; pointer-events: none;
          }
          .hire-piece-top    { transform: translate(-50%, -50%) translateY(-260px); }
          .hire-piece-bottom { transform: translate(-50%, -50%) translateY(260px); }
          .hire-piece-left   { transform: translate(-50%, -50%) translateX(-340px); }
          .hire-piece-right  { transform: translate(-50%, -50%) translateX(340px); }
          .stack-visible .hire-piece-top    { animation: hirePieceTop    1s cubic-bezier(0.22,1,0.36,1) forwards; }
          .stack-visible .hire-piece-bottom { animation: hirePieceBottom 1s cubic-bezier(0.22,1,0.36,1) forwards; }
          .stack-visible .hire-piece-left   { animation: hirePieceLeft   1s cubic-bezier(0.22,1,0.36,1) forwards; }
          .stack-visible .hire-piece-right  { animation: hirePieceRight  1s cubic-bezier(0.22,1,0.36,1) forwards; }
          @keyframes hirePieceTop {
            0%  { opacity:0; transform:translate(-50%,-50%) translateY(-260px) rotate(0deg); }
            55% { opacity:1; transform:translate(-50%,-50%) translateY(0) rotate(180deg); }
            80% { opacity:1; transform:translate(-50%,-50%) translateY(0) rotate(180deg); }
            100%{ opacity:0; transform:translate(-50%,-50%) translateY(0) rotate(180deg); }
          }
          @keyframes hirePieceBottom {
            0%  { opacity:0; transform:translate(-50%,-50%) translateY(260px) rotate(0deg); }
            55% { opacity:1; transform:translate(-50%,-50%) translateY(0) rotate(-180deg); }
            80% { opacity:1; transform:translate(-50%,-50%) translateY(0) rotate(-180deg); }
            100%{ opacity:0; transform:translate(-50%,-50%) translateY(0) rotate(-180deg); }
          }
          @keyframes hirePieceLeft {
            0%  { opacity:0; transform:translate(-50%,-50%) translateX(-340px) rotate(0deg); }
            55% { opacity:1; transform:translate(-50%,-50%) translateX(0) rotate(180deg); }
            80% { opacity:1; transform:translate(-50%,-50%) translateX(0) rotate(180deg); }
            100%{ opacity:0; transform:translate(-50%,-50%) translateX(0) rotate(180deg); }
          }
          @keyframes hirePieceRight {
            0%  { opacity:0; transform:translate(-50%,-50%) translateX(340px) rotate(0deg); }
            55% { opacity:1; transform:translate(-50%,-50%) translateX(0) rotate(-180deg); }
            80% { opacity:1; transform:translate(-50%,-50%) translateX(0) rotate(-180deg); }
            100%{ opacity:0; transform:translate(-50%,-50%) translateX(0) rotate(-180deg); }
          }
          .hire-final-btn { opacity:0; transform:scale(0.6); }
          .stack-visible .hire-final-btn {
            animation: hireBtnReveal 0.45s ease-out 0.85s forwards;
          }
          @keyframes hireBtnReveal {
            from { opacity:0; transform:scale(0.6); }
            to   { opacity:1; transform:scale(1); }
          }
        `}</style>
        <div ref={stackRef} className="max-w-7xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Expertise</span>
          <h2 className="text-5xl font-extrabold text-slate-100 mt-3 mb-20">Technical Stack</h2>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold text-slate-200 mb-8 flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400" />
                Design & Creative Tools
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Adobe Illustrator', level: 'Expert' },
                  { name: 'Adobe Photoshop',  level: 'Advanced' },
                  { name: 'Figma',            level: 'Advanced' },
                  { name: 'Adobe XD',         level: 'Advanced' },
                ].map((skill, idx) => (
                  <div key={skill.name} className="stack-row flex justify-between items-center p-4 bg-slate-900/40 rounded-lg border border-slate-800 hover:border-cyan-500/50 transition-colors" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <span className="text-slate-300">{skill.name}</span>
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-200 mb-8 flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-teal-400 to-blue-400" />
                Web Development & Programming
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'HTML & CSS',        level: 'Expert' },
                  { name: 'JavaScript',        level: 'Advanced' },
                  { name: 'Next.js & React',   level: 'Advanced' },
                  { name: 'Node.js & Python',  level: 'Advanced' },
                ].map((skill, idx) => (
                  <div key={skill.name} className="stack-row flex justify-between items-center p-4 bg-slate-900/40 rounded-lg border border-slate-800 hover:border-teal-500/50 transition-colors" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
                    <span className="text-slate-300">{skill.name}</span>
                    <span className="text-xs text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full">{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex justify-center mt-16 hire-assemble-wrap">
            <span className="hire-piece hire-piece-top" />
            <span className="hire-piece hire-piece-bottom" />
            <span className="hire-piece hire-piece-left" />
            <span className="hire-piece hire-piece-right" />
            <button onClick={openHireModal} className="hire-final-btn relative z-10 bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 text-slate-400 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20">
              🤝 Hire Me
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="py-32 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Feedback</span>
          <h2 className="text-5xl font-extrabold text-slate-100 mt-3 mb-20">What Others Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "Muattar delivered exceptional design work. His attention to detail and creative approach transformed our brand identity.", author: "Client 1", role: "Creative Director" },
              { text: "Professional and reliable. Muattar completed the web development project on time with high-quality code.", author: "Client 2", role: "Project Manager" },
              { text: "Great communication skills and problem-solving abilities. Highly recommended for any design and development work.", author: "Client 3", role: "Business Owner" },
            ].map((t, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8">
                <div className="text-cyan-400 text-2xl mb-4">★★★★★</div>
                <p className="text-slate-300 mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-slate-200">{t.author}</p>
                  <p className="text-sm text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ───────────────────────────────────────────────────────── */}
      <section className="py-32 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Background</span>
          <h2 className="text-5xl font-extrabold text-slate-100 mt-3 mb-20">Education & Certifications</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8">
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">Academic</span>
              <h3 className="text-xl font-bold text-slate-200 mt-5 mb-2">Pre Engineering</h3>
              <p className="text-slate-400 text-sm">Higher Secondary Education Certificate with focus on technical subjects.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">Certification</span>
              <h3 className="text-xl font-bold text-slate-200 mt-5 mb-2">DIT Certificate</h3>
              <p className="text-slate-400 text-sm">Diploma in Information Technology with comprehensive IT fundamentals.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8">
              <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full">Courses</span>
              <h3 className="text-xl font-bold text-slate-200 mt-5 mb-2">Professional Training</h3>
              <p className="text-slate-400 text-sm">Web Development, Website Designing, MS Office, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ─────────────────────────────────────────────────── */}
      <HomeContact onHireClick={openHireModal} />

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-900 py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <img src="/muattar-favicon.svg" alt="Muattar Logo" style={{ height: '60px', width: 'auto', marginBottom: '12px' }} />
              <p className="text-slate-400">Full-stack developer and graphic designer creating beautiful digital experiences.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-4 uppercase">Quick Links</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#home"     className="hover:text-cyan-400 transition-colors">Home</a></li>
                  <li><a href="#about"    className="hover:text-cyan-400 transition-colors">About</a></li>
                  <li><a href="#services" className="hover:text-cyan-400 transition-colors">Services</a></li>
                  <li><a href="#works"    className="hover:text-cyan-400 transition-colors">Works</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-4 uppercase">Social</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="https://github.com/muattarnaz7-svg" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a></li>
                  <li><a href="https://linkedin.com/in/muattar-naz-8192a4401" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">LinkedIn</a></li>
                  <li><a href="https://mail.google.com/mail/?view=cm&fs=1&to=muattarnaz7@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Email</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <span>Copyright © {new Date().getFullYear()} Muattar Irfan. All rights reserved.</span>
            <span>Crafted with creativity & technical excellence</span>
          </div>
        </div>
      </footer>

      {/* ── HIRE ME MODAL ───────────────────────────────────────────────────── */}
      {hireModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-6"
          onClick={closeHireModal}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeHireModal} aria-label="Close" className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">✕</button>

            {hireStep === 'role' && (
              <>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Let's Get Started</h3>
                <p className="text-slate-400 mb-6">Which role are you hiring for?</p>
                <div className="space-y-3">
                  {HIRE_ROLES.map((role) => (
                    <button key={role} onClick={() => handleRoleSelect(role)}
                      className="w-full text-left bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 text-slate-300 font-semibold px-5 py-4 rounded-xl transition-all">
                      {role}
                    </button>
                  ))}
                </div>
              </>
            )}

            {hireStep === 'platform' && (
              <>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Almost There</h3>
                <p className="text-slate-400 mb-6">
                  Hiring for <span className="text-cyan-400 font-semibold">{selectedRole}</span>. How would you like to send your message?
                </p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handlePlatformSelect('whatsapp')}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-green-500 hover:text-green-400 text-slate-300 font-semibold px-5 py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                    💬 WhatsApp
                  </button>
                  <button onClick={() => handlePlatformSelect('gmail')}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 text-slate-300 font-semibold px-5 py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                    📧 Gmail
                  </button>
                </div>
                <button onClick={() => setHireStep('role')} className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  ← Back
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── CURSOR TRAIL ────────────────────────────────────────────────────── */}
      <canvas ref={cursorCanvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />
    </div>
  );
}