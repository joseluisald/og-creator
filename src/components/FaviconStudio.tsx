import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Smile,
  Type,
  Smartphone,
  RefreshCw,
  Sliders,
  FileCode,
  FolderArchive,
  Eye,
  RotateCcw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Sun,
  Moon,
  CheckCircle2,
  Layers,
  Sparkle
} from 'lucide-react';
import JSZip from 'jszip';
import { FaviconConfig, WebManifestConfig, AppSubView } from '../types';

interface FaviconStudioProps {
  triggerToast?: (msg: string) => void;
  onNavigate?: (view: AppSubView) => void;
}

const DEFAULT_CONFIG: FaviconConfig = {
  sourceType: 'emoji',
  imageUrl: null,
  imageFileName: '',
  emoji: '⚡',
  text: 'W',
  fontFamily: 'system-ui',
  textColor: '#ffffff',
  iconName: 'Sparkles',
  iconColor: '#d4af37',
  bgColor: '#0a0a0c',
  bgGradientEnd: '#1e1b4b',
  useGradient: true,
  shape: 'squircle',
  borderRadiusPercent: 28,
  paddingPercent: 12,
  borderWidth: 0,
  borderColor: '#d4af37',
  shadowBlur: 0,
  shadowColor: '#000000',
  scale: 100,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  imageFit: 'contain',
  opacity: 100,
};

const DEFAULT_MANIFEST: WebManifestConfig = {
  name: 'Meu Aplicativo Web',
  shortName: 'MeuApp',
  description: 'Um aplicativo web progressivo rápido, moderno e responsivo.',
  startUrl: '/',
  display: 'standalone',
  orientation: 'any',
  themeColor: '#d4af37',
  backgroundColor: '#0a0a0c',
  scope: '/',
  lang: 'pt-BR',
  dir: 'ltr',
  id: '/?source=pwa',
  categories: ['utilities', 'productivity'],
};

