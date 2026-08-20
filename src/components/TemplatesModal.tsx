import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { TEMPLATES } from '../data/presets';
import { BgConfig, KvConfig, PresetTemplate } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PresetTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0f1115] border border-[#ffffff15] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffffff10] bg-[#0f1115]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h3 className="font-semibold text-base text-[#f9e79f] font-['Cormorant_Garamond',serif] tracking-wide">
              Modelos Prontos de Open Graph
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#1a1c20] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-[#a1a1aa]">
            Selecione uma combinação pronta para carregar automaticamente o background, estilo de Key Visual e sombras ajustadas:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  onSelectTemplate(tmpl);
                  onClose();
                }}
                className="group p-3.5 rounded-xl border border-[#ffffff10] hover:border-[#d4af37]/70 bg-[#16181d]/80 hover:bg-[#1c1f26] transition text-left cursor-pointer flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div
                  className="w-full aspect-[1200/630] rounded-lg overflow-hidden relative flex items-center justify-center border border-[#ffffff10]"
                  style={{ background: tmpl.thumbnailBg }}
                >
                  {tmpl.kvConfig.imageUrl && (
                    <img
                      src={tmpl.kvConfig.imageUrl}
                      alt={tmpl.name}
                      className="w-16 h-16 object-contain drop-shadow-xl group-hover:scale-110 transition duration-200"
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#e5e5e5] group-hover:text-[#f9e79f] transition">
                      {tmpl.name}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-[#d4af37] bg-[#d4af3715] border border-[#d4af3730] px-2 py-0.5 rounded-full">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717a] mt-1 line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-3.5 bg-[#0f1115] border-t border-[#ffffff10] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs uppercase tracking-wider font-semibold text-[#e5e5e5] bg-[#1a1c20] hover:bg-[#27272a] rounded-full border border-[#ffffff15] transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
