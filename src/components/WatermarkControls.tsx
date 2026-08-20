import React, { useRef } from 'react';
import {
  Upload,
  Sparkles,
  RotateCcw,
  Sliders,
  ShieldCheck,
  LayoutGrid,
  Palette,
  Eye,
  Layers,
  Trash2,
} from 'lucide-react';
import { WatermarkConfig, WatermarkPosition } from '../types';
import { PRESET_WATERMARKS, INITIAL_WATERMARK_CONFIG } from '../data/presets';

interface WatermarkControlsProps {
  config: WatermarkConfig;
  onChange: (updates: Partial<WatermarkConfig>) => void;
  onFileUpload: (file: File) => void;
}

const POSITIONS: { id: WatermarkPosition; label: string; gridArea: string }[] = [
  { id: 'top-left', label: 'Superior Esquerdo', gridArea: 'col-start-1 row-start-1' },
  { id: 'top-center', label: 'Superior Centro', gridArea: 'col-start-2 row-start-1' },
  { id: 'top-right', label: 'Superior Direito', gridArea: 'col-start-3 row-start-1' },
  { id: 'bottom-left', label: 'Inferior Esquerdo', gridArea: 'col-start-1 row-start-3' },
  { id: 'bottom-center', label: 'Inferior Centro', gridArea: 'col-start-2 row-start-3' },
  { id: 'bottom-right', label: 'Inferior Direito', gridArea: 'col-start-3 row-start-3' },
  { id: 'center', label: 'Centro da Imagem', gridArea: 'col-start-2 row-start-2' },
];

