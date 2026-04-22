import Link from 'next/link';

export default function Home() {
  const generateCanvasId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const newCanvasId = generateCanvasId();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans p-6">
      <main className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dev-Sync</span>
        </h1>
        <p className="text-lg text-gray-600">
          The collaborative living diagram editor. Design architecture and write code simultaneously. 
        </p>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
          <p className="text-gray-700 font-medium text-lg">
            Ready to start syncing?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/canvas/${newCanvasId}`}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-xl shadow-lg font-semibold text-lg hover:-translate-y-1"
            >
              Start New Canvas
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            (Or paste a link shared by your teammate into your URL bar)
          </p>
        </div>
      </main>
    </div>
  );
}
