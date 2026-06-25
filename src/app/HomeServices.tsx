"use client";
import React, { useEffect, useRef } from 'react';

export default function HomeServices() {
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !servicesAnimated.current) {
          servicesAnimated.current = true;
          entry.target.classList.add('services-visible');
        }
      },
      { threshold: 0.1 }
    );
    if (servicesRef.current) observer.observe(servicesRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-32 border-t border-slate-900">
      <style>{`
        @keyframes servicesFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .service-card { opacity: 0; }
        .services-visible .service-card {
          animation: servicesFadeUp 0.6s ease-out forwards;
        }
        .service-num {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .group:hover .service-num {
          transform: scale(1.15) translateY(-4px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">What I Offer</span>
        <h2 className="text-5xl font-extrabold text-slate-100 mt-3 mb-20">Services & Solutions</h2>

        <div ref={servicesRef} className="grid md:grid-cols-2 gap-12">
          {/* Service 1 */}
          <div className="group service-card">
            <div className="service-num text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-4">01</div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-cyan-400 transition-colors">Web Development</h3>
            <p className="text-slate-400 mb-6">Building responsive, high-performance websites and web applications using Next.js, React, and modern frameworks.</p>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'Node.js', 'Tailwind CSS'].map((tech) => (
                <span key={tech} className="text-xs bg-slate-900 px-3 py-1 rounded-full text-slate-300 border border-slate-800">{tech}</span>
              ))}
            </div>
          </div>

          {/* Service 2 */}
          <div className="group service-card" style={{ animationDelay: '0.12s' }}>
            <div className="service-num text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-4">02</div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-teal-400 transition-colors">Graphic Design</h3>
            <p className="text-slate-400 mb-6">Creating stunning visual designs, branding materials, and UI mockups for digital and print media.</p>
            <div className="flex flex-wrap gap-2">
              {['Illustrator', 'Photoshop', 'Figma', 'Adobe XD'].map((tool) => (
                <span key={tool} className="text-xs bg-slate-900 px-3 py-1 rounded-full text-slate-300 border border-slate-800">{tool}</span>
              ))}
            </div>
          </div>

          {/* Service 3 */}
          <div className="group service-card" style={{ animationDelay: '0.24s' }}>
            <div className="service-num text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">03</div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-purple-400 transition-colors">UI/UX Design</h3>
            <p className="text-slate-400 mb-6">Designing beautiful, intuitive user interfaces with focus on user experience and modern design principles.</p>
            <div className="flex flex-wrap gap-2">
              {['Wireframing', 'Prototyping', 'User Research', 'Design Systems'].map((skill) => (
                <span key={skill} className="text-xs bg-slate-900 px-3 py-1 rounded-full text-slate-300 border border-slate-800">{skill}</span>
              ))}
            </div>
          </div>

          {/* Service 4 */}
          <div className="group service-card" style={{ animationDelay: '0.36s' }}>
            <div className="service-num text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-4">04</div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-orange-400 transition-colors">MS Office & Data Work</h3>
            <p className="text-slate-400 mb-6">Professional document creation, data management, and presentation design using Microsoft Office Suite with full command over all tools.</p>
            <div className="flex flex-wrap gap-2">
              {['Microsoft Word', 'Excel', 'PowerPoint', 'Data Entry'].map((tool) => (
                <span key={tool} className="text-xs bg-slate-900 px-3 py-1 rounded-full text-slate-300 border border-slate-800">{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}