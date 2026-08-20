import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, RefreshCw, Sliders, Palette, Layers, Sparkles } from 'lucide-react';
import { BgConfig, BgFitMode } from '../types';
import { PRESET_BACKGROUNDS } from '../data/presets';

interface BackgroundControlsProps {
  config: BgConfig;
  onChange: (updated: Partial<BgConfig>) => void;
  onReset: () => void;
}

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  config,
  onChange,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange({
          imageUrl: e.target.result as string,
          imageFileName: file.name,
          sourceType: 'image',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const fitModes: { id: BgFitMode; label: string; desc: string }[] = [
    { id: 'cover', label: 'Cover (Preencher)', desc: 'Auto-ajusta cobrindo todo o 1200x630' },
    { id: 'contain', label: 'Contain (Conter)', desc: 'Mantém proporção sem cortar' },
    { id: 'blur-fill', label: 'Blur Backdrop', desc: 'Fundo borrado com imagem nítida' },
    { id: 'stretch', label: 'Esticar', desc: 'Preenche ignorando aspecto' },
  ];

  return (
    <div className="space-y-4">
      {/* Upload & Dropzone */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#f9e79f] uppercase tracking-wider flex items-center gap-1.5 font-['Cormorant_Garamond',serif] text-sm">
            <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
            Imagem de Background (BG)
          </label>
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] text-[#71717a] hover:text-[#d4af37] flex items-center gap-1 transition cursor-pointer"
            title="Restaurar padrão"
          >
            <RefreshCw className="w-3 h-3" />
            Resetar
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
          }}
        />

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="group relative border border-dashed border-[#ffffff20] hover:border-[#d4af37]/80 bg-[#0f1115]/80 hover:bg-[#16181d] rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-[#d4af3715] group-hover:bg-[#d4af3725] text-[#d4af37] flex items-center justify-center transition border border-[#d4af3730]">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#e5e5e5] group-hover:text-[#f9e79f] transition">
              Arraste ou clique para enviar seu BG
            </p>
            <p className="text-[11px] text-[#71717a] mt-0.5">
              {config.imageFileName || 'PNG, JPG, WEBP ou SVG (qualquer resolução)'}
            </p>
          </div>
        </div>
      </div>

      {/* Preset Backgrounds Quick Pick */}
      <div>
        <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          Ou escolha um Background pronto:
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {PRESET_BACKGROUNDS.map((preset) => {
            const isSelected = config.imageUrl === preset.previewUrl;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onChange({
                    imageUrl: preset.previewUrl,
                    imageFileName: `${preset.id}.svg`,
                    ...preset.config,
                  })
                }
                className={`relative aspect-[16/9] rounded-lg overflow-hidden border transition text-left cursor-pointer group ${
                  isSelected
                    ? 'border-[#d4af37] ring-2 ring-[#d4af3750] shadow-md shadow-[#d4af3720]'
                    : 'border-[#ffffff10] hover:border-[#ffffff30] opacity-75 hover:opacity-100'
                }`}
                title={preset.name}
              >
                <img
                  src={preset.previewUrl}
                  alt={preset.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-[#0a0a0a]/90 text-[9px] text-[#a1a1aa] px-1 py-0.5 truncate text-center block">
                  {preset.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fit Mode Selection */}
      <div className="pt-2 border-t border-[#ffffff10]">
        <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
          Modo de Auto-Ajuste do BG
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {fitModes.map((mode) => {
            const isSelected = config.fitMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onChange({ fitMode: mode.id })}
                className={`p-2.5 rounded-lg text-left border transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#d4af3715] border-[#d4af3780] text-[#f9e79f] shadow-sm shadow-[#d4af3720]'
                    : 'bg-[#13151a] border-[#ffffff10] text-[#71717a] hover:text-[#e5e5e5] hover:border-[#ffffff25]'
                }`}
              >
                <div className="text-xs font-semibold text-[#e5e5e5]">{mode.label}</div>
                <div className="text-[10px] text-[#71717a] mt-0.5 leading-tight">{mode.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Adjustments: Scale, Offset, Blur, Overlay */}
      <div className="pt-2 border-t border-[#ffffff10] space-y-3">
        <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
          Ajustes de Posição e Efeitos
        </label>

        {/* Scale */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#a1a1aa]">
            <span>Zoom / Escala</span>
            <span className="font-mono text-[#d4af37]">{Math.round(config.scale * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={config.scale}
            onChange={(e) => onChange({ scale: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />
        </div>

        {/* Blur */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#a1a1aa]">
            <span>Desfoque (Blur)</span>
            <span className="font-mono text-[#d4af37]">{config.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={config.blur}
            onChange={(e) => onChange({ blur: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />
        </div>

        {/* Position Offsets X and Y */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#a1a1aa]">
              <span>Posição X</span>
              <span className="font-mono text-[#d4af37]">{config.offsetX}px</span>
            </div>
            <input
              type="range"
              min="-300"
              max="300"
              step="5"
              value={config.offsetX}
              onChange={(e) => onChange({ offsetX: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#a1a1aa]">
              <span>Posição Y</span>
              <span className="font-mono text-[#d4af37]">{config.offsetY}px</span>
            </div>
            <input
              type="range"
              min="-300"
              max="300"
              step="5"
              value={config.offsetY}
              onChange={(e) => onChange({ offsetY: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
            />
          </div>
        </div>

        {/* Tint / Dark Overlay */}
        <div className="pt-2 border-t border-[#ffffff10] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a1a1aa] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
              Camada de Escurecimento / Tint
            </span>
            <span className="font-mono text-xs text-[#d4af37]">{config.overlayOpacity}%</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.overlayColor}
              onChange={(e) => onChange({ overlayColor: e.target.value })}
              className="w-8 h-8 rounded-lg border border-[#ffffff20] bg-transparent cursor-pointer p-0.5"
              title="Cor da camada de sobreposição"
            />
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={config.overlayOpacity}
              onChange={(e) => onChange({ overlayOpacity: parseInt(e.target.value, 10) })}
              className="flex-1 h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
