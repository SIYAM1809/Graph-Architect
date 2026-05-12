'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Code2, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const router = useRouter();

  const handleStartCanvas = () => {
    const newCanvasId = Math.random().toString(36).substring(2, 9);
    router.push(`/canvas/${newCanvasId}`);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#020617] text-slate-50 font-sans">
      <Navbar />

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <main className="flex-1 w-full z-10 pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-10 mb-32">
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
            className="glass-panel p-10 rounded-3xl space-y-8 relative group max-w-2xl mx-auto"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-200">
                Ready to start syncing?
              </h2>
              <p className="text-slate-400">Create a new workspace or join an existing one.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleStartCanvas}
                className="group relative inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-950 px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white to-slate-200"></span>
                <span className="relative flex items-center gap-2">
                  Start New Canvas
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              (Or paste a link shared by your teammate into your URL bar)
            </p>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">Built for Engineering Teams</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Everything you need to conceptualize, design, and bootstrap your microservice architecture in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-3">Multiplayer Collaboration</h3>
              <p className="text-slate-400 leading-relaxed">
                See your teammates' cursors in real-time. Design complex system topologies together without stepping on each other's toes.
              </p>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                <Code2 size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-3">Living Code Components</h3>
              <p className="text-slate-400 leading-relaxed">
                Every node on your canvas holds real code. Double click any service, API, or database to edit the actual underlying configuration.
              </p>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
                <Download size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-3">One-Click Export</h3>
              <p className="text-slate-400 leading-relaxed">
                Stop re-writing boilerplate. Once your diagram is complete, instantly download a packaged ZIP file with all your synchronized code.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
