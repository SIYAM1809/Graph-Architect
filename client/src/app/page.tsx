'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const generateCanvasId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const newCanvasId = generateCanvasId();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#020617] text-slate-50 font-sans p-6">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <main className="max-w-3xl text-center space-y-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 mb-6 text-sm font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time collaboration enabled
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Dev-Sync</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            The collaborative living diagram editor. Design architecture and write code simultaneously.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="glass-panel p-10 rounded-3xl space-y-8 relative group"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">
              Ready to start syncing?
            </h2>
            <p className="text-slate-400">Create a new workspace or join an existing one.</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/canvas/${newCanvasId}`}
              className="group relative inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-950 px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white to-slate-200"></span>
              <span className="relative flex items-center gap-2">
                Start New Canvas
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            (Or paste a link shared by your teammate into your URL bar)
          </p>
        </motion.div>
      </main>
    </div>
  );
}
