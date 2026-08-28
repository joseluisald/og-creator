/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Layers,
  Sparkles,
  Type,
  Download,
  RefreshCw,
  Eye,
  Check,
  Image as ImageIcon,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { Header } from './components/Header';
import { CanvasStage } from './components/CanvasStage';
import { BackgroundControls } from './components/BackgroundControls';
import { KeyVisualControls } from './components/KeyVisualControls';
import { OverlayControls } from './components/OverlayControls';
import { WatermarkControls } from './components/WatermarkControls';
import { SocialPreviewModal } from './components/SocialPreviewModal';
import { MetaTagsModal } from './components/MetaTagsModal';
import { TemplatesModal } from './components/TemplatesModal';
import { BgConfig, KvConfig, PresetTemplate, TextOverlayConfig, WatermarkConfig, AppSubView } from './types';
import { AppNavigation } from './components/AppNavigation';
import { LandingPage } from './components/LandingPage';
import { MetaTagsStudio } from './components/MetaTagsStudio';
import { RobotsSitemapStudio } from './components/RobotsSitemapStudio';
import { LlmsTxtStudio } from './components/LlmsTxtStudio';
import { SerpSimulatorStudio } from './components/SerpSimulatorStudio';
import { FaviconStudio } from './components/FaviconStudio';
import { SecurityHeadersStudio } from './components/SecurityHeadersStudio';
import { RedirectsGeneratorStudio } from './components/RedirectsGeneratorStudio';
import {
  INITIAL_BG_CONFIG,
  INITIAL_KV_CONFIG,
  INITIAL_TEXT_OVERLAY,
  INITIAL_WATERMARK_CONFIG,
} from './data/presets';
import {
  renderOgImage,
  exportCanvasAsBlob,
  copyCanvasToClipboard,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from './utils/canvasRenderer';

const STORAGE_SAVED_CONFIG_KEY = 'mmserver_og_studio_saved_config';

function loadSavedStudioConfig() {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_SAVED_CONFIG_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load saved config:', err);
    return null;
  }
  return null;
}

