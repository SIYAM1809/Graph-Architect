import Link from 'next/link';

const Github = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-gradient">Dev-Sync</span>
        </Link>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition">Features</a>
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition">Documentation</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition">
            <Github size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
}
