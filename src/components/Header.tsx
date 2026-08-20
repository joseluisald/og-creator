import React from 'react';
import { Download, Sparkles, Copy, Check, Eye, LogOut, User, Code2 } from 'lucide-react';

interface HeaderProps {
  onDownload: () => void;
  onCopyClipboard: () => void;
  copied: boolean;
  onOpenTemplates?: () => void;
  onToggleSocialPreview: () => void;
  isSocialPreviewOpen: boolean;
  onOpenMetaTags?: () => void;
  userEmail?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onDownload,
  onCopyClipboard,
  copied,
  onOpenTemplates,
  onToggleSocialPreview,
  isSocialPreviewOpen,
  onOpenMetaTags,
  userEmail,
  onLogout,
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
        {userEmail && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16181d] border border-[#ffffff10] text-[11px] text-[#a1a1aa]">
            <User className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-mono text-[#e5e5e5]">{userEmail}</span>
          </div>
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

        {onOpenMetaTags && (
          <button
            id="header-metatags-btn"
            type="button"
            onClick={onOpenMetaTags}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#f9e79f] border border-[#ffffff15] transition cursor-pointer"
            title="Gerar código de Meta Tags HTML para o cabeçalho do site"
          >
            <Code2 className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Tags HTML</span>
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
          id="header-copy-btn"
          type="button"
          onClick={onCopyClipboard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#e5e5e5] border border-[#ffffff15] transition cursor-pointer"
          title="Copiar imagem PNG para área de transferência"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[#f9e79f] font-bold">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#71717a]" />
              <span>Copiar PNG</span>
            </>
          )}
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

        {onLogout && (
          <button
            id="header-logout-btn"
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 p-2 rounded-full text-[#71717a] hover:text-red-400 hover:bg-[#1a1c20] border border-transparent hover:border-red-900/40 transition cursor-pointer"
            title="Sair do Studio"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
