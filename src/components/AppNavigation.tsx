import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Search,
  Smile,
  ShieldCheck,
  ArrowRightLeft,
  Image as ImageIcon,
  Code2,
  ShieldAlert,
  Bot,
  HelpCircle,
  Info,
  ArrowRight,
  LayoutGrid
} from 'lucide-react';
import { AppSubView } from '../types';

interface AppNavigationProps {
  currentView: AppSubView;
  onChangeView: (view: AppSubView) => void;
}

interface NavAppItem {
  id: AppSubView;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  badgeColor: string;
  iconColor: string;
  iconBg: string;
}

const APPS_LIST: NavAppItem[] = [
  {
    id: 'serp-simulator',
    title: 'Simulador SERP Google',
    desc: 'Pré-visualização Desktop & Mobile com corte em 580px',
    icon: Search,
    badge: '580px',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 'favicon-studio',
    title: 'Favicon & PWA Studio',
    desc: 'Gere .ico, Apple Touch Icon e Web Manifest',
    icon: Smile,
    badge: 'PWA',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'security-headers',
    title: 'Headers HTTP de Segurança',
    desc: 'Configuração CSP, HSTS, X-Frame para Nginx e Apache',
    icon: ShieldCheck,
    badge: 'CSP/HSTS',
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20'
  },
  {
    id: 'redirects-generator',
    title: 'Gerador de Redirecionamentos',
    desc: 'Regras 301/302 para .htaccess, Nginx, Netlify e Vercel',
    icon: ArrowRightLeft,
    badge: '301/302',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20'
  },
  {
    id: 'og-studio',
    title: 'OG Image Studio',
    desc: 'Criação de imagens 1200×630 para WhatsApp e redes',
    icon: ImageIcon,
    badge: '1200×630',
    badgeColor: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10 border-yellow-500/20'
  },
  {
    id: 'meta-tags',
    title: 'Meta Tags & Schema JSON-LD',
    desc: 'Gerador de SEO e Schema estruturado para 9 frameworks',
    icon: Code2,
    badge: 'Schema',
    badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    id: 'robots-sitemap',
    title: 'Robots.txt & Sitemap Shield',
    desc: 'Bloqueio de bots de IA e proteção de indexação',
    icon: ShieldAlert,
    badge: 'Shield',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10 border-rose-500/20'
  },
  {
    id: 'llms-txt',
    title: 'llms.txt Studio para IA',
    desc: 'Padronização de documentação para Cursor e Claude',
    icon: Bot,
    badge: 'LLMs',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/20'
  },
];