export const WatermarkControls: React.FC<WatermarkControlsProps> = ({
  config,
  onChange,
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#16181d] border border-[#ffffff10]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#e5e5e5]">Marca d'Água / Selo</h4>
            <p className="text-[11px] text-[#71717a]">
              Logo ou selo fixo nos cantos da arte
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange({ enabled: !config.enabled })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            config.enabled ? 'bg-[#d4af37]' : 'bg-[#27272a]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
              config.enabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-[#71717a]'
            }`}
          />
        </button>
      </div>

      {config.enabled && (
        <>
          {/* Logo Upload Dropzone */}
          <div>
            <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                Arquivo do Logo / Selo
              </span>
              {config.imageUrl && (
                <button
                  type="button"
                  onClick={() => onChange({ imageUrl: null, imageFileName: undefined })}
                  className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Remover
                </button>
              )}
            </label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#ffffff15] hover:border-[#d4af37]/50 rounded-2xl p-4 text-center cursor-pointer transition bg-[#16181d]/50 hover:bg-[#16181d] group relative"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onFileUpload(e.target.files[0]);
                  }
                }}
              />

              {config.imageUrl ? (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#0a0a0a] border border-[#ffffff15] p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={config.imageUrl}
                      alt="Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-semibold text-[#e5e5e5] truncate">
                      {config.imageFileName || 'Logo Carregado'}
                    </p>
                    <p className="text-[10px] text-[#71717a] mt-0.5">
                      Clique para trocar arquivo (PNG/SVG recomendado)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <Upload className="w-6 h-6 text-[#71717a] group-hover:text-[#d4af37] mx-auto mb-1.5 transition" />
                  <p className="text-xs font-medium text-[#e5e5e5]">
                    Arraste ou clique para enviar seu Logo
                  </p>
                  <p className="text-[10px] text-[#71717a] mt-0.5">
                    Suporta PNG transparente, SVG, WebP ou JPG
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Presets for Demo / Testing */}
          <div>
            <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Modelos de Selo / Logo de Exemplo:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_WATERMARKS.map((preset) => {
                const isSelected = config.imageUrl === preset.previewUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        imageUrl: preset.previewUrl,
                        imageFileName: `${preset.id}.svg`,
                      })
                    }
                    className={`p-2 rounded-xl border text-left transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#d4af37] bg-[#d4af37]/10 ring-1 ring-[#d4af37]'
                        : 'border-[#ffffff10] bg-[#16181d] hover:border-[#ffffff25]'
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                      <img
                        src={preset.previewUrl}
                        alt={preset.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-[#a1a1aa] text-center font-medium truncate w-full">
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anchor Position 3x3 Grid */}
          <div className="pt-2 border-t border-[#ffffff10]">
            <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-[#d4af37]" />
              Posição na Imagem (1200×630)
            </label>

            <div className="grid grid-cols-3 grid-rows-3 gap-1.5 p-2 rounded-2xl bg-[#0f1115] border border-[#ffffff10] aspect-[16/9] max-w-[260px] mx-auto">
              {POSITIONS.map((pos) => {
                const isSelected = config.position === pos.id;
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => onChange({ position: pos.id })}
                    title={pos.label}
                    className={`rounded-lg border text-[9px] font-medium flex items-center justify-center transition cursor-pointer ${pos.gridArea} ${
                      isSelected
                        ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-md shadow-[#d4af3730]'
                        : 'bg-[#1a1c20] text-[#71717a] border-[#ffffff08] hover:text-[#e5e5e5] hover:bg-[#27272a]'
                    }`}
                  >
                    {pos.id === 'top-left' && '↖ Topo E.'}
                    {pos.id === 'top-center' && '↑ Topo'}
                    {pos.id === 'top-right' && '↗ Topo D.'}
                    {pos.id === 'center' && '• Centro'}
                    {pos.id === 'bottom-left' && '↙ Baixo E.'}
                    {pos.id === 'bottom-center' && '↓ Baixo'}
                    {pos.id === 'bottom-right' && '↘ Baixo D.'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders: Scale, Opacity, Margin, Rotation */}
          <div className="pt-2 border-t border-[#ffffff10] space-y-4">
            <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
              Ajustes Finos do Selo
            </label>

            {/* Scale */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#a1a1aa]">Tamanho do Logo:</span>
                <span className="font-mono text-[#d4af37]">{config.scalePercent}%</span>
              </div>
              <input
                type="range"
                min="6"
                max="40"
                value={config.scalePercent}
                onChange={(e) => onChange({ scalePercent: Number(e.target.value) })}
                className="w-full accent-[#d4af37] bg-[#27272a] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#a1a1aa]">Opacidade:</span>
                <span className="font-mono text-[#d4af37]">{config.opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={config.opacity}
                onChange={(e) => onChange({ opacity: Number(e.target.value) })}
                className="w-full accent-[#d4af37] bg-[#27272a] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Margins */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#a1a1aa]">Distância da Borda (Margem):</span>
                <span className="font-mono text-[#d4af37]">{config.margin}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={config.margin}
                onChange={(e) => onChange({ margin: Number(e.target.value) })}
                className="w-full accent-[#d4af37] bg-[#27272a] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Rotation */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#a1a1aa]">Inclinação / Rotação:</span>
                <span className="font-mono text-[#d4af37]">{config.rotation}°</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                value={config.rotation}
                onChange={(e) => onChange({ rotation: Number(e.target.value) })}
                className="w-full accent-[#d4af37] bg-[#27272a] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Color Filter Modes */}
          <div className="pt-2 border-t border-[#ffffff10]">
            <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
              Filtro de Cor do Selo
            </label>

            <div className="grid grid-cols-4 gap-1.5">
              {(
                [
                  { id: 'original', label: 'Original' },
                  { id: 'white', label: 'Branco' },
                  { id: 'black', label: 'Preto' },
                  { id: 'grayscale', label: 'Cinza' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onChange({ filterMode: mode.id })}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    config.filterMode === mode.id
                      ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f9e79f]'
                      : 'border-[#ffffff10] bg-[#16181d] text-[#71717a] hover:text-[#e5e5e5]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Badge Style */}
          <div className="pt-2 border-t border-[#ffffff10]">
            <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
              Moldura / Fundo do Selo
            </label>

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'none', label: 'Sem Fundo (Transparente)' },
                  { id: 'dark-pill', label: 'Pílula Escura Fosca' },
                  { id: 'glass', label: 'Pílula Glass Translúcida' },
                  { id: 'light-pill', label: 'Pílula Branca / Clara' },
                ] as const
              ).map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onChange({ backgroundStyle: style.id })}
                  className={`py-2.5 px-3 rounded-xl text-[11px] font-medium border text-left transition cursor-pointer ${
                    config.backgroundStyle === style.id
                      ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#f9e79f]'
                      : 'border-[#ffffff10] bg-[#16181d] text-[#71717a] hover:text-[#e5e5e5]'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Watermark Button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={() => onChange(INITIAL_WATERMARK_CONFIG)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#ffffff10] hover:border-[#ffffff20] bg-[#16181d] hover:bg-[#1a1c20] text-xs font-semibold text-[#a1a1aa] hover:text-[#e5e5e5] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Selo Padrão</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