export default function App() {
  const savedState = useMemo(() => loadSavedStudioConfig(), []);

  const [bgConfig, setBgConfig] = useState<BgConfig>(() => savedState?.bgConfig || INITIAL_BG_CONFIG);
  const [kvConfig, setKvConfig] = useState<KvConfig>(() => savedState?.kvConfig || INITIAL_KV_CONFIG);
  const [textOverlay, setTextOverlay] = useState<TextOverlayConfig>(() => savedState?.textOverlay || INITIAL_TEXT_OVERLAY);
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>(() => savedState?.watermarkConfig || INITIAL_WATERMARK_CONFIG);
  const [showGuides, setShowGuides] = useState<boolean>(() => savedState?.showGuides ?? false);
  const [activeTab, setActiveTab] = useState<'bg' | 'kv' | 'overlay' | 'watermark'>('bg');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSocialPreviewOpen, setIsSocialPreviewOpen] = useState<boolean>(false);
  const [isMetaTagsOpen, setIsMetaTagsOpen] = useState<boolean>(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [canvasDataUrl, setCanvasDataUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Parse initial route from pathname or hash
  const parseCurrentRoute = (): AppSubView => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/^\//, '').toLowerCase();
        if (path === 'serp-simulator' || path === 'serp-simulator/') return 'serp-simulator';
        if (path === 'favicon-studio' || path === 'favicon-studio/') return 'favicon-studio';
        if (path === 'security-headers' || path === 'security-headers/') return 'security-headers';
        if (path === 'redirects-generator' || path === 'redirects-generator/') return 'redirects-generator';
        if (path === 'og-studio' || path === 'og-studio/') return 'og-studio';
        if (path === 'meta-tags' || path === 'meta-tags/') return 'meta-tags';
        if (path === 'robots-sitemap' || path === 'robots-sitemap/') return 'robots-sitemap';
        if (path === 'llms-txt' || path === 'llms-txt/') return 'llms-txt';
        if (path === '' || path === 'home' || path === 'home/') return 'home';

        const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
        if (hash === 'serp-simulator') return 'serp-simulator';
        if (hash === 'favicon-studio') return 'favicon-studio';
        if (hash === 'security-headers') return 'security-headers';
        if (hash === 'redirects-generator') return 'redirects-generator';
        if (hash === 'og-studio') return 'og-studio';
        if (hash === 'meta-tags') return 'meta-tags';
        if (hash === 'robots-sitemap') return 'robots-sitemap';
        if (hash === 'llms-txt') return 'llms-txt';
        if (hash === 'home' || hash === '') return 'home';

        const stored = localStorage.getItem('mmserver_active_subview');
        if (stored && ['home', 'serp-simulator', 'favicon-studio', 'security-headers', 'redirects-generator', 'og-studio', 'meta-tags', 'robots-sitemap', 'llms-txt'].includes(stored)) {
          return stored as AppSubView;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 'home';
  };

  const [currentSubView, setCurrentSubView] = useState<AppSubView>(parseCurrentRoute);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync route on popstate / hashchange (browser forward/back buttons)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentSubView(parseCurrentRoute());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleSubViewChange = (view: AppSubView) => {
    setCurrentSubView(view);
    try {
      localStorage.setItem('mmserver_active_subview', view);
      // Clean HTML5 pushState: / for home, /og-studio for og, etc.
      const newPath = view === 'home' ? '/' : `/${view}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Render loop
  const triggerRender = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);
    try {
      await renderOgImage(
        canvasRef.current,
        bgConfig,
        kvConfig,
        textOverlay,
        { showSafeGuides: showGuides, watermark: watermarkConfig }
      );
      // Cache data url for social preview modal
      if (canvasRef.current) {
        setCanvasDataUrl(canvasRef.current.toDataURL('image/png'));
      }
    } catch (err) {
      console.error('Render error:', err);
    } finally {
      setIsRendering(false);
    }
  }, [bgConfig, kvConfig, textOverlay, watermarkConfig, showGuides]);

  useEffect(() => {
    triggerRender();
  }, [triggerRender]);

  // Window-level clipboard paste listener for quick image input
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                const imgData = event.target.result as string;
                if (activeTab === 'kv') {
                  setKvConfig((prev) => ({
                    ...prev,
                    imageUrl: imgData,
                    imageFileName: 'clipboard-kv.png',
                  }));
                  triggerToast('Imagem colada no Key Visual (KV)!');
                } else if (activeTab === 'watermark') {
                  setWatermarkConfig((prev) => ({
                    ...prev,
                    enabled: true,
                    imageUrl: imgData,
                    imageFileName: 'clipboard-logo.png',
                  }));
                  triggerToast('Logo/Selo colado na Marca d’Água!');
                } else {
                  setBgConfig((prev) => ({
                    ...prev,
                    imageUrl: imgData,
                    imageFileName: 'clipboard-bg.png',
                  }));
                  triggerToast('Imagem colada no Background (BG)!');
                }
              }
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [activeTab]);

  // Handlers for updates
  // Auto-save user settings to localStorage so they persist across sessions and logins
  useEffect(() => {
    try {
      const payload = {
        bgConfig,
        kvConfig,
        textOverlay,
        watermarkConfig,
        showGuides,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_SAVED_CONFIG_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Auto-save error:', e);
    }
  }, [bgConfig, kvConfig, textOverlay, watermarkConfig, showGuides]);

  const handleSaveConfig = () => {
    try {
      const payload = {
        bgConfig,
        kvConfig,
        textOverlay,
        watermarkConfig,
        showGuides,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_SAVED_CONFIG_KEY, JSON.stringify(payload));
      triggerToast('Configurações salvas como seu padrão! Carregará automaticamente no próximo login.');
    } catch (e) {
      console.error('Save error:', e);
      triggerToast('Erro ao salvar configurações.');
    }
  };

  const handleResetAll = () => {
    setBgConfig(INITIAL_BG_CONFIG);
    setKvConfig(INITIAL_KV_CONFIG);
    setTextOverlay(INITIAL_TEXT_OVERLAY);
    setWatermarkConfig(INITIAL_WATERMARK_CONFIG);
    setShowGuides(false);
    localStorage.removeItem(STORAGE_SAVED_CONFIG_KEY);
    triggerToast('Todas as camadas e opções foram restauradas para o padrão de fábrica.');
  };

  const handleBgChange = (updated: Partial<BgConfig>) => {
    setBgConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleKvChange = (updated: Partial<KvConfig>) => {
    setKvConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleOverlayChange = (updated: Partial<TextOverlayConfig>) => {
    setTextOverlay((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectTemplate = (tmpl: PresetTemplate) => {
    setBgConfig({ ...INITIAL_BG_CONFIG, ...tmpl.bgConfig });
    setKvConfig({ ...INITIAL_KV_CONFIG, ...tmpl.kvConfig });
    if (tmpl.textOverlay) {
      setTextOverlay((prev) => ({ ...prev, ...tmpl.textOverlay }));
    }
    triggerToast(`Modelo "${tmpl.name}" carregado!`);
  };

  const handleWatermarkChange = (updated: Partial<WatermarkConfig>) => {
    setWatermarkConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleWatermarkFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setWatermarkConfig((prev) => ({
          ...prev,
          enabled: true,
          imageUrl: event.target?.result as string,
          imageFileName: file.name,
        }));
        triggerToast(`Logo "${file.name}" carregado com sucesso!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetBg = () => {
    setBgConfig(INITIAL_BG_CONFIG);
    triggerToast('Background restaurado para o padrão.');
  };

  const handleResetKv = () => {
    setKvConfig(INITIAL_KV_CONFIG);
    triggerToast('Key Visual restaurado para o padrão.');
  };

  // Download Handler
  const handleDownload = async (format: 'png' | 'jpeg' | 'webp' = 'png') => {
    if (!canvasRef.current) return;

    // Temporarily render without guides for clean export
    await renderOgImage(canvasRef.current, bgConfig, kvConfig, textOverlay, {
      showSafeGuides: false,
      watermark: watermarkConfig,
    });

    try {
      const blob = await exportCanvasAsBlob(canvasRef.current, format, 0.95);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `og-image-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerToast(`OG Image baixada com sucesso (${format.toUpperCase()} · 1200x630)!`);
    } catch (err) {
      console.error('Download error:', err);
      triggerToast('Erro ao exportar a imagem.');
    } finally {
      // Restore guides state if it was active
      if (showGuides) {
        triggerRender();
      }
    }
  };

  // Copy to Clipboard Handler
  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;

    // Temporarily render clean without guides for copy
    await renderOgImage(canvasRef.current, bgConfig, kvConfig, textOverlay, {
      showSafeGuides: false,
      watermark: watermarkConfig,
    });

    const success = await copyCanvasToClipboard(canvasRef.current);
    if (success) {
      setCopied(true);
      triggerToast('Imagem PNG (1200x630) copiada para a área de transferência!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      triggerToast('Não foi possível copiar diretamente. Tente o botão de Download.');
    }

    if (showGuides) {
      triggerRender();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-[#16181d] border border-[#d4af37]/40 text-[#f9e79f] text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
            <Check className="w-4 h-4 text-[#d4af37]" />
            <span className="font-medium text-[#e5e5e5]">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Application Switcher Bar */}
      <AppNavigation
        currentView={currentSubView}
        onChangeView={handleSubViewChange}
      />

      {/* Sub-Application 0: Landing Page (Default on /) */}
      {currentSubView === 'home' && (
        <LandingPage onNavigate={handleSubViewChange} />
      )}

      {/* Sub-Application 0.5: SERP Simulator Studio */}
      {currentSubView === 'serp-simulator' && (
        <SerpSimulatorStudio
          triggerToast={triggerToast}
          onNavigate={handleSubViewChange}
        />
      )}

      {/* Sub-Application 0.6: Favicon & PWA Studio */}
      {currentSubView === 'favicon-studio' && (
        <FaviconStudio
          triggerToast={triggerToast}
          onNavigate={handleSubViewChange}
        />
      )}

      {/* Sub-Application 0.7: Security Headers Studio */}
      {currentSubView === 'security-headers' && (
        <SecurityHeadersStudio
          triggerToast={triggerToast}
          onNavigate={handleSubViewChange}
        />
      )}

      {/* Sub-Application 0.8: Redirects Generator Studio */}
      {currentSubView === 'redirects-generator' && (
        <RedirectsGeneratorStudio
          triggerToast={triggerToast}
          onNavigate={handleSubViewChange}
        />
      )}

      {/* Sub-Application 1: Meta Tags & SEO Suite */}
      {currentSubView === 'meta-tags' && (
        <MetaTagsStudio
          currentOgCanvasImage={canvasDataUrl}
          currentOgTitle={textOverlay.titleText}
          currentOgSubtitle={textOverlay.subtitleText}
          onNavigateToOgStudio={() => handleSubViewChange('og-studio')}
          triggerToast={triggerToast}
        />
      )}

      {/* Sub-Application 2: Robots.txt, Sitemap.xml & AI Bot Shield */}
      {currentSubView === 'robots-sitemap' && (
        <RobotsSitemapStudio
          triggerToast={triggerToast}
          onNavigateToMetaTags={() => handleSubViewChange('meta-tags')}
        />
      )}

      {/* Sub-Application 3: llms.txt & llms-full.txt Generator Studio */}
      {currentSubView === 'llms-txt' && (
        <LlmsTxtStudio
          triggerToast={triggerToast}
          onNavigateToMetaTags={() => handleSubViewChange('meta-tags')}
        />
      )}

      {/* Sub-Application 4: OG Image Studio */}
      {currentSubView === 'og-studio' && (
        <>
          {/* App Header */}
          <Header
            onDownload={() => handleDownload('png')}
            onSaveConfig={handleSaveConfig}
            onResetAll={handleResetAll}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            onToggleSocialPreview={() => setIsSocialPreviewOpen(true)}
            isSocialPreviewOpen={isSocialPreviewOpen}
          />

          {/* Main Workspace Layout */}
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Side: Controls & Uploads Panel */}
            <aside className="w-full lg:w-[420px] xl:w-[460px] border-r border-[#ffffff10] bg-[#0f1115]/90 flex flex-col h-auto lg:h-[calc(100vh-105px)] overflow-y-auto">
              {/* Navigation Tabs */}
              <div className="grid grid-cols-4 border-b border-[#ffffff10] bg-[#0a0a0a]/90 sticky top-0 z-20 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActiveTab('bg')}
                  className={`py-3 px-1 text-[11px] uppercase tracking-wider font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
                    activeTab === 'bg'
                      ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                      : 'border-transparent text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#16181d]/50'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="truncate">1. Fundo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('kv')}
                  className={`py-3 px-1 text-[11px] uppercase tracking-wider font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
                    activeTab === 'kv'
                      ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                      : 'border-transparent text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#16181d]/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="truncate">2. Visual</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('overlay')}
                  className={`py-3 px-1 text-[11px] uppercase tracking-wider font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
                    activeTab === 'overlay'
                      ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                      : 'border-transparent text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#16181d]/50'
                  }`}
                >
                  <Type className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="truncate">3. Textos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('watermark')}
                  className={`py-3 px-1 text-[11px] uppercase tracking-wider font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
                    activeTab === 'watermark'
                      ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                      : 'border-transparent text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#16181d]/50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="truncate">4. Selo/Logo</span>
                </button>
              </div>

              {/* Tab Content Container */}
              <div className="p-5 lg:p-6 flex-1">
                {activeTab === 'bg' && (
                  <BackgroundControls
                    config={bgConfig}
                    onChange={handleBgChange}
                    onReset={handleResetBg}
                  />
                )}

                {activeTab === 'kv' && (
                  <KeyVisualControls
                    config={kvConfig}
                    onChange={handleKvChange}
                    onReset={handleResetKv}
                  />
                )}

                {activeTab === 'overlay' && (
                  <OverlayControls
                    config={textOverlay}
                    onChange={handleOverlayChange}
                  />
                )}

                {activeTab === 'watermark' && (
                  <WatermarkControls
                    config={watermarkConfig}
                    onChange={handleWatermarkChange}
                    onFileUpload={handleWatermarkFileUpload}
                  />
                )}
              </div>
            </aside>

            {/* Right Side: Interactive Live Canvas Stage */}
            <section className="flex-1 p-5 lg:p-7 bg-[#0a0a0a] flex flex-col min-w-0">
              <CanvasStage
                canvasRef={canvasRef}
                onDownload={handleDownload}
                onCopyClipboard={handleCopyClipboard}
                copied={copied}
                showGuides={showGuides}
                onToggleGuides={() => setShowGuides((prev) => !prev)}
                isRendering={isRendering}
              />
            </section>
          </main>

          {/* Social Media Preview Modal */}
          <SocialPreviewModal
            isOpen={isSocialPreviewOpen}
            onClose={() => setIsSocialPreviewOpen(false)}
            canvasDataUrl={canvasDataUrl}
            title={textOverlay.titleText || 'Título do Projeto'}
            subtitle={textOverlay.subtitleText || 'Sua descrição aqui'}
          />

          {/* Meta Tags Generator Modal (Quick access) */}
          <MetaTagsModal
            isOpen={isMetaTagsOpen}
            onClose={() => setIsMetaTagsOpen(false)}
            defaultTitle={textOverlay.titleText || 'Título do Projeto'}
            defaultSubtitle={textOverlay.subtitleText || 'Sua descrição aqui'}
          />

          {/* Preset Templates Modal */}
          <TemplatesModal
            isOpen={isTemplatesOpen}
            onClose={() => setIsTemplatesOpen(false)}
            onSelectTemplate={handleSelectTemplate}
          />
        </>
      )}
    </div>
  );
}