export const AppNavigation: React.FC<AppNavigationProps> = ({
  currentView,
  onChangeView,
}) => {
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsAppsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavAnchor = (anchorId: string) => {
    setIsMobileMenuOpen(false);
    setIsAppsOpen(false);

    if (currentView !== 'home') {
      onChangeView('home');
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectApp = (viewId: AppSubView) => {
    setIsAppsOpen(false);
    setIsMobileMenuOpen(false);
    onChangeView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full bg-[#0a0a0d]/95 border-b border-[#ffffff15] sticky top-0 z-50 backdrop-blur-xl shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => handleSelectApp('home')}
          className="flex items-center gap-2.5 shrink-0 group cursor-pointer focus:outline-none text-left"
          title="Web & SEO Studio - Início"
        >
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#f9e79f] to-[#b38f28] flex items-center justify-center shadow-md shadow-[#d4af3730] group-hover:scale-105 transition-all">
            <Sparkles className="w-4 h-4 text-black drop-shadow-sm" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0a0d]" title="Online e Pronto" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight group-hover:text-[#f9e79f] transition-colors">
              Web &amp; SEO <span className="text-[#d4af37]">Studio</span>
            </span>
            <span className="text-[10px] text-[#71717a] font-mono tracking-wider">
              SUÍTE GRATUITA PARA WEB
            </span>
          </div>
        </button>

        {/* Clean Center Navigation Menus */}
        <nav className="hidden md:flex items-center gap-1.5" ref={dropdownRef}>
          {/* Apps Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              id="apps-menu-trigger"
              onClick={() => setIsAppsOpen(!isAppsOpen)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isAppsOpen || currentView !== 'home'
                  ? 'bg-[#1a1d26] text-[#f9e79f] border border-[#d4af37]/40 shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#14161f]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Ferramentas (8)</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isAppsOpen ? 'rotate-180 text-[#d4af37]' : 'text-[#71717a]'
                }`}
              />
            </button>

            {/* Apps Dropdown Menu Popup */}
            {isAppsOpen && (
              <div className="absolute top-full left-0 mt-2 w-[520px] bg-[#101217] border border-[#ffffff15] rounded-2xl p-3 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-2.5 py-1.5 mb-2 border-b border-[#ffffff10]">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#d4af37]">
                    Todas as 8 Ferramentas
                  </span>
                  <button
                    type="button"
                    onClick={() => handleNavAnchor('ferramentas')}
                    className="text-[11px] text-[#a1a1aa] hover:text-white transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Ver no Grid</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {APPS_LIST.map((app) => {
                    const IconComponent = app.icon;
                    const isActive = currentView === app.id;
                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => handleSelectApp(app.id)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl transition text-left cursor-pointer group ${
                          isActive
                            ? 'bg-[#1e2230] border border-[#d4af37]/40'
                            : 'hover:bg-[#181a22] border border-transparent'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg ${app.iconBg} border flex items-center justify-center shrink-0 ${app.iconColor} group-hover:scale-105 transition-transform`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span
                              className={`text-xs font-bold truncate ${
                                isActive ? 'text-[#f9e79f]' : 'text-white group-hover:text-[#f9e79f]'
                              }`}
                            >
                              {app.title}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${app.badgeColor}`}
                            >
                              {app.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] line-clamp-1 leading-tight">
                            {app.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* About / Sobre */}
          <button
            type="button"
            id="nav-about-btn"
            onClick={() => handleNavAnchor('sobre')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#a1a1aa] hover:text-white hover:bg-[#14161f] transition cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>Sobre</span>
          </button>

          {/* FAQ */}
          <button
            type="button"
            id="nav-faq-btn"
            onClick={() => handleNavAnchor('faq')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#a1a1aa] hover:text-white hover:bg-[#14161f] transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>FAQ</span>
          </button>
        </nav>

        {/* Right Action CTA Button (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            type="button"
            id="nav-explore-btn"
            onClick={() => handleNavAnchor('ferramentas')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6be44] hover:from-[#e6be44] hover:to-[#d4af37] text-black font-bold text-xs transition cursor-pointer shadow-md shadow-[#d4af3720] hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Explorar Ferramentas</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-[#14161f] border border-[#ffffff15] text-[#a1a1aa] hover:text-white transition cursor-pointer"
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#ffffff10] bg-[#0c0d12] px-4 py-4 space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] px-2 font-bold">
              Navegação
            </span>
            <button
              type="button"
              onClick={() => handleSelectApp('home')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#161822] text-left"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Página Inicial</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavAnchor('sobre')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#161822] text-left"
            >
              <Info className="w-3.5 h-3.5 text-[#a1a1aa]" />
              <span>Sobre o Studio</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavAnchor('faq')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#161822] text-left"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#a1a1aa]" />
              <span>Perguntas Frequentes (FAQ)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#ffffff10] flex flex-col gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] px-2 font-bold">
              Ferramentas Disponíveis
            </span>
            <div className="grid grid-cols-1 gap-1">
              {APPS_LIST.map((app) => {
                const IconComponent = app.icon;
                const isActive = currentView === app.id;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => handleSelectApp(app.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition ${
                      isActive
                        ? 'bg-[#1e2230] text-[#f9e79f] font-bold border border-[#d4af37]/40'
                        : 'text-[#a1a1aa] hover:text-white hover:bg-[#141620]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-3.5 h-3.5 ${app.iconColor}`} />
                      <span>{app.title}</span>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${app.badgeColor}`}>
                      {app.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
