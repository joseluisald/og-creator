import React from 'react';
import { Sparkles, Code2, Image as ImageIcon, ShieldAlert, Bot, Home } from 'lucide-react';
import { AppSubView } from '../types';

interface AppNavigationProps {
  currentView: AppSubView;
  onChangeView: (view: AppSubView) => void;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  currentView,
  onChangeView,
}) => {
  return (
    <nav className="w-full bg-[#0a0a0a] border-b border-[#ffffff10] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-40">
      {/* Brand & Sub-App Selector */}
      <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
        <button
          type="button"
          onClick={() => onChangeView('home')}
          className="flex items-center gap-2 cursor-pointer group"
          title="Ir para a Página Inicial"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#d4af37] to-[#f9e79f] flex items-center justify-center shadow-md shadow-[#d4af3720] group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold text-sm text-[#f9e79f] font-['Cormorant_Garamond',serif] italic tracking-wide hidden sm:inline group-hover:text-white transition">
            Web &amp; SEO Studio
          </span>
        </button>

        {/* Sub-Applications Tabs with Clean Routes */}
        <div className="bg-[#14161b] p-1 rounded-2xl border border-[#ffffff10] flex items-center gap-1 shadow-inner flex-wrap">
          <button
            type="button"
            id="subapp-tab-home"
            onClick={() => onChangeView('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              currentView === 'home'
                ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af3725]'
                : 'text-[#a1a1aa] hover:text-[#e5e5e5] hover:bg-[#1f2228]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Início</span>
          </button>

          <button
            type="button"
            id="subapp-tab-og"
            onClick={() => onChangeView('og-studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              currentView === 'og-studio'
                ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af3725]'
                : 'text-[#a1a1aa] hover:text-[#e5e5e5] hover:bg-[#1f2228]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>OG Image</span>
            <span className="hidden lg:inline text-[10px] opacity-75 font-mono">/og-studio</span>
          </button>

          <button
            type="button"
            id="subapp-tab-metatags"
            onClick={() => onChangeView('meta-tags')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              currentView === 'meta-tags'
                ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af3725]'
                : 'text-[#a1a1aa] hover:text-[#e5e5e5] hover:bg-[#1f2228]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Meta Tags</span>
            <span className="hidden lg:inline text-[10px] opacity-75 font-mono">/meta-tags</span>
          </button>

          <button
            type="button"
            id="subapp-tab-robots"
            onClick={() => onChangeView('robots-sitemap')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              currentView === 'robots-sitemap'
                ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af3725]'
                : 'text-[#a1a1aa] hover:text-[#e5e5e5] hover:bg-[#1f2228]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Robots &amp; Sitemap</span>
            <span className="hidden lg:inline text-[10px] opacity-75 font-mono">/robots-sitemap</span>
          </button>

          <button
            type="button"
            id="subapp-tab-llmstxt"
            onClick={() => onChangeView('llms-txt')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              currentView === 'llms-txt'
                ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af3725]'
                : 'text-[#a1a1aa] hover:text-[#e5e5e5] hover:bg-[#1f2228]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>llms.txt Studio</span>
            <span className="hidden lg:inline text-[10px] opacity-75 font-mono">/llms-txt</span>
            <span className="px-1.5 py-0.2 rounded-md bg-[#d4af37]/20 text-[#f9e79f] text-[9px] font-mono font-bold">
              NOVO
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
      </div>
    </nav>
  );
};



