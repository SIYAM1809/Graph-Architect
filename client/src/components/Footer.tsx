import Link from 'next/link';

const Github = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" /></svg>
);

const Twitter = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

const Linkedin = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#020617] pt-16 pb-8 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold tracking-tight text-gradient">Dev-Sync</span>
          </Link>
          <p className="text-slate-400 text-sm max-w-sm">
            The collaborative living diagram editor. Architect your systems visually and write code simultaneously. Built for modern engineering teams.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <a href="#" className="text-slate-400 hover:text-white transition"><Github size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition"><Twitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition"><Linkedin size={20} /></a>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-slate-200 mb-4">Product</h3>
          <ul className="space-y-3">
            <li><a href="#features" className="text-sm text-slate-400 hover:text-blue-400 transition">Features</a></li>
            <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition">Pricing</a></li>
            <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-slate-200 mb-4">Legal</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition">Privacy Policy</a></li>
            <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Dev-Sync. All rights reserved.
        </p>
        <p className="text-sm text-slate-500 mt-2 md:mt-0">
          Built By <span className="font-medium text-slate-300">Siyam</span>
        </p>
      </div>
    </footer>
  );
}
