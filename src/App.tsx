/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layers, Sparkles, Type, Download, RefreshCw, Eye, Check, Copy, Image as ImageIcon } from 'lucide-react';
import { Header } from './components/Header';
import { CanvasStage } from './components/CanvasStage';
import { BackgroundControls } from './components/BackgroundControls';
import { KeyVisualControls } from './components/KeyVisualControls';
import { OverlayControls } from './components/OverlayControls';
import { SocialPreviewModal } from './components/SocialPreviewModal';
import { TemplatesModal } from './components/TemplatesModal';
import { BgConfig, KvConfig, TextOverlayConfig, PresetTemplate } from './types';
import {
  INITIAL_BG_CONFIG,
  INITIAL_KV_CONFIG,
  INITIAL_TEXT_OVERLAY,
} from './data/presets';
import {
  renderOgImage,
  exportCanvasAsBlob,
  copyCanvasToClipboard,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from './utils/canvasRenderer';

export default function App() {
  const [bgConfig, setBgConfig] = useState<BgConfig>(INITIAL_BG_CONFIG);
  const [kvConfig, setKvConfig] = useState<KvConfig>(INITIAL_KV_CONFIG);
  const [textOverlay, setTextOverlay] = useState<TextOverlayConfig>(INITIAL_TEXT_OVERLAY);
  const [showGuides, setShowGuides] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'bg' | 'kv' | 'overlay'>('bg');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSocialPreviewOpen, setIsSocialPreviewOpen] = useState<boolean>(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [canvasDataUrl, setCanvasDataUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState<boolean>(false);
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
        { showSafeGuides: showGuides }
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
  }, [bgConfig, kvConfig, textOverlay, showGuides]);

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
  const handleBgChange = (updated: Partial<BgConfig>) => {
    setBgConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleKvChange = (updated: Partial<KvConfig>) => {
    setKvConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleOverlayChange = (updated: Partial<TextOverlayConfig>) => {
    setTextOverlay((prev) => ({ ...prev, ...updated }));
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

  // Select Template Handler
  const handleSelectTemplate = (template: PresetTemplate) => {
    if (template.bgConfig) {
      setBgConfig((prev) => ({ ...prev, ...template.bgConfig }));
    }
    if (template.kvConfig) {
      setKvConfig((prev) => ({ ...prev, ...template.kvConfig }));
    }
    if (template.textOverlay) {
      setTextOverlay((prev) => ({ ...prev, ...template.textOverlay }));
    }
    triggerToast(`Modelo "${template.name}" aplicado!`);
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

      {/* App Header */}
      <Header
        onDownload={() => handleDownload('png')}
        onCopyClipboard={handleCopyClipboard}
        copied={copied}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onToggleSocialPreview={() => setIsSocialPreviewOpen(true)}
        isSocialPreviewOpen={isSocialPreviewOpen}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Controls & Uploads Panel */}
        <aside className="w-full lg:w-[420px] xl:w-[460px] border-r border-[#ffffff10] bg-[#0f1115]/90 flex flex-col h-auto lg:h-[calc(100vh-65px)] overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="flex border-b border-[#ffffff10] bg-[#0a0a0a]/90 sticky top-0 z-20 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab('bg')}
              className={`flex-1 py-3.5 px-2 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'bg'
                  ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                  : 'border-transparent text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#16181d]/50'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>1. Background</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('kv')}
              className={`flex-1 py-3.5 px-2 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'kv'
                  ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                  : 'border-transparent text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#16181d]/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>2. Key Visual</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('overlay')}
              className={`flex-1 py-3.5 px-2 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'overlay'
                  ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                  : 'border-transparent text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#16181d]/50'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>3. Textos</span>
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

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
