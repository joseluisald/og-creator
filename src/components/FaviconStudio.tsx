import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Smile,
  Type,
  Layers,
  Smartphone,
  Globe,
  Monitor,
  RefreshCw,
  Sliders,
  Settings2,
  FileCode,
  FolderArchive,
  Eye,
  Info,
  CheckCircle2,
  ExternalLink
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

const POPULAR_EMOJIS = ['⚡', '🚀', '🔥', '💎', '🌟', '🛡️', '🎯', '✨', '💡', '🤖', '💻', '🎨', '📈', '🔒', '🍕', '☕'];
const POPULAR_COLORS = ['#d4af37', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#ec4899', '#06b6d4', '#111827', '#ffffff'];

export const FaviconStudio: React.FC<FaviconStudioProps> = ({
  triggerToast = () => {},
  onNavigate = () => {},
}) => {
  const [config, setConfig] = useState<FaviconConfig>(DEFAULT_CONFIG);
  const [manifest, setManifest] = useState<WebManifestConfig>(DEFAULT_MANIFEST);
  const [activeTab, setActiveTab] = useState<'design' | 'manifest' | 'code' | 'preview'>('design');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Render preview canvas
  useEffect(() => {
    renderCanvasToSize(512);
  }, [config]);

  const renderCanvasToSize = (size: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    ctx.clearRect(0, 0, size, size);

    // Padding & dimensions
    const pad = (config.paddingPercent / 100) * size;
    const drawSize = size - pad * 2;
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

    // Draw border if set
    if (config.borderWidth > 0) {
      ctx.strokeStyle = config.borderColor;
      ctx.lineWidth = (config.borderWidth / 100) * size;
      ctx.stroke();
    }

    // Draw content based on sourceType
    if (config.sourceType === 'emoji') {
      ctx.font = `${drawSize * 0.62}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.emoji || '⚡', size / 2, size / 2 + drawSize * 0.04);
    } else if (config.sourceType === 'text') {
      ctx.fillStyle = config.textColor;
      ctx.font = `bold ${drawSize * 0.58}px ${config.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((config.text || 'W').slice(0, 2), size / 2, size / 2 + drawSize * 0.02);
    } else if (config.sourceType === 'image' && config.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = config.imageUrl;
      if (img.complete) {
        ctx.drawImage(img, x, y, drawSize, drawSize);
      }
    }

    ctx.restore();

    // Copy to main preview canvas if size == 512
    if (size === 512 && canvasRef.current) {
      const mainCtx = canvasRef.current.getContext('2d');
      if (mainCtx) {
        canvasRef.current.width = 512;
        canvasRef.current.height = 512;
        mainCtx.clearRect(0, 0, 512, 512);
        mainCtx.drawImage(canvas, 0, 0);
      }
    }

    return canvas;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setConfig((prev) => ({
          ...prev,
          sourceType: 'image',
          imageUrl: event.target?.result as string,
          imageFileName: file.name,
        }));
        triggerToast(`Imagem "${file.name}" carregada com sucesso!`);
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

      // 2. Also generate standard favicon.ico (32x32 PNG header in ICO fallback)
      const icoCanvas = renderCanvasToSize(32);
      const icoBlob = await getCanvasBlob(icoCanvas);
      folder.file('favicon.ico', icoBlob);

      // 3. Generate site.webmanifest JSON
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

      // 4. Generate browserconfig.xml for IE/Edge
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

      // 5. Generate HTML Snippet instructions
      const htmlSnippet = `<!-- Favicon & App Icons (Coloque dentro da tag <head> do seu site) -->
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

      // Trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'favicon-package.zip';
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

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0c] text-white min-h-[calc(100vh-64px)]">
      {/* Sub-Header Toolbar */}
      <div className="border-b border-[#ffffff10] bg-[#0f1115] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#d4af3715] text-[#f9e79f] border border-[#d4af3730]">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Favicon &amp; Web Manifest Studio
          </span>
          <span className="text-xs text-[#71717a] hidden sm:inline">• Todos os formatos web &amp; PWA</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => copyCode(getHeadCode('html'))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#e5e5e5] border border-[#ffffff15] transition cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#d4af37]" />}
            <span>Copiar Tags &lt;head&gt;</span>
          </button>
          <button
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
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#14161b] border border-[#ffffff10]">
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'design'
                  ? 'bg-[#d4af37] text-black shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#1f2228]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Design do Ícone</span>
            </button>
            <button
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

          {/* Tab 1: Design Controls */}
          {activeTab === 'design' && (
            <div className="space-y-5">
              {/* Source Type Selector */}
              <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10]">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block mb-3">
                  1. Fonte do Favicon
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConfig((p) => ({ ...p, sourceType: 'emoji' }))}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      config.sourceType === 'emoji'
                        ? 'bg-[#d4af3715] border-[#d4af37] text-white'
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
                        ? 'bg-[#d4af3715] border-[#d4af37] text-white'
                        : 'bg-[#181a20] border-[#ffffff10] text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    <Type className="w-5 h-5 text-[#d4af37]" />
                    <span>Texto / Sigla</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((p) => ({ ...p, sourceType: 'image' }));
                      fileInputRef.current?.click();
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      config.sourceType === 'image'
                        ? 'bg-[#d4af3715] border-[#d4af37] text-white'
                        : 'bg-[#181a20] border-[#ffffff10] text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    <Upload className="w-5 h-5 text-[#d4af37]" />
                    <span>Upload Imagem</span>
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
                  <div className="mt-4">
                    <label className="text-xs text-[#a1a1aa] block mb-2">Escolha um emoji ou digite o seu:</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={config.emoji}
                        onChange={(e) => setConfig((p) => ({ ...p, emoji: e.target.value }))}
                        className="w-16 h-12 text-2xl text-center rounded-xl bg-[#181a20] border border-[#ffffff20] text-white focus:border-[#d4af37] outline-none"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_EMOJIS.map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => setConfig((p) => ({ ...p, emoji: em }))}
                            className="w-9 h-9 rounded-lg bg-[#1a1c22] hover:bg-[#252830] text-lg flex items-center justify-center transition cursor-pointer"
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {config.sourceType === 'text' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div>
                      <label className="text-xs text-[#a1a1aa] block mb-1">Texto / Letra (1-2 chars):</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={config.text}
                        onChange={(e) => setConfig((p) => ({ ...p, text: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-white focus:border-[#d4af37] outline-none font-bold text-center text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#a1a1aa] block mb-1">Cor do Texto:</label>
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
                  <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-[#181a20] border border-[#ffffff10]">
                    <div className="flex items-center gap-3">
                      {config.imageUrl ? (
                        <img src={config.imageUrl} alt="Uploaded" className="w-10 h-10 rounded-lg object-contain bg-black/40 p-1" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-[#71717a]" />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-white">{config.imageFileName || 'Nenhuma imagem selecionada'}</div>
                        <div className="text-[10px] text-[#71717a]">Formatos recomendados: PNG transparente ou SVG</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#252830] hover:bg-[#323640] text-xs font-semibold text-white transition cursor-pointer"
                    >
                      Trocar Imagem
                    </button>
                  </div>
                )}
              </div>

              {/* Shape and Appearance */}
              <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-4">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
                  2. Formato &amp; Fundo
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
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold capitalize transition cursor-pointer ${
                          config.shape === s
                            ? 'bg-[#d4af3715] border-[#d4af37] text-white'
                            : 'bg-[#181a20] border-[#ffffff10] text-[#a1a1aa] hover:text-white'
                        }`}
                      >
                        {s === 'squircle' ? 'Squircle (iOS)' : s === 'rounded' ? 'Arredondado' : s === 'circle' ? 'Círculo' : 'Quadrado'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-[#a1a1aa] block mb-1">Cor Primária:</label>
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
                    <label className="text-xs text-[#a1a1aa] block mb-1">Gradiente Final:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.bgGradientEnd || '#000000'}
                        onChange={(e) => setConfig((p) => ({ ...p, bgGradientEnd: e.target.value }))}
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={config.bgGradientEnd || '#000000'}
                        onChange={(e) => setConfig((p) => ({ ...p, bgGradientEnd: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs text-white uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Sliders: Padding & Border */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                      <span>Espaçamento Interno (Padding):</span>
                      <span className="font-mono text-white">{config.paddingPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={35}
                      value={config.paddingPercent}
                      onChange={(e) => setConfig((p) => ({ ...p, paddingPercent: Number(e.target.value) }))}
                      className="w-full accent-[#d4af37]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                      <span>Borda do Ícone:</span>
                      <span className="font-mono text-white">{config.borderWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      value={config.borderWidth}
                      onChange={(e) => setConfig((p) => ({ ...p, borderWidth: Number(e.target.value) }))}
                      className="w-full accent-[#d4af37]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: PWA Web Manifest */}
          {activeTab === 'manifest' && (
            <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-bold">
                  Configurações do site.webmanifest
                </label>
                <span className="text-[11px] text-[#71717a]">Necessário para instalação PWA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="text-xs text-[#a1a1aa] block mb-1">Nome Curto (Tela Inicial):</label>
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
                    <option value="standalone">Standalone (App)</option>
                    <option value="fullscreen">Fullscreen</option>
                    <option value="minimal-ui">Minimal UI</option>
                    <option value="browser">Browser Normal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Theme Color:</label>
                  <input
                    type="color"
                    value={manifest.themeColor}
                    onChange={(e) => setManifest((p) => ({ ...p, themeColor: e.target.value }))}
                    className="w-full h-9 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Background Color:</label>
                  <input
                    type="color"
                    value={manifest.backgroundColor}
                    onChange={(e) => setManifest((p) => ({ ...p, backgroundColor: e.target.value }))}
                    className="w-full h-9 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: HTML Head Code Snippet */}
          {activeTab === 'code' && (
            <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-bold">
                  Código HTML para o &lt;head&gt;
                </label>
                <button
                  onClick={() => copyCode(getHeadCode('html'))}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#252830] hover:bg-[#323640] text-white transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#d4af37]" />}
                  <span>Copiar</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#090a0d] border border-[#ffffff10] text-xs font-mono text-[#a1a1aa] overflow-x-auto leading-relaxed">
                <code>{getHeadCode('html')}</code>
              </pre>

              <div className="flex items-center gap-2 text-xs text-[#71717a] pt-1">
                <Info className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Coloque os arquivos gerados na pasta <code className="text-[#f9e79f]">public/</code> do seu projeto.</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Previews (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Main High-Res Canvas (Hidden but rendered) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Live Preview Card */}
          <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-[#d4af37] font-bold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Pré-visualização em Tempo Real
              </span>
              <span className="text-[11px] text-[#71717a]">512×512 HD</span>
            </div>

            {/* 1. Browser Tab Preview */}
            <div className="mb-5">
              <label className="text-[11px] text-[#a1a1aa] uppercase tracking-wider block mb-2 font-mono">
                1. Aba do Google Chrome (Dark Mode)
              </label>
              <div className="rounded-xl bg-[#1a1c22] border border-[#ffffff15] p-2 overflow-hidden shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b2d35] text-xs text-white max-w-[200px] truncate shadow-sm border-t border-[#ffffff20]">
                    {/* Render mini icon */}
                    <div className="w-4 h-4 rounded shrink-0 overflow-hidden flex items-center justify-center bg-black/40 text-[10px]">
                      {config.sourceType === 'emoji' ? config.emoji : config.sourceType === 'text' ? config.text : '⚡'}
                    </div>
                    <span className="truncate font-medium">{manifest.shortName || 'Meu Site'}</span>
                    <span className="text-[#71717a] ml-auto text-[10px]">✕</span>
                  </div>
                  <span className="text-xs text-[#71717a] ml-2 font-mono">+</span>
                </div>
              </div>
            </div>

            {/* 2. Mobile Home Screen / iPhone Preview */}
            <div className="mb-5">
              <label className="text-[11px] text-[#a1a1aa] uppercase tracking-wider block mb-2 font-mono">
                2. Ícone na Tela Inicial (iPhone / Android)
              </label>
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#181a20] to-[#0d0e12] border border-[#ffffff10] flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden shrink-0"
                  style={{
                    backgroundColor: config.bgColor,
                    background: config.useGradient ? `linear-gradient(135deg, ${config.bgColor}, ${config.bgGradientEnd})` : config.bgColor,
                    borderRadius: config.shape === 'circle' ? '50%' : config.shape === 'rounded' ? '12px' : '16px',
                  }}
                >
                  {config.sourceType === 'emoji' && <span className="text-3xl">{config.emoji}</span>}
                  {config.sourceType === 'text' && <span className="text-2xl font-bold" style={{ color: config.textColor }}>{config.text}</span>}
                  {config.sourceType === 'image' && config.imageUrl && (
                    <img src={config.imageUrl} alt="Icon" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{manifest.shortName || 'MeuApp'}</div>
                  <div className="text-xs text-[#71717a] line-clamp-1">{manifest.description}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">✓ Pronto para PWA</div>
                </div>
              </div>
            </div>

            {/* 3. Package Contents Summary */}
            <div className="p-3.5 rounded-xl bg-[#0d0e12] border border-[#ffffff10] text-xs">
              <div className="font-bold text-[#f9e79f] mb-2 flex items-center gap-1.5">
                <FolderArchive className="w-3.5 h-3.5" />
                Arquivos Inclusos no Pacote .ZIP:
              </div>
              <ul className="space-y-1 text-[#a1a1aa] font-mono text-[11px]">
                <li>• <span className="text-white">favicon.ico</span> (16×16, 32×32, 48×48)</li>
                <li>• <span className="text-white">apple-touch-icon.png</span> (180×180 para iOS)</li>
                <li>• <span className="text-white">android-chrome-192x192.png</span></li>
                <li>• <span className="text-white">android-chrome-512x512.png</span></li>
                <li>• <span className="text-white">site.webmanifest</span> (Configuração PWA)</li>
                <li>• <span className="text-white">browserconfig.xml</span> &amp; HTML Snippet</li>
              </ul>
            </div>

            <button
              onClick={generateZipPackage}
              disabled={isExporting}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f9e79f] hover:from-[#c19a2e] hover:to-[#ecd78b] text-black font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-[#d4af3720] flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Baixar Pacote Completo de Favicons</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
