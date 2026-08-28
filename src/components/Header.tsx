import React from 'react';
import { Download, Sparkles, Eye, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  onDownload: () => void;
  onSaveConfig?: () => void;
  onResetAll?: () => void;
  onOpenTemplates?: () => void;
  onToggleSocialPreview: () => void;
  isSocialPreviewOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onDownload,
  onSaveConfig,
  onOpenTemplates,
  onToggleSocialPreview,
  isSocialPreviewOpen,
}) => {
  return (
    <header className="border-b border-[#ffffff10] bg-[#0f1115]/95 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#d4af37] to-[#f9e79f] flex items-center justify-center shadow-lg shadow-[#d4af3720] ring-1 ring-[#f9e79f]/30">
          <Sparkles className="w-5 h-5 text-black" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-semibold text-lg text-[#f9e79f] font-['Cormorant_Garamond',serif] italic tracking-wide">
              OG Gen Studio
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#d4af3715] text-[#d4af37] border border-[#d4af3730]">
              1200 × 630
            </span>
          </div>
          <p className="text-[11px] text-[#71717a] tracking-wide">
            Auto-ajuste de Background &amp; Key Visual centralizado em alta definição
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Salvar Configuração como Padrão */}
        {onSaveConfig && (
          <button
            id="header-save-config-btn"
            type="button"
            onClick={onSaveConfig}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#f9e79f] border border-[#d4af37]/40 hover:border-[#d4af37] transition cursor-pointer shadow-sm shadow-[#d4af3715]"
            title="Salvar configuração atual para carregar automaticamente"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Salvar Padrão</span>
          </button>
        )}

        {onOpenTemplates && (
          <button
            id="header-templates-btn"
            type="button"
            onClick={onOpenTemplates}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#f9e79f] border border-[#ffffff15] transition cursor-pointer"
            title="Escolher um modelo pronto"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Modelos</span>
          </button>
        )}

        <button
          id="header-preview-btn"
          type="button"
          onClick={onToggleSocialPreview}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border transition cursor-pointer ${
            isSocialPreviewOpen
              ? 'bg-[#d4af3720] text-[#f9e79f] border-[#d4af3750] shadow-sm shadow-[#d4af3720]'
              : 'bg-[#1a1c20] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#e5e5e5] border-[#ffffff15]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Simulador Social</span>
        </button>

        <button
          id="header-download-btn"
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold bg-[#d4af37] hover:bg-[#c19a2e] text-black shadow-md shadow-[#d4af3720] transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Imagem</span>
        </button>
      </div>
    </header>
  );
};

