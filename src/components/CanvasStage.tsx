import React, { useRef, useState } from 'react';
import { Download, Copy, Check, Grid, Maximize2, ZoomIn, ZoomOut, Sparkles, FileImage } from 'lucide-react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/canvasRenderer';

interface CanvasStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onDownload: (format: 'png' | 'jpeg' | 'webp') => void;
  onCopyClipboard: () => void;
  copied: boolean;
  showGuides: boolean;
  onToggleGuides: () => void;
  isRendering?: boolean;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  canvasRef,
  onDownload,
  onCopyClipboard,
  copied,
  showGuides,
  onToggleGuides,
  isRendering,
}) => {
  const [zoom, setZoom] = useState<'fit' | '50' | '75' | '100'>('fit');
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-full bg-[#16181d]/90 rounded-2xl border border-[#ffffff10] overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#0f1115] border-b border-[#ffffff10] text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 font-mono text-[11px] bg-[#1a1c20] text-[#a1a1aa] px-3 py-1 rounded-full border border-[#ffffff10]">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
            {CANVAS_WIDTH} × {CANVAS_HEIGHT} px (1.91:1)
          </span>

          <button
            type="button"
            onClick={onToggleGuides}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition cursor-pointer border ${
              showGuides
                ? 'bg-[#d4af3720] text-[#f9e79f] border-[#d4af3760]'
                : 'bg-[#1a1c20] text-[#71717a] hover:text-[#e5e5e5] border-[#ffffff10]'
            }`}
            title="Mostrar linhas guias e zona segura"
          >
            <Grid className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Guias &amp; Centro</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-[#1a1c20] p-1 rounded-full border border-[#ffffff10]">
          <button
            type="button"
            onClick={() => setZoom('fit')}
            className={`px-3 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
              zoom === 'fit' ? 'bg-[#d4af37] text-black font-bold' : 'text-[#71717a] hover:text-[#e5e5e5]'
            }`}
          >
            Ajustar
          </button>
          <button
            type="button"
            onClick={() => setZoom('50')}
            className={`px-3 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
              zoom === '50' ? 'bg-[#d4af37] text-black font-bold' : 'text-[#71717a] hover:text-[#e5e5e5]'
            }`}
          >
            50%
          </button>
          <button
            type="button"
            onClick={() => setZoom('75')}
            className={`px-3 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
              zoom === '75' ? 'bg-[#d4af37] text-black font-bold' : 'text-[#71717a] hover:text-[#e5e5e5]'
            }`}
          >
            75%
          </button>
          <button
            type="button"
            onClick={() => setZoom('100')}
            className={`px-3 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
              zoom === '100' ? 'bg-[#d4af37] text-black font-bold' : 'text-[#71717a] hover:text-[#e5e5e5]'
            }`}
          >
            100%
          </button>
        </div>
      </div>

      {/* Canvas Viewport Area */}
      <div
        ref={containerRef}
        className="flex-1 min-h-[380px] p-4 lg:p-8 flex items-center justify-center overflow-auto bg-[#0a0a0a] [background-image:radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] relative"
      >
        <div
          className={`relative transition-all duration-200 shadow-2xl rounded-lg overflow-hidden ring-1 ring-[#ffffff15] ${
            zoom === 'fit'
              ? 'w-full max-w-[850px] aspect-[1200/630]'
              : zoom === '50'
              ? 'w-[600px] h-[315px]'
              : zoom === '75'
              ? 'w-[900px] h-[472px]'
              : 'w-[1200px] h-[630px]'
          }`}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full object-contain block bg-[#0a0a0a]"
          />

          {isRendering && (
            <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0f1115] border border-[#d4af3740] text-xs text-[#f9e79f] font-medium shadow-xl">
                <Sparkles className="w-4 h-4 animate-spin text-[#d4af37]" />
                Renderizando em 1200x630...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Export Bar */}
      <div className="px-5 py-3.5 bg-[#0f1115] border-t border-[#ffffff10] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-[#a1a1aa]">
          <FileImage className="w-4 h-4 text-[#d4af37]" />
          <span>Formato de Exportação:</span>
          <div className="inline-flex rounded-full bg-[#1a1c20] p-1 border border-[#ffffff10]">
            {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setExportFormat(fmt)}
                className={`px-3 py-0.5 text-xs rounded-full uppercase font-semibold transition cursor-pointer ${
                  exportFormat === fmt
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'text-[#71717a] hover:text-[#e5e5e5]'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCopyClipboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#e5e5e5] border border-[#ffffff15] transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-[#f9e79f] font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#71717a]" />
                <span>Copiar Imagem</span>
              </>
            )}
          </button>

          <button
            id="canvas-download-btn"
            type="button"
            onClick={() => onDownload(exportFormat)}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold bg-[#d4af37] hover:bg-[#c19a2e] text-black shadow-lg shadow-[#d4af3720] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download {exportFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
