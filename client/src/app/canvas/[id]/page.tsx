import DiagramCanvas from '../../../components/Canvas/DiagramCanvas';
import CanvasHeader from '../../../components/Canvas/CanvasHeader';

export default async function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="w-full h-screen bg-[#020617] flex flex-col font-sans overflow-hidden">
      <CanvasHeader canvasId={resolvedParams.id} />
      <main className="flex-1 relative border-t border-slate-800">
        <DiagramCanvas canvasId={resolvedParams.id} />
      </main>
    </div>
  );
}
