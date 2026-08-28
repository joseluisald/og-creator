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
    <div className="border-b border-[#ffffff10] bg-[#0f1115]/95 backdrop-blur-md sticky top-0 z-30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#d4af3715] text-[#f9e79f] border border-[#d4af3730]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></span>
          OG Image Studio · 1200 × 630 px
        </span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Salvar Configuração como Padrão */}
        {onSaveConfig && (
          <button
            id="header-save-config-btn"
            type="button"
            onClick={onSaveConfig}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#f9e79f] border border-[#d4af37]/40 hover:border-[#d4af37] transition cursor-pointer shadow-sm shadow-[#d4af3715]"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#f9e79f] border border-[#ffffff15] transition cursor-pointer"
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
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold border transition cursor-pointer ${
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
          className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold bg-[#d4af37] hover:bg-[#c19a2e] text-black shadow-md shadow-[#d4af3720] transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar Imagem</span>
        </button>
      </div>
    </div>
  );
};

