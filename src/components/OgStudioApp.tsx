import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layers,
  Image as ImageIcon,
  Sparkles,
  Type,
  ShieldCheck,
} from 'lucide-react';
import { BackgroundControls } from './BackgroundControls';
import { KeyVisualControls } from './KeyVisualControls';
import { OverlayControls } from './OverlayControls';
import { WatermarkControls } from './WatermarkControls';
import { CanvasStage } from './CanvasStage';
import { Header } from './Header';
import { SocialPreviewModal } from './SocialPreviewModal';
import { TemplatesModal } from './TemplatesModal';
import { BgConfig, KvConfig, PresetTemplate, TextOverlayConfig, WatermarkConfig } from '../types';
import {
  INITIAL_BG_CONFIG,
  INITIAL_KV_CONFIG,
  INITIAL_TEXT_OVERLAY,
  INITIAL_WATERMARK_CONFIG,
} from '../data/presets';
import {
  renderOgImage,
  exportCanvasAsBlob,
  copyCanvasToClipboard,
} from '../utils/canvasRenderer';

const STORAGE_SAVED_CONFIG_KEY = 'mmserver_og_user_preset_v1';

export const OgStudioApp: React.FC = () => {
  // Load initial states from localStorage if user saved a previous state
  const loadSavedState = () => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_SAVED_CONFIG_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            bg: parsed.bgConfig || INITIAL_BG_CONFIG,
            kv: parsed.kvConfig || INITIAL_KV_CONFIG,
            text: parsed.textOverlay || INITIAL_TEXT_OVERLAY,
            watermark: parsed.watermarkConfig || INITIAL_WATERMARK_CONFIG,
            guides: Boolean(parsed.showGuides),
          };
        }
      }
    } catch (e) {
      console.error('Error loading saved preset:', e);
    }
    return {
      bg: INITIAL_BG_CONFIG,
      kv: INITIAL_KV_CONFIG,
      text: INITIAL_TEXT_OVERLAY,
      watermark: INITIAL_WATERMARK_CONFIG,
      guides: false,
    };
  };

  const initialSaved = loadSavedState();

  // Primary State
  const [bgConfig, setBgConfig] = useState<BgConfig>(initialSaved.bg);
  const [kvConfig, setKvConfig] = useState<KvConfig>(initialSaved.kv);
  const [textOverlay, setTextOverlay] = useState<TextOverlayConfig>(initialSaved.text);
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>(initialSaved.watermark);

  // UI state
  const [activeTab, setActiveTab] = useState<'bg' | 'kv' | 'overlay' | 'watermark'>('overlay');
  const [showGuides, setShowGuides] = useState<boolean>(initialSaved.guides);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [isSocialPreviewOpen, setIsSocialPreviewOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [canvasDataUrl, setCanvasDataUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Auto-save user settings to localStorage
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
      triggerToast('Configurações salvas como seu padrão!');
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
    triggerToast('Todas as opções foram restauradas para o padrão de fábrica.');
  };

  const handleResetBg = () => {
    setBgConfig(INITIAL_BG_CONFIG);
    triggerToast('Plano de fundo restaurado.');
  };

  const handleResetKv = () => {
    setKvConfig(INITIAL_KV_CONFIG);
    triggerToast('Key Visual restaurado.');
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
    setIsTemplatesOpen(false);
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
        triggerToast('Logo/Marca d’água importado com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (format: 'png' | 'jpeg' | 'webp' = 'png') => {
    if (!canvasRef.current) return;
    const blob = await exportCanvasAsBlob(canvasRef.current, format, 1.0);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `og-image-${Date.now()}.${format}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast(`Download da imagem OG (.${format}) concluído!`);
  };

  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    const success = await copyCanvasToClipboard(canvasRef.current);
    if (success) {
      setCopied(true);
      triggerToast('Imagem copiada para a área de transferência!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      triggerToast('Não foi possível copiar diretamente para a área de transferência.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] min-h-[calc(100vh-60px)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#121418] border border-[#d4af37] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold"
        >
          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Toolbar */}
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

      {/* Preset Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};
