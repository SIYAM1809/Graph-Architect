import DiagramCanvas from '../../../components/Canvas/DiagramCanvas';
import CanvasHeader from '../../../components/Canvas/CanvasHeader';

export default async function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col font-sans">
      <CanvasHeader canvasId={resolvedParams.id} />
      <main className="flex-1 relative border-t border-gray-200">
        <DiagramCanvas canvasId={resolvedParams.id} />
      </main>
    </div>
  );
}
