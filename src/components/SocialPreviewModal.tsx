import React, { useState } from 'react';
import { X, Globe, MessageSquare, Share2, ExternalLink } from 'lucide-react';

interface SocialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasDataUrl: string;
  title: string;
  subtitle: string;
}

export const SocialPreviewModal: React.FC<SocialPreviewModalProps> = ({
  isOpen,
  onClose,
  canvasDataUrl,
  title,
  subtitle,
}) => {
  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin' | 'facebook' | 'discord'>('twitter');

  if (!isOpen) return null;

  const displayTitle = title.trim() || 'Seu Site Incrível ou Lançamento';
  const displaySubtitle = subtitle.trim() || 'A melhor ferramenta para a web moderna. Explore agora!';
  const domain = 'seusite.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0f1115] border border-[#ffffff15] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffffff10] bg-[#0f1115]">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-[#d4af37]" />
            <h3 className="font-semibold text-base text-[#f9e79f] font-['Cormorant_Garamond',serif] tracking-wide">
              Simulador de Compartilhamento Social (OG Preview)
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

        {/* Network Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#ffffff10] bg-[#0a0a0a]">
          {[
            { id: 'twitter', label: 'Twitter / X Card' },
            { id: 'linkedin', label: 'LinkedIn Post' },
            { id: 'facebook', label: 'Facebook Feed' },
            { id: 'discord', label: 'Discord / Slack' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                  : 'border-transparent text-[#71717a] hover:text-[#e5e5e5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Preview Content Area */}
        <div className="p-6 overflow-y-auto bg-[#0a0a0a] flex items-center justify-center min-h-[360px]">
          {/* TWITTER / X */}
          {activeTab === 'twitter' && (
            <div className="w-full max-w-lg bg-black border border-[#ffffff15] rounded-2xl overflow-hidden shadow-lg p-4 font-sans text-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f9e79f] flex items-center justify-center text-black font-bold text-sm">
                  U
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <span>Você</span>
                    <span className="text-[#71717a] font-normal">@voce · 2m</span>
                  </div>
                  <p className="text-xs text-[#a1a1aa]">Confira a novidade incrível que acabamos de lançar! ✨</p>
                </div>
              </div>

              {/* Twitter Card */}
              <div className="border border-[#ffffff15] rounded-2xl overflow-hidden hover:bg-[#16181d] transition">
                <img
                  src={canvasDataUrl}
                  alt="OG Preview"
                  className="w-full aspect-[1200/630] object-cover block"
                />
                <div className="p-3.5 bg-[#0f1115]">
                  <div className="text-[11px] text-[#71717a] flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#d4af37]" />
                    <span>{domain}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#e5e5e5] mt-1 line-clamp-1">{displayTitle}</h4>
                  <p className="text-[11px] text-[#71717a] line-clamp-1 mt-0.5">{displaySubtitle}</p>
                </div>
              </div>
            </div>
          )}

          {/* LINKEDIN */}
          {activeTab === 'linkedin' && (
            <div className="w-full max-w-lg bg-[#0f1115] border border-[#ffffff15] rounded-xl overflow-hidden shadow-lg p-4 font-sans">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white font-bold text-sm">
                  L
                </div>
                <div>
                  <div className="font-bold text-xs text-[#e5e5e5]">Sua Empresa / Perfil</div>
                  <div className="text-[10px] text-[#71717a]">12.450 seguidores · 1h</div>
                </div>
              </div>
              <p className="text-xs text-[#a1a1aa] mb-3">
                Estamos muito felizes em compartilhar nosso mais recente projeto.
              </p>
              <div className="border border-[#ffffff15] rounded-lg overflow-hidden bg-[#0a0a0a]">
                <img
                  src={canvasDataUrl}
                  alt="OG Preview"
                  className="w-full aspect-[1200/630] object-cover block"
                />
                <div className="p-3.5 bg-[#16181d] border-t border-[#ffffff10] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#e5e5e5] line-clamp-1">{displayTitle}</h4>
                    <div className="text-[10px] text-[#71717a]">{domain}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#d4af37]" />
                </div>
              </div>
            </div>
          )}

          {/* FACEBOOK */}
          {activeTab === 'facebook' && (
            <div className="w-full max-w-lg bg-[#0f1115] border border-[#ffffff15] rounded-xl overflow-hidden shadow-lg font-sans">
              <div className="p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold text-xs">
                  F
                </div>
                <div>
                  <div className="font-bold text-xs text-[#e5e5e5]">Sua Página</div>
                  <div className="text-[10px] text-[#71717a]">Patrocinado · Público</div>
                </div>
              </div>
              <img
                src={canvasDataUrl}
                alt="OG Preview"
                className="w-full aspect-[1200/630] object-cover block"
              />
              <div className="p-3.5 bg-[#16181d] border-t border-[#ffffff10]">
                <div className="text-[10px] text-[#71717a] uppercase tracking-wider">{domain}</div>
                <h4 className="font-bold text-xs text-[#e5e5e5] mt-0.5 line-clamp-1">{displayTitle}</h4>
                <p className="text-[11px] text-[#71717a] line-clamp-1">{displaySubtitle}</p>
              </div>
            </div>
          )}

          {/* DISCORD */}
          {activeTab === 'discord' && (
            <div className="w-full max-w-lg bg-[#2b2d31] rounded-lg p-4 font-sans text-[#dbdee1] border border-[#ffffff10]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold text-xs">
                  D
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">Bot / Membro</span>
                    <span className="text-[10px] text-[#949ba4]">Hoje às 12:30</span>
                  </div>
                  <p className="text-xs text-[#00a8fc] hover:underline cursor-pointer mb-2">
                    https://{domain}/launch
                  </p>

                  {/* Discord Embed */}
                  <div className="border-l-4 border-[#d4af37] bg-[#1e1f22] rounded-r p-3 max-w-md">
                    <div className="text-[11px] text-[#949ba4] font-medium">{domain}</div>
                    <div className="font-bold text-xs text-[#f9e79f] mt-0.5 hover:underline cursor-pointer">
                      {displayTitle}
                    </div>
                    <p className="text-[11px] text-[#dbdee1] mt-1">{displaySubtitle}</p>
                    <div className="mt-2.5 rounded overflow-hidden">
                      <img
                        src={canvasDataUrl}
                        alt="OG Preview"
                        className="w-full aspect-[1200/630] object-cover block"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-[#0f1115] border-t border-[#ffffff10] flex items-center justify-between text-xs text-[#71717a]">
          <span>Resolução exata de 1200 × 630 px otimizada para todas as redes sociais.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1a1c20] hover:bg-[#27272a] text-[#e5e5e5] rounded-full border border-[#ffffff15] transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
