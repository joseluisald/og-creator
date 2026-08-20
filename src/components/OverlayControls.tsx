import React from 'react';
import { Type, Tag, Palette } from 'lucide-react';
import { TextOverlayConfig } from '../types';

interface OverlayControlsProps {
  config: TextOverlayConfig;
  onChange: (updated: Partial<TextOverlayConfig>) => void;
}

export const OverlayControls: React.FC<OverlayControlsProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#f9e79f] uppercase tracking-wider flex items-center gap-1.5 font-['Cormorant_Garamond',serif] text-sm">
          <Type className="w-3.5 h-3.5 text-[#d4af37]" />
          Textos e Tags Opcionais
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="rounded bg-[#1a1a1a] border-[#ffffff20] text-[#d4af37] focus:ring-[#d4af3720] accent-[#d4af37]"
          />
          <span className="text-xs text-[#e5e5e5] font-medium">Habilitar Textos</span>
        </label>
      </div>

      {config.enabled ? (
        <div className="space-y-3.5 pt-2 border-t border-[#ffffff10]">
          {/* Badge Tag */}
          <div className="space-y-2 p-3 bg-[#0f1115] rounded-lg border border-[#ffffff10]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#a1a1aa] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#d4af37]" />
                Badge Superior (Pill / Tag)
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={config.badgeBgColor}
                  onChange={(e) => onChange({ badgeBgColor: e.target.value })}
                  className="w-5 h-5 rounded border border-[#ffffff20] bg-transparent cursor-pointer"
                  title="Cor do Badge"
                />
              </div>
            </div>
            <input
              type="text"
              value={config.badgeText}
              onChange={(e) => onChange({ badgeText: e.target.value })}
              placeholder="Ex: NOVO LANÇAMENTO, ARTIGO, PRODUTO"
              className="w-full px-3 py-2 rounded-lg bg-[#1a1c20] border border-[#ffffff15] text-xs text-[#e5e5e5] placeholder-[#71717a] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2.5 p-3 bg-[#0f1115] rounded-lg border border-[#ffffff10]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#a1a1aa]">Título Principal</span>
              <div className="flex items-center gap-2">
                <Palette className="w-3 h-3 text-[#71717a]" />
                <input
                  type="color"
                  value={config.titleColor}
                  onChange={(e) => onChange({ titleColor: e.target.value })}
                  className="w-5 h-5 rounded border border-[#ffffff20] bg-transparent cursor-pointer"
                />
              </div>
            </div>
            <input
              type="text"
              value={config.titleText}
              onChange={(e) => onChange({ titleText: e.target.value })}
              placeholder="Ex: Título da sua página ou post"
              className="w-full px-3 py-2 rounded-lg bg-[#1a1c20] border border-[#ffffff15] text-xs text-[#e5e5e5] placeholder-[#71717a] focus:outline-none focus:border-[#d4af37]"
            />

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs text-[#71717a]">
                <span>Tamanho da Fonte</span>
                <span className="font-mono text-[#d4af37]">{config.titleFontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="64"
                step="2"
                value={config.titleFontSize}
                onChange={(e) => onChange({ titleFontSize: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>

            <div className="pt-2">
              <span className="text-xs text-[#71717a] block mb-1">Subtítulo / Descrição Curta</span>
              <input
                type="text"
                value={config.subtitleText}
                onChange={(e) => onChange({ subtitleText: e.target.value })}
                placeholder="Ex: Descrição ou slogan complementar"
                className="w-full px-3 py-2 rounded-lg bg-[#1a1c20] border border-[#ffffff15] text-xs text-[#e5e5e5] placeholder-[#71717a] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-[#71717a] italic">
          Ative para adicionar badges, títulos ou legendas personalizadas diretamente na imagem OG.
        </p>
      )}
    </div>
  );
};