const POPULAR_EMOJIS = ['⚡', '🚀', '🔥', '💎', '🌟', '🛡️', '🎯', '✨', '💡', '🤖', '💻', '🎨', '📈', '🔒', '🍕', '☕', '🦅', '👑', '☀️', '⭐'];
const POPULAR_COLORS = ['#d4af37', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#ec4899', '#06b6d4', '#111827', '#ffffff'];

export const FaviconStudio: React.FC<FaviconStudioProps> = ({
  triggerToast = () => {},
  onNavigate = () => {},
}) => {
  const [config, setConfig] = useState<FaviconConfig>(DEFAULT_CONFIG);
  const [manifest, setManifest] = useState<WebManifestConfig>(DEFAULT_MANIFEST);
  const [activeTab, setActiveTab] = useState<'design' | 'manifest' | 'code'>('design');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Live Canvas state
  const [liveDataUrl, setLiveDataUrl] = useState<string>('');
  const [showCenterGuides, setShowCenterGuides] = useState<boolean>(true);
  const [browserTheme, setBrowserTheme] = useState<'dark' | 'light'>('dark');
  const [previewTab, setPreviewTab] = useState<'preview' | 'sizes' | 'mockup'>('preview');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  // Pre-load image when imageUrl changes
  useEffect(() => {
    if (!config.imageUrl) {
      loadedImageRef.current = null;
      renderLivePreview();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImageRef.current = img;
      renderLivePreview();
    };
    img.onerror = () => {
      console.warn('Falha ao carregar imagem para o Favicon');
    };
    img.src = config.imageUrl;
  }, [config.imageUrl]);

  // Core drawing function supporting arbitrary target sizes
  const drawFaviconToCanvas = useCallback(
    (canvas: HTMLCanvasElement, targetSize: number) => {
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, targetSize, targetSize);

      // Padding & dimensions
      const pad = (config.paddingPercent / 100) * targetSize;
      const drawSize = Math.max(1, targetSize - pad * 2);
      const x = pad;
      const y = pad;

      // Determine radius based on shape
      let radius = 0;
      if (config.shape === 'circle') {
        radius = drawSize / 2;
      } else if (config.shape === 'rounded') {
        radius = (config.borderRadiusPercent / 100) * drawSize;
      } else if (config.shape === 'squircle') {
        radius = drawSize * 0.28;
      }

      // Draw background shape
      ctx.save();
      ctx.beginPath();
      if (radius > 0) {
        ctx.roundRect(x, y, drawSize, drawSize, radius);
      } else {
        ctx.rect(x, y, drawSize, drawSize);
      }
      ctx.clip();

      if (config.useGradient && config.bgGradientEnd) {
        const grad = ctx.createLinearGradient(x, y, x + drawSize, y + drawSize);
        grad.addColorStop(0, config.bgColor);
        grad.addColorStop(1, config.bgGradientEnd);
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = config.bgColor;
      }
      ctx.fillRect(x, y, drawSize, drawSize);

      // Element Center with relative offsets (controlled purely by sliders)
      const centerX = x + drawSize / 2 + (config.offsetX / 100) * drawSize;
      const centerY = y + drawSize / 2 + (config.offsetY / 100) * drawSize;

      // Transformation: Scale, Offset, Rotation, Opacity
      ctx.save();
      ctx.translate(centerX, centerY);

      if (config.rotation) {
        ctx.rotate((config.rotation * Math.PI) / 180);
      }

      if (config.opacity !== undefined && config.opacity < 100) {
        ctx.globalAlpha = Math.max(0, Math.min(1, config.opacity / 100));
      }

      const scaleMultiplier = Math.max(0.1, config.scale / 100);

      // Draw content based on sourceType
      if (config.sourceType === 'emoji') {
        const emSize = drawSize * 0.62 * scaleMultiplier;
        ctx.font = `${emSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.emoji || '⚡', 0, emSize * 0.05);
      } else if (config.sourceType === 'text') {
        const txtSize = drawSize * 0.58 * scaleMultiplier;
        ctx.fillStyle = config.textColor;
        ctx.font = `bold ${txtSize}px ${config.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((config.text || 'W').slice(0, 2), 0, txtSize * 0.03);
      } else if (config.sourceType === 'image' && loadedImageRef.current) {
        const img = loadedImageRef.current;
        const imgW = img.naturalWidth || 1;
        const imgH = img.naturalHeight || 1;
        const imgAspect = imgW / imgH;

        let baseW = drawSize;
        let baseH = drawSize;

        if (config.imageFit === 'contain') {
          if (imgAspect >= 1) {
            baseW = drawSize;
            baseH = drawSize / imgAspect;
          } else {
            baseH = drawSize;
            baseW = drawSize * imgAspect;
          }
        } else if (config.imageFit === 'cover') {
          if (imgAspect >= 1) {
            baseH = drawSize;
            baseW = drawSize * imgAspect;
          } else {
            baseW = drawSize;
            baseH = drawSize / imgAspect;
          }
        }

        const renderW = baseW * scaleMultiplier;
        const renderH = baseH * scaleMultiplier;

        ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
      }

      ctx.restore(); // restore transformation
      ctx.restore(); // restore clip

      // Draw border if set (outside clip so border stays crisp)
      if (config.borderWidth > 0) {
        ctx.save();
        ctx.beginPath();
        const strokeWidth = (config.borderWidth / 100) * targetSize;
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = config.borderColor;

        if (radius > 0) {
          ctx.roundRect(x, y, drawSize, drawSize, radius);
        } else {
          ctx.rect(x, y, drawSize, drawSize);
        }
        ctx.stroke();
        ctx.restore();
      }
    },
    [config]
  );

  // Render the primary 512x512 live canvas and update dataUrl
  const renderLivePreview = useCallback(() => {
    if (!canvasRef.current) return;
    drawFaviconToCanvas(canvasRef.current, 512);
    try {
      const data = canvasRef.current.toDataURL('image/png');
      setLiveDataUrl(data);
    } catch {
      // ignore
    }
  }, [drawFaviconToCanvas]);

  // Re-render whenever config changes in real time
  useEffect(() => {
    renderLivePreview();
  }, [config, renderLivePreview]);

  // Helper to render on a detached canvas for exports
  const renderCanvasToSize = (size: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    drawFaviconToCanvas(canvas, size);
    return canvas;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const url = event.target.result as string;
        setConfig((prev) => ({
          ...prev,
          sourceType: 'image',
          imageUrl: url,
          imageFileName: file.name,
          scale: 100,
          offsetX: 0,
          offsetY: 0,
        }));
        triggerToast(`Imagem "${file.name}" carregada! Use os sliders para ajustar escala e posição.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const getCanvasBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      }, 'image/png');
    });
  };

  // Quick download single 512px PNG
  const downloadSinglePng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `${manifest.shortName.toLowerCase().replace(/\s+/g, '-')}-favicon-512x512.png`;
    link.click();
    triggerToast('Favicon 512×512 HD baixado com sucesso!');
  };

  // Quick download single .ico
  const downloadSingleIco = async () => {
    const icoCanvas = renderCanvasToSize(32);
    const blob = await getCanvasBlob(icoCanvas);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'favicon.ico';
    link.click();
    URL.revokeObjectURL(link.href);
    triggerToast('Arquivo favicon.ico baixado!');
  };

  // Export full ZIP package
  const generateZipPackage = async () => {
    setIsExporting(true);
    setExportProgress(10);

    try {
      const zip = new JSZip();
      const folder = zip.folder('favicons') || zip;

      // 1. Generate PNGs
      const sizes = [
        { name: 'favicon-16x16.png', size: 16 },
        { name: 'favicon-32x32.png', size: 32 },
        { name: 'favicon-48x48.png', size: 48 },
        { name: 'apple-touch-icon.png', size: 180 },
        { name: 'android-chrome-192x192.png', size: 192 },
        { name: 'android-chrome-512x512.png', size: 512 },
        { name: 'mstile-150x150.png', size: 150 },
      ];

      for (let i = 0; i < sizes.length; i++) {
        const item = sizes[i];
        const canvas = renderCanvasToSize(item.size);
        const blob = await getCanvasBlob(canvas);
        folder.file(item.name, blob);
        setExportProgress(20 + Math.round((i / sizes.length) * 50));
      }

      // 2. Standard favicon.ico
      const icoCanvas = renderCanvasToSize(32);
      const icoBlob = await getCanvasBlob(icoCanvas);
      folder.file('favicon.ico', icoBlob);

      // 3. site.webmanifest
      const manifestJson = {
        name: manifest.name,
        short_name: manifest.shortName,
        description: manifest.description,
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: manifest.themeColor,
        background_color: manifest.backgroundColor,
        start_url: manifest.startUrl,
        display: manifest.display,
        orientation: manifest.orientation,
        scope: manifest.scope,
        lang: manifest.lang,
      };
      folder.file('site.webmanifest', JSON.stringify(manifestJson, null, 2));

      // 4. browserconfig.xml
      const browserConfigXml = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>${manifest.themeColor}</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
      folder.file('browserconfig.xml', browserConfigXml);

      // 5. HTML Snippet
      const htmlSnippet = `<!-- Favicon & App Icons (Coloque dentro de <head>) -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${manifest.themeColor}">
<meta name="msapplication-TileColor" content="${manifest.themeColor}">
<meta name="msapplication-config" content="/browserconfig.xml">`;
      folder.file('HTML-HEAD-SNIPPET.html', htmlSnippet);

      setExportProgress(90);
      const content = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${manifest.shortName.toLowerCase().replace(/\s+/g, '-')}-favicons.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

      setExportProgress(100);
      triggerToast('Pacote completo de Favicons (ZIP) baixado com sucesso!');
    } catch (err) {
      console.error(err);
      triggerToast('Erro ao gerar o pacote ZIP. Tente novamente.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const getHeadCode = (framework: 'html' | 'nextjs' | 'astro' = 'html') => {
    if (framework === 'nextjs') {
      return `// app/layout.tsx ou pages/_document.tsx
export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};`;
    }

    if (framework === 'astro') {
      return `---
// src/layouts/Layout.astro
---
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="${manifest.themeColor}" />`;
    }

    return `<!-- Favicon & Mobile App Icons -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${manifest.themeColor}">
<meta name="msapplication-TileColor" content="${manifest.themeColor}">`;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    triggerToast('Código copiado para a área de transferência!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Reset helpers
  const resetPosition = () => {
    setConfig((p) => ({ ...p, offsetX: 0, offsetY: 0 }));
    triggerToast('Posição centralizada em (0, 0)');
  };

  const resetScale = () => {
    setConfig((p) => ({ ...p, scale: 100 }));
    triggerToast('Escala redefinida para 100%');
  };

  const resetAllDimensions = () => {
    setConfig((p) => ({
      ...p,
      scale: 100,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      paddingPercent: 12,
      opacity: 100,
    }));
    triggerToast('Escala e posicionamento redefinidos com sucesso!');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0c] text-white min-h-[calc(100vh-64px)]">
      {/* Sub-Header Toolbar */}
      <div className="border-b border-[#ffffff10] bg-[#0f1115] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 relative z-20">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#d4af3715] text-[#f9e79f] border border-[#d4af3730]">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Favicon &amp; Web Manifest Studio
          </span>
          <span className="text-xs text-[#71717a] hidden sm:inline">• Edição em Tempo Real com Sliders</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => copyCode(getHeadCode('html'))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#e5e5e5] border border-[#ffffff15] transition cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#d4af37]" />}
            <span className="hidden sm:inline">Copiar</span> <span>&lt;head&gt;</span>
          </button>

          <button
            type="button"
            onClick={downloadSinglePng}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#f9e79f] border border-[#d4af3730] transition cursor-pointer"
            title="Baixar imagem PNG de alta resolução 512x512"
          >
            <Download className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>PNG 512px</span>
          </button>

          <button
            type="button"
            onClick={generateZipPackage}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#d4af37] hover:bg-[#f9e79f] text-black shadow-md shadow-[#d4af3720] transition cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Gerando ({exportProgress}%)...</span>
              </>
            ) : (
              <>
                <FolderArchive className="w-3.5 h-3.5 text-black" />
                <span>Baixar Pacote .ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Controls (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#14161b] border border-[#ffffff10]">
            <button
              type="button"
              onClick={() => setActiveTab('design')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'design'
                  ? 'bg-[#d4af37] text-black shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#1f2228]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Design &amp; Sliders</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manifest')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'manifest'
                  ? 'bg-[#d4af37] text-black shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#1f2228]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>PWA Manifest</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-[#d4af37] text-black shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#1f2228]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Código &lt;head&gt;</span>
            </button>
          </div>

          {/* Tab 1: Design & Resizing Controls */}
          {activeTab === 'design' && (
            <div className="space-y-5">
              {/* Section 1: Source Type Selector */}
              <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10]">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono uppercase text-[#d4af37] font-bold">
                    1. Fonte do Favicon
                  </label>
                  <span className="text-[11px] text-[#71717a]">Emoji, texto ou logo enviada</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConfig((p) => ({ ...p, sourceType: 'emoji' }))}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      config.sourceType === 'emoji'
                        ? 'bg-[#d4af3715] border-[#d4af37] text-white shadow-sm'
                        : 'bg-[#181a20] border-[#ffffff10] text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    <Smile className="w-5 h-5 text-[#d4af37]" />
                    <span>Emoji</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig((p) => ({ ...p, sourceType: 'text' }))}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      config.sourceType === 'text'
                        ? 'bg-[#d4af3715] border-[#d4af37] text-white shadow-sm'
                        : 'bg-[#181a20] border-[#ffffff10] text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    <Type className="w-5 h-5 text-[#d4af37]" />
                    <span>Texto / Monograma</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((p) => ({ ...p, sourceType: 'image' }));
                      fileInputRef.current?.click();
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      config.sourceType === 'image'
                        ? 'bg-[#d4af3715] border-[#d4af37] text-white shadow-sm'
                        : 'bg-[#181a20] border-[#ffffff10] text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    <Upload className="w-5 h-5 text-[#d4af37]" />
                    <span>Upload Logo</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.svg"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Sub-inputs based on source */}
                {config.sourceType === 'emoji' && (
                  <div className="mt-4 pt-4 border-t border-[#ffffff10]">
                    <label className="text-xs text-[#a1a1aa] block mb-2">Digite seu emoji ou clique em um popular:</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={config.emoji}
                        onChange={(e) => setConfig((p) => ({ ...p, emoji: e.target.value }))}
                        className="w-14 h-12 text-2xl text-center rounded-xl bg-[#181a20] border border-[#ffffff20] text-white focus:border-[#d4af37] outline-none"
                      />
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {POPULAR_EMOJIS.map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => setConfig((p) => ({ ...p, emoji: em }))}
                            className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition cursor-pointer ${
                              config.emoji === em
                                ? 'bg-[#d4af3730] border border-[#d4af37] scale-105'
                                : 'bg-[#1a1c22] hover:bg-[#252830]'
                            }`}
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {config.sourceType === 'text' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#ffffff10]">
                    <div>
                      <label className="text-xs text-[#a1a1aa] block mb-1">Letra ou Sigla (1-2 caracteres):</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={config.text}
                        onChange={(e) => setConfig((p) => ({ ...p, text: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-white focus:border-[#d4af37] outline-none font-bold text-center text-lg uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#a1a1aa] block mb-1">Cor da Tipografia:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.textColor}
                          onChange={(e) => setConfig((p) => ({ ...p, textColor: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.textColor}
                          onChange={(e) => setConfig((p) => ({ ...p, textColor: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs text-white uppercase font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {config.sourceType === 'image' && (
                  <div className="mt-4 pt-4 border-t border-[#ffffff10] space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#181a20] border border-[#ffffff10]">
                      <div className="flex items-center gap-3">
                        {config.imageUrl ? (
                          <img src={config.imageUrl} alt="Uploaded Logo" className="w-10 h-10 rounded-lg object-contain bg-black/40 p-1 border border-white/10" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-[#71717a]" />
                        )}
                        <div>
                          <div className="text-xs font-semibold text-white truncate max-w-[180px]">
                            {config.imageFileName || 'Nenhuma imagem selecionada'}
                          </div>
                          <div className="text-[10px] text-[#71717a]">Formatos: PNG, SVG, JPG, WebP</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#252830] hover:bg-[#323640] text-xs font-semibold text-white transition cursor-pointer"
                      >
                        Substituir Logo
                      </button>
                    </div>

                    {/* Image Fit Mode */}
                    <div>
                      <label className="text-xs text-[#a1a1aa] block mb-1.5">Enquadramento da Imagem:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'contain', label: 'Conter (Sem Cortar)' },
                          { id: 'cover', label: 'Preencher (Cover)' },
                          { id: 'fill', label: 'Esticar (Fill)' },
                        ].map((fit) => (
                          <button
                            key={fit.id}
                            type="button"
                            onClick={() => setConfig((p) => ({ ...p, imageFit: fit.id as any }))}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              config.imageFit === fit.id
                                ? 'bg-[#d4af37] text-black font-bold'
                                : 'bg-[#181a20] border border-white/10 text-[#a1a1aa] hover:text-white'
                            }`}
                          >
                            {fit.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Precise Sliders for Scale and Repositioning */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#161820] to-[#121418] border border-[#d4af37]/40 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#d4af37]" />
                    <label className="text-xs font-mono uppercase text-[#d4af37] font-bold">
                      2. Sliders de Escala &amp; Reposicionamento
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={resetAllDimensions}
                    className="flex items-center gap-1 text-[11px] text-[#a1a1aa] hover:text-[#f9e79f] transition cursor-pointer"
                    title="Redefinir escala e posições para padrão"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Redefinir</span>
                  </button>
                </div>

                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Use os controles deslizantes abaixo para redimensionar e posicionar o elemento perfeitamente em tempo real.
                </p>

                {/* Slider 1: Scale (Zoom) */}
                <div className="p-3.5 rounded-xl bg-[#0e1014] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <ZoomIn className="w-3.5 h-3.5 text-[#d4af37]" />
                      Escala do Elemento (Zoom):
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#f9e79f] font-bold bg-[#d4af37]/15 px-2.5 py-0.5 rounded border border-[#d4af37]/30 text-xs">
                        {config.scale}%
                      </span>
                      <button
                        type="button"
                        onClick={resetScale}
                        className="text-[10px] text-[#a1a1aa] hover:text-white underline cursor-pointer"
                      >
                        100%
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, scale: Math.max(15, p.scale - 5) }))}
                      className="w-7 h-7 rounded-lg bg-[#20232c] hover:bg-[#2e3340] text-xs font-bold flex items-center justify-center cursor-pointer text-white shrink-0"
                      title="Diminuir 5%"
                    >
                      -5%
                    </button>
                    <input
                      type="range"
                      min={20}
                      max={220}
                      step={1}
                      value={config.scale}
                      onChange={(e) => setConfig((p) => ({ ...p, scale: Number(e.target.value) }))}
                      className="flex-1 accent-[#d4af37] cursor-pointer h-2 bg-[#20232c] rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, scale: Math.min(250, p.scale + 5) }))}
                      className="w-7 h-7 rounded-lg bg-[#20232c] hover:bg-[#2e3340] text-xs font-bold flex items-center justify-center cursor-pointer text-white shrink-0"
                      title="Aumentar 5%"
                    >
                      +5%
                    </button>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                    {[50, 70, 85, 100, 115, 130, 150, 180].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setConfig((p) => ({ ...p, scale: s }))}
                        className={`px-2 py-1 rounded-md text-[10px] font-mono transition cursor-pointer ${
                          config.scale === s
                            ? 'bg-[#d4af37] text-black font-bold'
                            : 'bg-[#181a22] text-[#a1a1aa] hover:text-white border border-white/5'
                        }`}
                      >
                        {s}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider 2: Horizontal Position (X) */}
                <div className="p-3.5 rounded-xl bg-[#0e1014] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      Posição Horizontal (Eixo X):
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#f9e79f] font-bold bg-[#d4af37]/15 px-2 py-0.5 rounded border border-[#d4af37]/30 text-xs">
                        {config.offsetX > 0 ? `+${config.offsetX}%` : `${config.offsetX}%`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setConfig((p) => ({ ...p, offsetX: 0 }))}
                        className="text-[10px] text-[#a1a1aa] hover:text-white underline cursor-pointer"
                      >
                        Centro
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, offsetX: Math.max(-50, p.offsetX - 2) }))}
                      className="w-7 h-7 rounded-lg bg-[#20232c] hover:bg-[#2e3340] text-xs font-bold flex items-center justify-center cursor-pointer text-white shrink-0"
                      title="Mover para a esquerda"
                    >
                      ◀
                    </button>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      step={1}
                      value={config.offsetX}
                      onChange={(e) => setConfig((p) => ({ ...p, offsetX: Number(e.target.value) }))}
                      className="flex-1 accent-[#d4af37] cursor-pointer h-2 bg-[#20232c] rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, offsetX: Math.min(50, p.offsetX + 2) }))}
                      className="w-7 h-7 rounded-lg bg-[#20232c] hover:bg-[#2e3340] text-xs font-bold flex items-center justify-center cursor-pointer text-white shrink-0"
                      title="Mover para a direita"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Slider 3: Vertical Position (Y) */}
                <div className="p-3.5 rounded-xl bg-[#0e1014] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      Posição Vertical (Eixo Y):
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#f9e79f] font-bold bg-[#d4af37]/15 px-2 py-0.5 rounded border border-[#d4af37]/30 text-xs">
                        {config.offsetY > 0 ? `+${config.offsetY}%` : `${config.offsetY}%`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setConfig((p) => ({ ...p, offsetY: 0 }))}
                        className="text-[10px] text-[#a1a1aa] hover:text-white underline cursor-pointer"
                      >
                        Centro
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, offsetY: Math.max(-50, p.offsetY - 2) }))}
                      className="w-7 h-7 rounded-lg bg-[#20232c] hover:bg-[#2e3340] text-xs font-bold flex items-center justify-center cursor-pointer text-white shrink-0"
                      title="Mover para cima"
                    >
                      ▲
                    </button>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      step={1}
                      value={config.offsetY}
                      onChange={(e) => setConfig((p) => ({ ...p, offsetY: Number(e.target.value) }))}
                      className="flex-1 accent-[#d4af37] cursor-pointer h-2 bg-[#20232c] rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, offsetY: Math.min(50, p.offsetY + 2) }))}
                      className="w-7 h-7 rounded-lg bg-[#20232c] hover:bg-[#2e3340] text-xs font-bold flex items-center justify-center cursor-pointer text-white shrink-0"
                      title="Mover para baixo"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* Slider 4: Rotation & Opacity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#0e1014] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#a1a1aa]">Rotação:</span>
                      <span className="font-mono text-white text-[11px]">{config.rotation}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        step={1}
                        value={config.rotation}
                        onChange={(e) => setConfig((p) => ({ ...p, rotation: Number(e.target.value) }))}
                        className="w-full accent-[#d4af37] cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setConfig((p) => ({ ...p, rotation: 0 }))}
                        className="px-2 py-0.5 rounded bg-[#20232c] hover:bg-[#2e3340] text-[10px] font-mono text-white cursor-pointer"
                        title="Zerar rotação"
                      >
                        0°
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1014] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#a1a1aa]">Opacidade:</span>
                      <span className="font-mono text-white text-[11px]">{config.opacity ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={config.opacity ?? 100}
                      onChange={(e) => setConfig((p) => ({ ...p, opacity: Number(e.target.value) }))}
                      className="w-full accent-[#d4af37] cursor-pointer"
                    />
                  </div>
                </div>

                {/* One-click Center Button */}
                <div className="flex items-center justify-center pt-2">
                  <button
                    type="button"
                    onClick={resetPosition}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e212b] hover:bg-[#d4af37] hover:text-black text-[#f9e79f] font-semibold text-xs border border-[#d4af37]/30 transition cursor-pointer shadow-sm"
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>Centralizar Elemento (X: 0, Y: 0)</span>
                  </button>
                </div>
              </div>

              {/* Section 3: Frame Shape, Colors and Background */}
              <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-4">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
                  3. Moldura &amp; Fundo do Favicon
                </label>

                {/* Shape selection */}
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-2">Formato da Moldura:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['squircle', 'rounded', 'circle', 'square'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setConfig((p) => ({ ...p, shape: s }))}
                        className={`py-2 px-2 rounded-xl border text-xs font-semibold capitalize transition cursor-pointer ${
                          config.shape === s
                            ? 'bg-[#d4af3715] border-[#d4af37] text-white shadow-sm'
                            : 'bg-[#181a20] border-[#ffffff10] text-[#a1a1aa] hover:text-white'
                        }`}
                      >
                        {s === 'squircle' ? 'Squircle (iOS)' : s === 'rounded' ? 'Arredondado' : s === 'circle' ? 'Círculo' : 'Quadrado'}
                      </button>
                    ))}
                  </div>
                </div>

                {config.shape === 'rounded' && (
                  <div>
                    <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                      <span>Raio das Bordas:</span>
                      <span className="font-mono text-white">{config.borderRadiusPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={config.borderRadiusPercent}
                      onChange={(e) => setConfig((p) => ({ ...p, borderRadiusPercent: Number(e.target.value) }))}
                      className="w-full accent-[#d4af37] cursor-pointer"
                    />
                  </div>
                )}

                {/* Padding */}
                <div>
                  <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                    <span>Espaçamento Interno (Padding da Moldura):</span>
                    <span className="font-mono text-white">{config.paddingPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={config.paddingPercent}
                    onChange={(e) => setConfig((p) => ({ ...p, paddingPercent: Number(e.target.value) }))}
                    className="w-full accent-[#d4af37] cursor-pointer"
                  />
                </div>

                {/* Background Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-[#a1a1aa] block mb-1">Cor Primária de Fundo:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.bgColor}
                        onChange={(e) => setConfig((p) => ({ ...p, bgColor: e.target.value }))}
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={config.bgColor}
                        onChange={(e) => setConfig((p) => ({ ...p, bgColor: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs text-white uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-[#a1a1aa]">Gradiente Final:</label>
                      <label className="text-[10px] text-[#71717a] flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.useGradient}
                          onChange={(e) => setConfig((p) => ({ ...p, useGradient: e.target.checked }))}
                          className="accent-[#d4af37]"
                        />
                        Ativar
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        disabled={!config.useGradient}
                        value={config.bgGradientEnd || '#1e1b4b'}
                        onChange={(e) => setConfig((p) => ({ ...p, bgGradientEnd: e.target.value }))}
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 disabled:opacity-40"
                      />
                      <input
                        type="text"
                        disabled={!config.useGradient}
                        value={config.bgGradientEnd || '#1e1b4b'}
                        onChange={(e) => setConfig((p) => ({ ...p, bgGradientEnd: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs text-white uppercase font-mono disabled:opacity-40"
                      />
                    </div>
                  </div>
                </div>

                {/* Popular Palette Quick Pick */}
                <div>
                  <span className="text-[11px] text-[#71717a] block mb-1.5">Paleta Rápida para Fundo:</span>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setConfig((p) => ({ ...p, bgColor: c }))}
                        style={{ backgroundColor: c }}
                        className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition cursor-pointer shadow-sm"
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: PWA Web Manifest Editor */}
          {activeTab === 'manifest' && (
            <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-bold">
                  Configurações do site.webmanifest
                </label>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  PWA Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Nome do Aplicativo:</label>
                  <input
                    type="text"
                    value={manifest.name}
                    onChange={(e) => setManifest((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Nome Curto (Abaixo do Ícone):</label>
                  <input
                    type="text"
                    value={manifest.shortName}
                    onChange={(e) => setManifest((p) => ({ ...p, shortName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1">Descrição do App:</label>
                <input
                  type="text"
                  value={manifest.description}
                  onChange={(e) => setManifest((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Modo de Exibição:</label>
                  <select
                    value={manifest.display}
                    onChange={(e) => setManifest((p) => ({ ...p, display: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs text-white focus:border-[#d4af37] outline-none"
                  >
                    <option value="standalone">Standalone (App Nativo)</option>
                    <option value="fullscreen">Fullscreen (Tela Cheia)</option>
                    <option value="minimal-ui">Minimal UI</option>
                    <option value="browser">Browser Normal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Cor do Tema (Barra do Sistema):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={manifest.themeColor}
                      onChange={(e) => setManifest((p) => ({ ...p, themeColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={manifest.themeColor}
                      onChange={(e) => setManifest((p) => ({ ...p, themeColor: e.target.value }))}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#181a20] border border-white/20 text-xs font-mono text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Cor de Fundo da Splash Screen:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={manifest.backgroundColor}
                      onChange={(e) => setManifest((p) => ({ ...p, backgroundColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={manifest.backgroundColor}
                      onChange={(e) => setManifest((p) => ({ ...p, backgroundColor: e.target.value }))}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#181a20] border border-white/20 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1.5">JSON Preview (site.webmanifest):</label>
                <pre className="p-3 rounded-xl bg-[#090a0d] border border-[#ffffff10] text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48">
                  {JSON.stringify(
                    {
                      name: manifest.name,
                      short_name: manifest.shortName,
                      description: manifest.description,
                      start_url: manifest.startUrl,
                      display: manifest.display,
                      theme_color: manifest.themeColor,
                      background_color: manifest.backgroundColor,
                      icons: [
                        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
                        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
                      ],
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 3: Code Snippets (<head> HTML, Next.js, Astro) */}
          {activeTab === 'code' && (
            <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-4">
              <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
                Códigos de Integração para &lt;head&gt;
              </label>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#a1a1aa]">Padrão HTML5 (index.html):</span>
                  <button
                    type="button"
                    onClick={() => copyCode(getHeadCode('html'))}
                    className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#090a0d] border border-[#ffffff10] text-[11px] font-mono text-[#f9e79f] overflow-x-auto">
                  {getHeadCode('html')}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#a1a1aa]">Next.js (App Router / metadata):</span>
                  <button
                    type="button"
                    onClick={() => copyCode(getHeadCode('nextjs'))}
                    className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#090a0d] border border-[#ffffff10] text-[11px] font-mono text-cyan-300 overflow-x-auto">
                  {getHeadCode('nextjs')}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#a1a1aa]">Astro Framework:</span>
                  <button
                    type="button"
                    onClick={() => copyCode(getHeadCode('astro'))}
                    className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#090a0d] border border-[#ffffff10] text-[11px] font-mono text-amber-300 overflow-x-auto">
                  {getHeadCode('astro')}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live High-Resolution Preview & Export (6 cols) - Sticky when scrolling */}
        <div className="lg:col-span-6 lg:sticky lg:top-20 self-start flex flex-col gap-5 z-10">
          <div className="p-6 rounded-2xl bg-[#121418] border border-[#ffffff10] flex flex-col shadow-2xl max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#d4af37] font-bold">
                  Visualização em Tempo Real
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>

              {/* Toggle Guides */}
              <button
                type="button"
                onClick={() => setShowCenterGuides((v) => !v)}
                className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  showCenterGuides
                    ? 'bg-[#d4af3715] text-[#f9e79f] border-[#d4af3740]'
                    : 'bg-[#181a20] text-[#71717a] border-white/10'
                }`}
                title="Ativar/desativar linhas guias centrais"
              >
                <Crosshair className="w-3 h-3" />
                <span>Guias</span>
              </button>
            </div>

            {/* Sub-view switcher: Principal Preview vs All Sizes vs Browser Mockup */}
            <div className="flex items-center gap-1.5 mb-4 p-1 rounded-xl bg-[#0a0a0d] border border-white/10">
              <button
                type="button"
                onClick={() => setPreviewTab('preview')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  previewTab === 'preview'
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Preview Principal</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('sizes')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  previewTab === 'sizes'
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Todas as Resoluções</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('mockup')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  previewTab === 'mockup'
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Simulador de Navegador</span>
              </button>
            </div>

            {/* TAB CONTENT: Principal Live Preview (512x512 HD Canvas) */}
            {previewTab === 'preview' && (
              <div className="flex flex-col items-center">
                {/* Visual Canvas Display Box - Smooth and Crisp */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 rounded-2xl p-2 bg-[#0c0d12] border-2 border-[#ffffff15] shadow-2xl overflow-hidden flex items-center justify-center">
                  {/* Clean Canvas Rendered Live via Sliders */}
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain rounded-xl"
                  />

                  {/* Optional Center Crosshair Guides */}
                  {showCenterGuides && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="absolute w-full h-[1px] bg-[#d4af37]/25" />
                      <div className="absolute h-full w-[1px] bg-[#d4af37]/25" />
                      <div className="w-12 h-12 rounded-full border border-dashed border-[#d4af37]/35" />
                    </div>
                  )}

                  {/* Status Overlay Pill */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-[#f9e79f] border border-white/10 pointer-events-none">
                    Zoom: {config.scale}% · X: {config.offsetX}% · Y: {config.offsetY}%
                  </div>
                </div>

                <div className="text-center text-xs text-[#a1a1aa] mt-2">
                  Use os <span className="text-[#f9e79f] font-semibold">sliders de escala e posição</span> ao lado para ajustar milimetricamente.
                </div>

                {/* Direct Action Buttons under canvas */}
                <div className="grid grid-cols-2 gap-3 w-full mt-5 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={downloadSinglePng}
                    className="py-2.5 px-3 rounded-xl bg-[#1a1c24] hover:bg-[#252834] text-white font-semibold text-xs border border-white/15 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Baixar PNG 512×512</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadSingleIco}
                    className="py-2.5 px-3 rounded-xl bg-[#1a1c24] hover:bg-[#252834] text-white font-semibold text-xs border border-white/15 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Baixar favicon.ico</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Multi-sizes Grid */}
            {previewTab === 'sizes' && (
              <div className="space-y-4 my-2">
                <div className="text-xs text-[#a1a1aa] mb-2">
                  Renderização exata em todas as resoluções oficiais geradas no pacote:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: '16×16 px', desc: 'Aba de Navegador Antigo', displaySize: 'w-4 h-4' },
                    { label: '32×32 px', desc: 'Padrão Retina / Moderno', displaySize: 'w-8 h-8' },
                    { label: '48×48 px', desc: 'Atalhos Windows / Favoritos', displaySize: 'w-12 h-12' },
                    { label: '180×180 px', desc: 'Apple Touch (iOS / iPad)', displaySize: 'w-16 h-16' },
                    { label: '192×192 px', desc: 'Android Chrome PWA', displaySize: 'w-16 h-16' },
                    { label: '512×512 px', desc: 'Splash Screen PWA HD', displaySize: 'w-20 h-20' },
                  ].map((res) => (
                    <div
                      key={res.label}
                      className="p-3 rounded-xl bg-[#0e1015] border border-white/10 flex flex-col items-center justify-between gap-2 text-center"
                    >
                      <div className="text-[11px] font-mono text-[#f9e79f] font-bold">{res.label}</div>
                      <div className="p-2 bg-black/40 rounded-lg flex items-center justify-center min-h-[72px]">
                        {liveDataUrl ? (
                          <img
                            src={liveDataUrl}
                            alt={res.label}
                            className={`${res.displaySize} object-contain rounded drop-shadow-md`}
                          />
                        ) : (
                          <div className={`${res.displaySize} bg-[#1a1c22] rounded animate-pulse`} />
                        )}
                      </div>
                      <span className="text-[10px] text-[#71717a] font-mono">{res.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Realistic Mockups (Browser Tab & Mobile) */}
            {previewTab === 'mockup' && (
              <div className="space-y-4 my-2">
                {/* 1. Chrome Tab Simulation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] text-[#a1a1aa] uppercase tracking-wider font-mono">
                      1. Aba do Google Chrome
                    </label>
                    <div className="flex items-center gap-1 bg-[#181a20] p-0.5 rounded-lg border border-white/10 text-xs">
                      <button
                        type="button"
                        onClick={() => setBrowserTheme('dark')}
                        className={`p-1 rounded ${browserTheme === 'dark' ? 'bg-[#2b2d35] text-white' : 'text-[#71717a]'}`}
                        title="Dark Mode"
                      >
                        <Moon className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBrowserTheme('light')}
                        className={`p-1 rounded ${browserTheme === 'light' ? 'bg-white text-black' : 'text-[#71717a]'}`}
                        title="Light Mode"
                      >
                        <Sun className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className={`rounded-xl border p-2 overflow-hidden shadow-lg transition-colors ${
                    browserTheme === 'dark'
                      ? 'bg-[#1e1f22] border-white/15'
                      : 'bg-[#dee1e6] border-[#c0c4cc]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs max-w-[220px] truncate shadow-sm transition-colors ${
                        browserTheme === 'dark'
                          ? 'bg-[#2b2d30] text-white border-t border-white/15'
                          : 'bg-white text-slate-900 border-t border-slate-300'
                      }`}>
                        {liveDataUrl ? (
                          <img src={liveDataUrl} alt="Favicon" className="w-4 h-4 rounded-sm shrink-0 object-contain" />
                        ) : (
                          <div className="w-4 h-4 rounded-sm bg-amber-500 shrink-0" />
                        )}
                        <span className="truncate font-medium">{manifest.shortName || 'Meu Site'}</span>
                        <span className="ml-auto text-[10px] opacity-60">✕</span>
                      </div>
                      <span className={`text-xs ml-2 font-mono ${browserTheme === 'dark' ? 'text-zinc-500' : 'text-slate-600'}`}>+</span>
                    </div>
                  </div>
                </div>

                {/* 2. Mobile Home Screen Simulation */}
                <div>
                  <label className="text-[11px] text-[#a1a1aa] uppercase tracking-wider block mb-2 font-mono">
                    2. Ícone na Tela Inicial (iPhone / Android)
                  </label>
                  <div className="p-4 rounded-xl bg-gradient-to-b from-[#181a20] to-[#0d0e12] border border-[#ffffff10] flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden shrink-0 bg-black/40 border border-white/10">
                      {liveDataUrl ? (
                        <img src={liveDataUrl} alt="App Icon" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{manifest.shortName || 'MeuApp'}</div>
                      <div className="text-xs text-[#71717a] line-clamp-1">{manifest.description}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Pronto para PWA &amp; Web Store</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Package Contents Summary */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#0d0e12] border border-[#ffffff10] text-xs">
              <div className="font-bold text-[#f9e79f] mb-2 flex items-center gap-1.5">
                <FolderArchive className="w-3.5 h-3.5" />
                Arquivos Inclusos no Pacote .ZIP:
              </div>
              <ul className="grid grid-cols-2 gap-1 text-[#a1a1aa] font-mono text-[10px]">
                <li>• <span className="text-white">favicon.ico</span> (16×16, 32×32)</li>
                <li>• <span className="text-white">apple-touch-icon.png</span> (180×180)</li>
                <li>• <span className="text-white">android-192x192.png</span></li>
                <li>• <span className="text-white">android-512x512.png</span></li>
                <li>• <span className="text-white">site.webmanifest</span> (PWA)</li>
                <li>• <span className="text-white">browserconfig.xml</span> &amp; HTML</li>
              </ul>
            </div>

            {/* Main ZIP Download CTA */}
            <button
              type="button"
              onClick={generateZipPackage}
              disabled={isExporting}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f9e79f] hover:from-[#c19a2e] hover:to-[#ecd78b] text-black font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-[#d4af3720] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Gerando Pacote ({exportProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-black" />
                  <span>Baixar Pacote Completo de Favicons (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
