import React from 'react';
import { Type, Tag, Palette, Sliders, RotateCcw } from 'lucide-react';
import { TextOverlayConfig } from '../types';
import { INITIAL_TEXT_OVERLAY } from '../data/presets';

interface OverlayControlsProps {
  config: TextOverlayConfig;
  onChange: (updated: Partial<TextOverlayConfig>) => void;
}

export const OverlayControls: React.FC<OverlayControlsProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#16181d] border border-[#ffffff10]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#e5e5e5]">Sobreposição de Textos</h4>
            <p className="text-[11px] text-[#71717a]">
              Título, subtítulo e badge/etiqueta na arte
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
        <div className="space-y-4 pt-2 border-t border-[#ffffff10]">
          {/* Badge Tag */}
          <div className="space-y-2.5 p-3.5 bg-[#16181d] rounded-2xl border border-[#ffffff10]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#d4af37]" />
                Badge / Etiqueta Superior
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#71717a]">Fundo:</span>
                <input
                  type="color"
                  value={config.badgeBgColor}
                  onChange={(e) => onChange({ badgeBgColor: e.target.value })}
                  className="w-5 h-5 rounded border border-[#ffffff20] bg-transparent cursor-pointer"
                  title="Cor do Fundo do Badge"
                />
                <span className="text-[10px] text-[#71717a]">Texto:</span>
                <input
                  type="color"
                  value={config.badgeTextColor}
                  onChange={(e) => onChange({ badgeTextColor: e.target.value })}
                  className="w-5 h-5 rounded border border-[#ffffff20] bg-transparent cursor-pointer"
                  title="Cor do Texto do Badge"
                />
              </div>
            </div>
            <input
              type="text"
              value={config.badgeText}
              onChange={(e) => onChange({ badgeText: e.target.value })}
              placeholder="Ex: NOVO LANÇAMENTO, ARTIGO, PRODUTO"
              className="w-full px-3 py-2 rounded-xl bg-[#0f1115] border border-[#ffffff15] text-xs text-[#e5e5e5] placeholder-[#71717a] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3 p-3.5 bg-[#16181d] rounded-2xl border border-[#ffffff10]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
                Título Principal
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#71717a]">Cor:</span>
                <input
                  type="color"
                  value={config.titleColor}
                  onChange={(e) => onChange({ titleColor: e.target.value })}
                  className="w-5 h-5 rounded border border-[#ffffff20] bg-transparent cursor-pointer"
                  title="Cor do Título"
                />
              </div>
            </div>
            <input
              type="text"
              value={config.titleText}
              onChange={(e) => onChange({ titleText: e.target.value })}
              placeholder="Ex: Título da sua página ou post"
              className="w-full px-3 py-2 rounded-xl bg-[#0f1115] border border-[#ffffff15] text-xs text-[#e5e5e5] placeholder-[#71717a] focus:outline-none focus:border-[#d4af37]"
            />

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-[#71717a]">
                <span>Tamanho da Fonte:</span>
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

            <div className="pt-2 border-t border-[#ffffff08]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  Subtítulo / Descrição Curta
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#71717a]">Cor:</span>
                  <input
                    type="color"
                    value={config.subtitleColor}
                    onChange={(e) => onChange({ subtitleColor: e.target.value })}
                    className="w-5 h-5 rounded border border-[#ffffff20] bg-transparent cursor-pointer"
                    title="Cor do Subtítulo"
                  />
                </div>
              </div>
              <input
                type="text"
                value={config.subtitleText}
                onChange={(e) => onChange({ subtitleText: e.target.value })}
                placeholder="Ex: Descrição ou slogan complementar"
                className="w-full px-3 py-2 rounded-xl bg-[#0f1115] border border-[#ffffff15] text-xs text-[#e5e5e5] placeholder-[#71717a] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onChange(INITIAL_TEXT_OVERLAY)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#ffffff10] hover:border-[#ffffff20] bg-[#16181d] hover:bg-[#1a1c20] text-xs font-semibold text-[#a1a1aa] hover:text-[#e5e5e5] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Textos Padrão</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
