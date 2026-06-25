"use client";
import React, { useEffect, useRef } from 'react';

export default function HomeWorks() {
  const worksRef = useRef<HTMLDivElement>(null);
  const worksAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !worksAnimated.current) {
          worksAnimated.current = true;
          entry.target.classList.add('works-visible');
        }
      },
      { threshold: 0.1 }
    );
    if (worksRef.current) observer.observe(worksRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="works" className="py-32 border-t border-slate-900 bg-slate-900/20">
      <style>{`
        @keyframes worksFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .work-card { opacity: 0; }
        .works-visible .work-card {
          animation: worksFadeUp 0.6s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Portfolio</span>
        <h2 className="text-5xl font-extrabold text-slate-100 mt-3 mb-20">Featured Works</h2>

        <div ref={worksRef} className="grid md:grid-cols-2 gap-12">
          {/* Project 1 */}
          <div className="group work-card bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-cyan-500/50 transition-all">
            <span className="inline-block text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full mb-4">Design</span>
            <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-cyan-400 transition-colors">Printed Shirts Designing</h3>
            <p className="text-slate-400 mb-6">Professional vector separations and mockups for high-quality production on physical substrates with precision layout alignment.</p>
            <div className="flex gap-2">
              <span className="text-xs bg-slate-950 px-3 py-1 rounded text-slate-400 border border-slate-800">Adobe Illustrator</span>
              <span className="text-xs bg-slate-950 px-3 py-1 rounded text-slate-400 border border-slate-800">Photoshop</span>
            </div>
          </div>

          {/* Project 2 */}
          <div className="group work-card bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-teal-500/50 transition-all" style={{ animationDelay: '0.12s' }}>
            <span className="inline-block text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full mb-4">Teaching</span>
            <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-teal-400 transition-colors">School Teaching Experience</h3>
            <p className="text-slate-400 mb-6">Organized operations, directed presentations, and enhanced verbal clarity. Crafted schedules for educational milestones.</p>
            <div className="flex gap-2">
              <span className="text-xs bg-slate-950 px-3 py-1 rounded text-slate-400 border border-slate-800">Management</span>
              <span className="text-xs bg-slate-950 px-3 py-1 rounded text-slate-400 border border-slate-800">Communication</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}