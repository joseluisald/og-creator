import React, { useState } from 'react';
import { Sparkles, ExternalLink, Info, X, Zap } from 'lucide-react';

interface AdBannerProps {
  format?: 'leaderboard' | 'sidebar' | 'native' | 'footer-banner' | 'in-feed';
  className?: string;
  slotId?: string;
}

const SPONSORS = [
  {
    title: 'Deploy em Segundos na Nuvem',
    description: 'Hospede suas aplicações full-stack, bancos Postgres e APIs sem dor de cabeça com escala automática.',
    cta: 'Começar Grátis',
    url: 'https://vercel.com',
    sponsorName: 'Cloud Deploy Pro',
    tag: 'Infraestrutura',
    icon: '⚡',
    badgeColor: 'border-cyan-500/30 bg-cyan-950/30 text-cyan-300'
  },
  {
    title: 'Postgres & Autenticação para Devs',
    description: 'Bancos de dados relacionais em tempo real, Auth e Storage prontos para o seu próximo projeto.',
    cta: 'Criar Projeto Grátis',
    url: 'https://supabase.com',
    sponsorName: 'Database Cloud',
    tag: 'Backend & SQL',
    icon: '🗄️',
    badgeColor: 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
  },
  {
    title: 'Monitoramento de Erros & Performance',
    description: 'Identifique bugs antes dos seus usuários. Rastreie exceptions em Next.js, Node, React e mobile.',
    cta: 'Testar sem Cartão',
    url: 'https://sentry.io',
    sponsorName: 'ErrorTracker AI',
    tag: 'Observabilidade',
    icon: '🛡️',
    badgeColor: 'border-purple-500/30 bg-purple-950/30 text-purple-300'
  },
  {
    title: 'Envio Transacional de E-mails para APIs',
    description: 'Entregabilidade de 99.9% com SDKs em TypeScript e templates limpos em React Email.',
    cta: '10k Envios Grátis',
    url: 'https://resend.com',
    sponsorName: 'Email Delivery',
    tag: 'Email API',
    icon: '✉️',
    badgeColor: 'border-amber-500/30 bg-amber-950/30 text-amber-300'
  }
];

export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'leaderboard',
  className = '',
  slotId = 'default-ad-slot'
}) => {
  const [closed, setClosed] = useState(false);
  // Pick sponsor deterministically based on slotId length or random
  const sponsorIndex = Math.abs(slotId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % SPONSORS.length;
  const currentSponsor = SPONSORS[sponsorIndex];

  if (closed) return null;

  if (format === 'leaderboard') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-3 px-3 sm:px-4 ${className}`}>
        <div className="relative bg-gradient-to-r from-[#14161d] via-[#1a1d24] to-[#14161d] border border-[#ffffff15] rounded-xl p-3 sm:py-2.5 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          {/* Ad Label & Sponsor Info */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-lg bg-[#0a0a0a] border border-[#ffffff15] flex items-center justify-center text-lg shrink-0">
              {currentSponsor.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#71717a] border border-white/5">
                  Publicidade
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentSponsor.badgeColor}`}>
                  {currentSponsor.tag}
                </span>
                <span className="text-[11px] font-bold text-white truncate">
                  {currentSponsor.sponsorName}
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa] mt-0.5 line-clamp-1">
                {currentSponsor.title} – {currentSponsor.description}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <a
              href={currentSponsor.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#f9e79f] text-black font-semibold text-xs transition cursor-pointer shadow-sm shadow-[#d4af3720]"
            >
              <span>{currentSponsor.cta}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={() => setClosed(true)}
              className="p-1 text-[#71717a] hover:text-white rounded transition cursor-pointer"
              title="Fechar anúncio"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (format === 'sidebar') {
    return (
      <div className={`bg-[#121418] border border-[#ffffff15] rounded-xl p-4 space-y-3 relative ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wider font-mono text-[#71717a]">
            Parceiro / Anúncio
          </span>
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${currentSponsor.badgeColor}`}>
            {currentSponsor.tag}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-[#ffffff15] flex items-center justify-center text-xl shrink-0">
            {currentSponsor.icon}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-snug">
              {currentSponsor.sponsorName}
            </h4>
            <p className="text-[11px] text-[#a1a1aa] font-medium mt-0.5">
              {currentSponsor.title}
            </p>
          </div>
        </div>

        <p className="text-xs text-[#8e8e93] leading-relaxed">
          {currentSponsor.description}
        </p>

        <a
          href={currentSponsor.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1c22] hover:bg-[#252830] text-[#f9e79f] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs font-semibold transition cursor-pointer"
        >
          <span>{currentSponsor.cta}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  if (format === 'footer-banner') {
    return (
      <div className={`w-full bg-[#0d0f12] border-t border-[#ffffff15] py-2.5 px-4 sticky bottom-0 z-30 shadow-2xl backdrop-blur-md bg-opacity-95 ${className}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-lg">{currentSponsor.icon}</span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#f9e79f] font-bold">
                Patrocinador
              </span>
              <span className="text-white font-semibold">{currentSponsor.title}:</span>
              <span className="text-[#a1a1aa] hidden md:inline">{currentSponsor.description}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={currentSponsor.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="px-3 py-1 rounded bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f9e79f] transition"
            >
              {currentSponsor.cta}
            </a>
            <button
              type="button"
              onClick={() => setClosed(true)}
              className="p-1 text-[#71717a] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Native format
  return (
    <div className={`bg-gradient-to-br from-[#121418] to-[#181b22] border border-[#d4af37]/30 rounded-xl p-5 relative ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{currentSponsor.icon}</span>
          <span className="text-xs font-bold text-white">{currentSponsor.sponsorName}</span>
        </div>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-[#71717a]">
          Patrocinado
        </span>
      </div>

      <h4 className="text-sm font-semibold text-[#f9e79f] mb-1.5">
        {currentSponsor.title}
      </h4>
      <p className="text-xs text-[#a1a1aa] leading-relaxed mb-4">
        {currentSponsor.description}
      </p>

      <a
        href={currentSponsor.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#f9e79f] text-black text-xs font-bold transition"
      >
        <span>{currentSponsor.cta}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
