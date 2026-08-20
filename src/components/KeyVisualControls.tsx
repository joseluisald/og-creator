import React, { useRef } from 'react';
import { Upload, Sparkles, RefreshCw, Sliders, SunMedium, Move, Shield, CircleDot, Square } from 'lucide-react';
import { KvConfig, AlignmentMode } from '../types';
import { PRESET_KVS } from '../data/presets';

interface KeyVisualControlsProps {
  config: KvConfig;
  onChange: (updated: Partial<KvConfig>) => void;
  onReset: () => void;
}

export const KeyVisualControls: React.FC<KeyVisualControlsProps> = ({
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

  const alignments: { id: AlignmentMode; label: string }[] = [
    { id: 'center', label: 'Centro (Padrão)' },
    { id: 'center-top', label: 'Topo' },
    { id: 'center-bottom', label: 'Base' },
    { id: 'center-left', label: 'Esquerda' },
    { id: 'center-right', label: 'Direita' },
  ];

  return (
    <div className="space-y-4">
      {/* Upload & Dropzone */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#f9e79f] uppercase tracking-wider flex items-center gap-1.5 font-['Cormorant_Garamond',serif] text-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Key Visual (KV / Logo / Elemento Principal)
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
              Arraste ou clique para enviar seu Key Visual (KV)
            </p>
            <p className="text-[11px] text-[#71717a] mt-0.5">
              {config.imageFileName || 'PNG transparente, SVG ou JPG'}
            </p>
          </div>
        </div>
      </div>

      {/* Preset KVs Quick Pick */}
      <div>
        <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          Ou teste com um Key Visual de exemplo:
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_KVS.map((preset) => {
            const isSelected = config.imageUrl === preset.previewUrl;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onChange({
                    imageUrl: preset.previewUrl,
                    imageFileName: `${preset.id}.svg`,
                    scalePercent: preset.scalePercent,
                    shadowBlur: preset.shadowBlur,
                    shadowOffsetY: preset.shadowOffsetY,
                    shadowOpacity: preset.shadowOpacity,
                    shadowColor: preset.shadowColor,
                  })
                }
                className={`relative aspect-square rounded-lg p-2 border flex flex-col items-center justify-center bg-[#13151a] transition cursor-pointer group ${
                  isSelected
                    ? 'border-[#d4af37] ring-2 ring-[#d4af3750] shadow-md shadow-[#d4af3720]'
                    : 'border-[#ffffff10] hover:border-[#ffffff25] opacity-80 hover:opacity-100'
                }`}
                title={preset.name}
              >
                <img
                  src={preset.previewUrl}
                  alt={preset.name}
                  className="w-12 h-12 object-contain group-hover:scale-105 transition"
                />
                <span className="text-[9px] text-[#a1a1aa] mt-1 truncate w-full text-center">
                  {preset.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizing & Auto-adjust Scale */}
      <div className="pt-2 border-t border-[#ffffff10] space-y-3">
        <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
          Dimensionamento Automático e Posição
        </label>

        {/* Scale slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#a1a1aa]">
            <span>Tamanho do KV (% do Canvas)</span>
            <span className="font-mono text-[#f9e79f] font-semibold">{config.scalePercent}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="95"
            step="1"
            value={config.scalePercent}
            onChange={(e) => onChange({ scalePercent: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />
        </div>

        {/* Alignment */}
        <div className="space-y-1.5">
          <span className="text-xs text-[#71717a]">Alinhamento Base</span>
          <div className="grid grid-cols-3 gap-1.5">
            {alignments.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onChange({ alignment: a.id, offsetX: 0, offsetY: 0 })}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  config.alignment === a.id
                    ? 'bg-[#d4af3715] border-[#d4af3780] text-[#f9e79f] shadow-sm shadow-[#d4af3720]'
                    : 'bg-[#13151a] border-[#ffffff10] text-[#71717a] hover:text-[#e5e5e5]'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fine-tuning Offsets */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#a1a1aa]">
              <span className="flex items-center gap-1">
                <Move className="w-3 h-3 text-[#71717a]" /> Deslocar X
              </span>
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
              <span className="flex items-center gap-1">
                <Move className="w-3 h-3 text-[#71717a]" /> Deslocar Y
              </span>
              <span className="font-mono text-[#d4af37]">{config.offsetY}px</span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="5"
              value={config.offsetY}
              onChange={(e) => onChange({ offsetY: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
            />
          </div>
        </div>
      </div>

      {/* Shadow & Glow Effects */}
      <div className="pt-2 border-t border-[#ffffff10] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
            <SunMedium className="w-3.5 h-3.5 text-[#d4af37]" />
            Sombra e Destaque 3D
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.shadowEnabled}
              onChange={(e) => onChange({ shadowEnabled: e.target.checked })}
              className="rounded bg-[#1a1a1a] border-[#ffffff20] text-[#d4af37] focus:ring-[#d4af3720] accent-[#d4af37]"
            />
            <span className="text-xs text-[#e5e5e5]">Ativar Sombra</span>
          </label>
        </div>

        {config.shadowEnabled && (
          <div className="space-y-2.5 p-3 rounded-lg bg-[#0f1115] border border-[#ffffff10]">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#a1a1aa]">
                <span>Intensidade / Desfoque da Sombra</span>
                <span className="font-mono text-[#d4af37]">{config.shadowBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                step="2"
                value={config.shadowBlur}
                onChange={(e) => onChange({ shadowBlur: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#a1a1aa]">
                <span>Elevação / Distância Y</span>
                <span className="font-mono text-[#d4af37]">{config.shadowOffsetY}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={config.shadowOffsetY}
                onChange={(e) => onChange({ shadowOffsetY: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#a1a1aa]">Opacidade</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={config.shadowOpacity}
                  onChange={(e) => onChange({ shadowOpacity: parseInt(e.target.value, 10) })}
                  className="w-28 h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                />
                <span className="font-mono text-xs text-[#d4af37] w-8 text-right">
                  {config.shadowOpacity}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Glow Option */}
        <div className="pt-2 border-t border-[#ffffff10]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a1a1aa] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Efeito Neon Aura / Glow
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.glowEnabled}
                onChange={(e) => onChange({ glowEnabled: e.target.checked })}
                className="rounded bg-[#1a1a1a] border-[#ffffff20] text-[#d4af37] focus:ring-[#d4af3720] accent-[#d4af37]"
              />
              <span className="text-xs text-[#71717a]">Glow</span>
            </label>
          </div>

          {config.glowEnabled && (
            <div className="flex items-center gap-3 p-2.5 bg-[#0f1115] rounded-lg border border-[#ffffff10]">
              <input
                type="color"
                value={config.glowColor}
                onChange={(e) => onChange({ glowColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-[#ffffff20] bg-transparent cursor-pointer p-0.5"
                title="Cor do Glow Neon"
              />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs text-[#71717a]">
                  <span>Raio do Glow</span>
                  <span className="font-mono text-[#d4af37]">{config.glowBlur}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="2"
                  value={config.glowBlur}
                  onChange={(e) => onChange({ glowBlur: parseInt(e.target.value, 10) })}
                  className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Shape / Border Radius / Circle */}
        <div className="pt-2 border-t border-[#ffffff10] space-y-2">
          <span className="text-xs text-[#a1a1aa] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
            Forma e Cantos
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ isCircle: false, borderRadius: 0 })}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                !config.isCircle && config.borderRadius === 0
                  ? 'bg-[#d4af3715] border-[#d4af37] text-[#f9e79f]'
                  : 'bg-[#13151a] border-[#ffffff10] text-[#71717a] hover:text-[#e5e5e5]'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              Original
            </button>
            <button
              type="button"
              onClick={() => onChange({ isCircle: false, borderRadius: 24 })}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                !config.isCircle && config.borderRadius > 0
                  ? 'bg-[#d4af3715] border-[#d4af37] text-[#f9e79f]'
                  : 'bg-[#13151a] border-[#ffffff10] text-[#71717a] hover:text-[#e5e5e5]'
              }`}
            >
              Arredondado
            </button>
            <button
              type="button"
              onClick={() => onChange({ isCircle: true })}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                config.isCircle
                  ? 'bg-[#d4af3715] border-[#d4af37] text-[#f9e79f]'
                  : 'bg-[#13151a] border-[#ffffff10] text-[#71717a] hover:text-[#e5e5e5]'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              Circular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
