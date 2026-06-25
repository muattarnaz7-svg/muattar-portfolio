"use client";
import React from 'react';

interface HomeContactProps {
  onHireClick: () => void;
}

export default function HomeContact({ onHireClick }: HomeContactProps) {
  return (
    <section
      id="contact"
      className="py-32 border-t border-slate-900 bg-gradient-to-br from-slate-900/40 to-slate-900/20"
    >
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-5xl font-extrabold text-slate-100 mb-6">Ready to Start a Project?</h2>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          Let's collaborate on your next web or design project. I'm here to turn your ideas into beautiful, functional solutions.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/923112274310?text=Hello%20Muattar%2C%20I%20am%20interested%20in%20your%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 border border-slate-800 hover:border-green-500 hover:text-green-400 text-slate-400 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/20"
          >
            💬 Message on WhatsApp
          </a>
          <button
            onClick={onHireClick}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 text-slate-400 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
          >
            🤝 Hire Me
          </button>
        </div>
      </div>
    </section>
  );
}