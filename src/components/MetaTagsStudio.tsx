import React, { useState, useMemo } from 'react';
import {
  Code2,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe,
  Share2,
  Twitter,
  FileCode,
  Sparkles,
  Download,
  RotateCcw,
  Sliders,
  Layers,
  Search,
  Eye,
  BookmarkCheck,
  Info,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Laptop,
  MessageSquare,
  Facebook,
  Linkedin,
  MessageCircle,
  Hash,
  Tag,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { FrameworkType, MetaTagsConfig, OgType, SchemaType, TwitterCardType } from '../types';
import { AdBanner } from './AdBanner';
import {
  INITIAL_METATAGS_CONFIG,
  auditSeoConfig,
  generateMetaCode,
  generateSchemaJsonLd,
  SeoIssue,
} from '../utils/metaTagsGenerator';

interface MetaTagsStudioProps {
  initialConfig?: MetaTagsConfig;
  currentOgCanvasImage?: string;
  currentOgTitle?: string;
  currentOgSubtitle?: string;
  onNavigateToOgStudio?: () => void;
  triggerToast?: (msg: string) => void;
}

export const MetaTagsStudio: React.FC<MetaTagsStudioProps> = ({
  initialConfig,
  currentOgCanvasImage,
  currentOgTitle,
  currentOgSubtitle,
  onNavigateToOgStudio,
  triggerToast,
}) => {
  const [config, setConfig] = useState<MetaTagsConfig>(() => {
    try {
      const saved = localStorage.getItem('mmserver_metatags_saved_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialConfig || INITIAL_METATAGS_CONFIG;
  });

  const [activeConfigTab, setActiveConfigTab] = useState<
    'basic' | 'og' | 'twitter' | 'schema' | 'robots' | 'icons'
  >('basic');

  const [activeOutputTab, setActiveOutputTab] = useState<'code' | 'preview' | 'audit'>('code');
  const [selectedFramework, setSelectedFramework] = useState<FrameworkType>('html');
  const [previewPlatform, setPreviewPlatform] = useState<
    'google-desktop' | 'google-mobile' | 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'discord'
  >('google-desktop');

  const [copied, setCopied] = useState(false);

  // Update helper
  const updateConfig = (updated: Partial<MetaTagsConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('mmserver_metatags_saved_config', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // SEO Audit Calculation
  const audit = useMemo(() => auditSeoConfig(config), [config]);

  // Code Generation
  const generatedCode = useMemo(
    () => generateMetaCode(config, selectedFramework),
    [config, selectedFramework]
  );

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      if (triggerToast) triggerToast('Código de tags copiado com sucesso!');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const handleDownloadCode = () => {
    let extension = 'html';
    let mime = 'text/html';
    let filename = 'meta-tags.html';

    if (selectedFramework === 'nextjs-app') {
      extension = 'ts';
      mime = 'text/typescript';
      filename = 'metadata.ts';
    } else if (selectedFramework === 'nextjs-pages') {
      extension = 'tsx';
      mime = 'text/typescript';
      filename = 'HeadMeta.tsx';
    } else if (selectedFramework === 'astro') {
      extension = 'astro';
      mime = 'text/plain';
      filename = 'SeoHead.astro';
    } else if (selectedFramework === 'nuxt') {
      extension = 'ts';
      mime = 'text/typescript';
      filename = 'useSeo.ts';
    } else if (selectedFramework === 'sveltekit') {
      extension = 'svelte';
      mime = 'text/plain';
      filename = '+page.svelte';
    } else if (selectedFramework === 'remix') {
      extension = 'ts';
      mime = 'text/typescript';
      filename = 'meta.ts';
    } else if (selectedFramework === 'wordpress') {
      extension = 'php';
      mime = 'text/x-php';
      filename = 'seo-tags.php';
    } else if (selectedFramework === 'jsonld') {
      extension = 'json';
      mime = 'application/json';
      filename = 'schema-structured-data.json';
    }

    const blob = new Blob([generatedCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (triggerToast) triggerToast(`Arquivo "${filename}" baixado com sucesso!`);
  };

  const handleImportFromOgStudio = () => {
    const updates: Partial<MetaTagsConfig> = {};
    if (currentOgTitle) {
      updates.pageTitle = currentOgTitle;
      updates.ogTitle = currentOgTitle;
      updates.twitterTitle = currentOgTitle;
    }
    if (currentOgSubtitle) {
      updates.metaDescription = currentOgSubtitle;
      updates.ogDescription = currentOgSubtitle;
      updates.twitterDescription = currentOgSubtitle;
    }
    if (currentOgCanvasImage) {
      // If user generated an image preview
      updates.ogImageUrl = currentOgCanvasImage;
      updates.twitterImage = currentOgCanvasImage;
    }
    updateConfig(updates);
    if (triggerToast) {
      triggerToast('Dados do Gerador de OG Image importados com sucesso!');
    }
  };

  const handleApplyPreset = (type: 'saas' | 'blog' | 'ecommerce' | 'portfolio') => {
    if (type === 'saas') {
      updateConfig({
        pageTitle: 'Nexus AI — Plataforma Inteligente de Automação e Análise',
        metaDescription: 'Acelere o crescimento do seu negócio com fluxos de trabalho impulsionados por Inteligência Artificial de última geração.',
        canonicalUrl: 'https://nexusai.com.br',
        ogType: 'website',
        ogTitle: 'Nexus AI — Automação Inteligente para Negócios',
        ogDescription: 'Acelere seu negócio com fluxos de trabalho impulsionados por IA de ponta.',
        ogSiteName: 'Nexus AI',
        twitterCard: 'summary_large_image',
        schemaType: 'SoftwareApplication',
        keywords: 'inteligencia artificial, automacao, saas, b2b, produtividade',
      });
      if (triggerToast) triggerToast('Preset "SaaS / Software" aplicado!');
    } else if (type === 'blog') {
      updateConfig({
        pageTitle: 'Guia Definitivo de SEO Técnico e Open Graph para 2026',
        metaDescription: 'Aprenda como estruturar tags HTML, cartões sociais e dados estruturados Schema.org para dominar os resultados de busca.',
        canonicalUrl: 'https://meublog.com.br/posts/guia-seo-2026',
        ogType: 'article',
        articleSection: 'Tecnologia & Web',
        articleAuthor: 'Especialista em SEO',
        articlePublishedTime: new Date().toISOString(),
        ogTitle: 'Guia Definitivo de SEO Técnico e Open Graph para 2026',
        ogDescription: 'Aprenda como estruturar tags HTML, cartões sociais e Schema.org.',
        ogSiteName: 'Tech Blog Brasil',
        twitterCard: 'summary_large_image',
        schemaType: 'Article',
        keywords: 'seo, open graph, meta tags, nextjs, marketing digital',
      });
      if (triggerToast) triggerToast('Preset "Artigo / Blog Post" aplicado!');
    } else if (type === 'ecommerce') {
      updateConfig({
        pageTitle: 'Cadeira Ergonômica Pro Studio Max — Conforto Premium',
        metaDescription: 'Compre a cadeira ergonômica Pro Studio Max com regulagem 4D, suporte lombar dinâmico e entrega rápida em todo o Brasil.',
        canonicalUrl: 'https://loja.com.br/produto/cadeira-pro-studio-max',
        ogType: 'product',
        productPrice: '1299.90',
        productCurrency: 'BRL',
        productAvailability: 'in stock',
        ogTitle: 'Cadeira Ergonômica Pro Studio Max — Conforto Premium',
        ogDescription: 'A melhor cadeira ergonômica para programadores e criadores.',
        ogSiteName: 'ErgoStore',
        twitterCard: 'summary_large_image',
        schemaType: 'Product',
        keywords: 'cadeira ergonomica, home office, postura, escritorio',
      });
      if (triggerToast) triggerToast('Preset "E-commerce / Produto" aplicado!');
    } else if (type === 'portfolio') {
      updateConfig({
        pageTitle: 'Carlos Oliveira — Tech Lead & Arquiteto de Software',
        metaDescription: 'Portfólio profissional de Carlos Oliveira: especializado em arquitetura full-stack, computação em nuvem e produtos digitais.',
        canonicalUrl: 'https://carlosoliveira.dev',
        ogType: 'profile',
        ogTitle: 'Carlos Oliveira — Tech Lead & Arquiteto de Software',
        ogDescription: 'Especializado em arquitetura full-stack e produtos escaláveis.',
        ogSiteName: 'Carlos Oliveira Dev',
        twitterCard: 'summary_large_image',
        schemaType: 'Organization',
        keywords: 'desenvolvedor full stack, tech lead, react, nodejs, typescript',
      });
      if (triggerToast) triggerToast('Preset "Portfólio / Perfil" aplicado!');
    }
  };

  const handleReset = () => {
    setConfig(INITIAL_METATAGS_CONFIG);
    localStorage.removeItem('mmserver_metatags_saved_config');
    if (triggerToast) triggerToast('Tags restauradas para o padrão inicial.');
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Ad Slot */}
      <AdBanner format="leaderboard" slotId="metatags-top-leaderboard" />

      {/* Top Banner / Sub-App Toolbar */}
      <div className="px-6 py-4 border-b border-[#ffffff10] bg-[#121418]/90 backdrop-blur-md sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#f9e79f]/10 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-md shadow-[#d4af3715]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#f9e79f] tracking-wide font-['Cormorant_Garamond',serif] italic">
                Suíte de Meta Tags, Social Cards &amp; SEO
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#d4af37]/15 text-[#f9e79f] border border-[#d4af37]/30">
                PRO v2.0
              </span>
            </div>
            <p className="text-xs text-[#71717a]">
              Gerador completo para HTML5, Next.js, Astro, Nuxt, SvelteKit, Remix e Schema.org
            </p>
          </div>
        </div>

        {/* Quick Actions & Sync */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Presets */}
          <div className="hidden lg:flex items-center gap-1 bg-[#1a1c20] p-1 rounded-2xl border border-[#ffffff10]">
            <span className="text-[11px] font-semibold text-[#71717a] px-2">Presets:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('saas')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-medium text-[#a1a1aa] hover:text-[#f9e79f] hover:bg-[#27272a] transition cursor-pointer"
            >
              SaaS
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('blog')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-medium text-[#a1a1aa] hover:text-[#f9e79f] hover:bg-[#27272a] transition cursor-pointer"
            >
              Artigo
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('ecommerce')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-medium text-[#a1a1aa] hover:text-[#f9e79f] hover:bg-[#27272a] transition cursor-pointer"
            >
              E-commerce
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('portfolio')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-medium text-[#a1a1aa] hover:text-[#f9e79f] hover:bg-[#27272a] transition cursor-pointer"
            >
              Portfólio
            </button>
          </div>

          {/* Sync from OG Studio Button */}
          <button
            type="button"
            onClick={handleImportFromOgStudio}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#f9e79f] border border-[#d4af37]/40 hover:border-[#d4af37] transition cursor-pointer shadow-sm shadow-[#d4af3715]"
            title="Importa o título, descrição e a imagem atualmente gerada no estúdio visual de OG"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Puxar do OG Studio</span>
          </button>

          {/* Download button */}
          <button
            type="button"
            onClick={handleDownloadCode}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#1a1c20] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#e5e5e5] border border-[#ffffff15] transition cursor-pointer"
            title="Baixar arquivo de código pronto"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar Arquivo</span>
          </button>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopyCode}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'bg-[#d4af37] hover:bg-[#c19a2e] text-black shadow-md shadow-[#d4af3725]'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Tags</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Comprehensive Meta Tags Configurator (7 cols) */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-4">
          {/* Config Navigation Tabs */}
          <div className="bg-[#121418] p-1.5 rounded-2xl border border-[#ffffff10] flex flex-wrap gap-1">
            {(
              [
                { id: 'basic', label: '1. Geral & SEO', icon: Globe },
                { id: 'og', label: '2. Open Graph', icon: Share2 },
                { id: 'twitter', label: '3. Twitter/X Cards', icon: Twitter },
                { id: 'schema', label: '4. Schema JSON-LD', icon: Code2 },
                { id: 'robots', label: '5. Robots & Index', icon: ShieldAlert },
                { id: 'icons', label: '6. Favicons & PWA', icon: Smartphone },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeConfigTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveConfigTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af3720]'
                      : 'text-[#a1a1aa] hover:text-[#e5e5e5] hover:bg-[#1a1c20]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Config Panels */}
          <div className="bg-[#121418] border border-[#ffffff10] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
            {/* TAB 1: BASIC & SEO */}
            {activeConfigTab === 'basic' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#ffffff10]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#e5e5e5] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#d4af37]" />
                      Metadados Principais On-Page
                    </h3>
                    <p className="text-xs text-[#71717a]">
                      Fundamentais para a indexação no Google, Bing e navegadores
                    </p>
                  </div>
                </div>

                {/* Page Title */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                      Título da Página (&lt;title&gt;)
                    </label>
                    <span
                      className={`text-[11px] font-mono font-medium ${
                        config.pageTitle.length >= 45 && config.pageTitle.length <= 60
                          ? 'text-emerald-400'
                          : config.pageTitle.length > 60
                          ? 'text-amber-400'
                          : 'text-[#71717a]'
                      }`}
                    >
                      {config.pageTitle.length} / 60 caracteres
                    </span>
                  </div>
                  <input
                    type="text"
                    value={config.pageTitle}
                    onChange={(e) => updateConfig({ pageTitle: e.target.value })}
                    placeholder="Ex: Minha Empresa — Soluções Tecnológicas Modernas"
                    className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                  />
                  <div className="w-full bg-[#1a1c20] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        config.pageTitle.length > 65
                          ? 'bg-amber-400'
                          : config.pageTitle.length >= 45
                          ? 'bg-emerald-400'
                          : 'bg-[#d4af37]'
                      }`}
                      style={{ width: `${Math.min(100, (config.pageTitle.length / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                      Meta Description (Resumo)
                    </label>
                    <span
                      className={`text-[11px] font-mono font-medium ${
                        config.metaDescription.length >= 120 && config.metaDescription.length <= 160
                          ? 'text-emerald-400'
                          : config.metaDescription.length > 160
                          ? 'text-amber-400'
                          : 'text-[#71717a]'
                      }`}
                    >
                      {config.metaDescription.length} / 160 caracteres
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={config.metaDescription}
                    onChange={(e) => updateConfig({ metaDescription: e.target.value })}
                    placeholder="Descrição atraente e persuasiva sobre o conteúdo da sua página..."
                    className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none resize-none"
                  />
                  <div className="w-full bg-[#1a1c20] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        config.metaDescription.length > 160
                          ? 'bg-amber-400'
                          : config.metaDescription.length >= 120
                          ? 'bg-emerald-400'
                          : 'bg-[#d4af37]'
                      }`}
                      style={{ width: `${Math.min(100, (config.metaDescription.length / 160) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Canonical URL */}
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    URL Canônica (Canonical URL)
                  </label>
                  <input
                    type="url"
                    value={config.canonicalUrl}
                    onChange={(e) => updateConfig({ canonicalUrl: e.target.value })}
                    placeholder="https://meusite.com.br/pagina"
                    className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    Palavras-Chave (Keywords)
                  </label>
                  <input
                    type="text"
                    value={config.keywords}
                    onChange={(e) => updateConfig({ keywords: e.target.value })}
                    placeholder="tecnologia, saas, design, marketing digital, web"
                    className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#71717a] mt-1">
                    Separe os termos por vírgula.
                  </p>
                </div>

                {/* Author & Publisher */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Autor / Criador
                    </label>
                    <input
                      type="text"
                      value={config.author}
                      onChange={(e) => updateConfig({ author: e.target.value })}
                      placeholder="Nome do Autor ou Equipe"
                      className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Publisher / Empresa
                    </label>
                    <input
                      type="text"
                      value={config.publisher}
                      onChange={(e) => updateConfig({ publisher: e.target.value })}
                      placeholder="Nome da Empresa"
                      className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Language & Theme Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Idioma do HTML (lang)
                    </label>
                    <select
                      value={config.language}
                      onChange={(e) => updateConfig({ language: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    >
                      <option value="pt-BR">Português (pt-BR)</option>
                      <option value="pt-PT">Português (pt-PT)</option>
                      <option value="en-US">Inglês (en-US)</option>
                      <option value="es-ES">Espanhol (es-ES)</option>
                      <option value="fr-FR">Francês (fr-FR)</option>
                      <option value="de-DE">Alemão (de-DE)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Theme Color (Mobile Chrome)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.themeColor}
                        onChange={(e) => updateConfig({ themeColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border border-[#ffffff20] bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.themeColor}
                        onChange={(e) => updateConfig({ themeColor: e.target.value })}
                        className="flex-1 px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: OPEN GRAPH */}
            {activeConfigTab === 'og' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#ffffff10]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#e5e5e5] flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#d4af37]" />
                      Open Graph Protocol (Facebook, WhatsApp, LinkedIn)
                    </h3>
                    <p className="text-xs text-[#71717a]">
                      Define a apresentação visual nos compartilhamentos sociais
                    </p>
                  </div>
                </div>

                {/* OG Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    Tipo de Conteúdo (og:type)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {(
                      [
                        { id: 'website', label: 'Website' },
                        { id: 'article', label: 'Artigo' },
                        { id: 'product', label: 'Produto' },
                        { id: 'profile', label: 'Perfil' },
                        { id: 'video.other', label: 'Vídeo' },
                        { id: 'book', label: 'Livro' },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateConfig({ ogType: t.id as OgType })}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition cursor-pointer ${
                          config.ogType === t.id
                            ? 'bg-[#d4af37] text-black shadow-sm'
                            : 'bg-[#16181d] text-[#a1a1aa] hover:bg-[#1a1c20] hover:text-[#e5e5e5]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* OG Image URL */}
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    URL Absoluta da Imagem (og:image) — Recomendado: 1200×630
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={config.ogImageUrl}
                      onChange={(e) => updateConfig({ ogImageUrl: e.target.value })}
                      placeholder="https://meusite.com.br/og-image.png"
                      className="flex-1 px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                    />
                    {currentOgCanvasImage && (
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig({
                            ogImageUrl: currentOgCanvasImage,
                            twitterImage: currentOgCanvasImage,
                          })
                        }
                        className="px-3 py-2 bg-[#1a1c20] hover:bg-[#27272a] text-[#f9e79f] border border-[#d4af37]/40 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer"
                        title="Usar arte atualmente montada no OG Studio"
                      >
                        Usar Imagem do Studio
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-[#71717a] mt-1">
                    ⚠️ Redes sociais exigem uma URL absoluta começando com <code>https://</code>.
                  </p>
                </div>

                {/* OG Title & Description Override */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Título Social (og:title)
                    </label>
                    <input
                      type="text"
                      value={config.ogTitle}
                      onChange={(e) => updateConfig({ ogTitle: e.target.value })}
                      placeholder="Título específico para redes sociais"
                      className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Descrição Social (og:description)
                    </label>
                    <textarea
                      rows={2}
                      value={config.ogDescription}
                      onChange={(e) => updateConfig({ ogDescription: e.target.value })}
                      placeholder="Descrição customizada para os cards sociais..."
                      className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Site Name & Locale */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Nome do Site (og:site_name)
                    </label>
                    <input
                      type="text"
                      value={config.ogSiteName}
                      onChange={(e) => updateConfig({ ogSiteName: e.target.value })}
                      placeholder="Ex: Minha Empresa"
                      className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Localidade (og:locale)
                    </label>
                    <input
                      type="text"
                      value={config.ogLocale}
                      onChange={(e) => updateConfig({ ogLocale: e.target.value })}
                      placeholder="pt_BR ou en_US"
                      className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Conditional Fields: Article */}
                {config.ogType === 'article' && (
                  <div className="p-4 bg-[#16181d] rounded-2xl border border-[#ffffff10] space-y-3">
                    <h4 className="text-xs font-semibold text-[#f9e79f] uppercase tracking-wider">
                      Metadados Específicos para Artigos (article:*)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#a1a1aa] mb-1">
                          Autor do Artigo
                        </label>
                        <input
                          type="text"
                          value={config.articleAuthor || ''}
                          onChange={(e) => updateConfig({ articleAuthor: e.target.value })}
                          placeholder="Ex: Carlos Silva"
                          className="w-full px-3 py-2 bg-[#0f1115] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#a1a1aa] mb-1">
                          Seção / Categoria
                        </label>
                        <input
                          type="text"
                          value={config.articleSection || ''}
                          onChange={(e) => updateConfig({ articleSection: e.target.value })}
                          placeholder="Ex: Tecnologia"
                          className="w-full px-3 py-2 bg-[#0f1115] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Fields: Product */}
                {config.ogType === 'product' && (
                  <div className="p-4 bg-[#16181d] rounded-2xl border border-[#ffffff10] space-y-3">
                    <h4 className="text-xs font-semibold text-[#f9e79f] uppercase tracking-wider">
                      Metadados Específicos para Produtos (product:*)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#a1a1aa] mb-1">Preço</label>
                        <input
                          type="text"
                          value={config.productPrice || ''}
                          onChange={(e) => updateConfig({ productPrice: e.target.value })}
                          placeholder="99.90"
                          className="w-full px-3 py-2 bg-[#0f1115] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#a1a1aa] mb-1">Moeda</label>
                        <input
                          type="text"
                          value={config.productCurrency || 'BRL'}
                          onChange={(e) => updateConfig({ productCurrency: e.target.value })}
                          placeholder="BRL, USD, EUR"
                          className="w-full px-3 py-2 bg-[#0f1115] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#a1a1aa] mb-1">
                          Disponibilidade
                        </label>
                        <select
                          value={config.productAvailability || 'in stock'}
                          onChange={(e) =>
                            updateConfig({
                              productAvailability: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 bg-[#0f1115] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                        >
                          <option value="in stock">Em Estoque</option>
                          <option value="out of stock">Esgotado</option>
                          <option value="preorder">Pré-venda</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: TWITTER / X CARDS */}
            {activeConfigTab === 'twitter' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#ffffff10]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#e5e5e5] flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-[#d4af37]" />
                      Twitter / X Cards
                    </h3>
                    <p className="text-xs text-[#71717a]">
                      Configuração avançada para pré-visualização de tweets com imagem ampla
                    </p>
                  </div>
                </div>

                {/* Twitter Card Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    Modelo do Card (twitter:card)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { id: 'summary_large_image', label: 'Imagem Grande (1200×630)' },
                        { id: 'summary', label: 'Card Quadrado Simples' },
                        { id: 'app', label: 'App Card' },
                        { id: 'player', label: 'Player Vídeo' },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateConfig({ twitterCard: t.id as TwitterCardType })}
                        className={`p-2.5 text-center rounded-xl text-xs font-semibold transition cursor-pointer ${
                          config.twitterCard === t.id
                            ? 'bg-[#d4af37] text-black shadow-sm'
                            : 'bg-[#16181d] text-[#a1a1aa] hover:bg-[#1a1c20] hover:text-[#e5e5e5]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Twitter Handles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Conta do Site / Marca (twitter:site)
                    </label>
                    <input
                      type="text"
                      value={config.twitterSite}
                      onChange={(e) => updateConfig({ twitterSite: e.target.value })}
                      placeholder="@empresa"
                      className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                      Autor / Criador (twitter:creator)
                    </label>
                    <input
                      type="text"
                      value={config.twitterCreator}
                      onChange={(e) => updateConfig({ twitterCreator: e.target.value })}
                      placeholder="@autor"
                      className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Twitter Image */}
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    Imagem do Twitter (twitter:image)
                  </label>
                  <input
                    type="url"
                    value={config.twitterImage}
                    onChange={(e) => updateConfig({ twitterImage: e.target.value })}
                    placeholder="https://meusite.com.br/og-image.png"
                    className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#71717a] mt-1">
                    Geralmente a mesma imagem do Open Graph (1200×630).
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: SCHEMA.ORG / JSON-LD */}
            {activeConfigTab === 'schema' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#ffffff10]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#e5e5e5] flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#d4af37]" />
                      Dados Estruturados Schema.org (JSON-LD)
                    </h3>
                    <p className="text-xs text-[#71717a]">
                      Gera snippets ricos nos resultados de busca do Google (Rich Results)
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enableSchema}
                      onChange={(e) => updateConfig({ enableSchema: e.target.checked })}
                      className="rounded bg-[#1a1a1a] border-[#ffffff20] text-[#d4af37] focus:ring-[#d4af3720] accent-[#d4af37]"
                    />
                    <span className="text-xs text-[#e5e5e5] font-semibold">Ativar Schema</span>
                  </label>
                </div>

                {config.enableSchema ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                        Tipo de Entidade Schema (@type)
                      </label>
                      <select
                        value={config.schemaType}
                        onChange={(e) => updateConfig({ schemaType: e.target.value as SchemaType })}
                        className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                      >
                        <option value="WebSite">WebSite (Site Institucional / Busca)</option>
                        <option value="Organization">Organization (Empresa / Marca)</option>
                        <option value="Article">Article (Artigo / Notícia)</option>
                        <option value="BlogPosting">BlogPosting (Post de Blog)</option>
                        <option value="Product">Product (Produto E-commerce)</option>
                        <option value="SoftwareApplication">SoftwareApplication (SaaS / App)</option>
                        <option value="LocalBusiness">LocalBusiness (Negócio Local)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                          Nome da Organização
                        </label>
                        <input
                          type="text"
                          value={config.schemaOrgName}
                          onChange={(e) => updateConfig({ schemaOrgName: e.target.value })}
                          placeholder="Minha Empresa"
                          className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                          URL do Logo Oficial
                        </label>
                        <input
                          type="url"
                          value={config.schemaOrgLogo}
                          onChange={(e) => updateConfig({ schemaOrgLogo: e.target.value })}
                          placeholder="https://meusite.com.br/logo.png"
                          className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                        Redes Sociais Oficiais (sameAs)
                      </label>
                      <input
                        type="text"
                        value={config.schemaSocialLinks}
                        onChange={(e) => updateConfig({ schemaSocialLinks: e.target.value })}
                        placeholder="https://twitter.com/empresa, https://linkedin.com/company/empresa"
                        className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                      />
                      <p className="text-[10px] text-[#71717a] mt-1">
                        Links dos perfis verificados da empresa para o Painel de Conhecimento do Google.
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-[#71717a] italic p-4 bg-[#16181d] rounded-2xl">
                    Ative a opção acima para incluir marcações de dados estruturados JSON-LD.
                  </p>
                )}
              </div>
            )}

            {/* TAB 5: ROBOTS & INDEX */}
            {activeConfigTab === 'robots' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#ffffff10]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#e5e5e5] flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#d4af37]" />
                      Diretrizes de Robôs e Rastreamento (Meta Robots)
                    </h3>
                    <p className="text-xs text-[#71717a]">
                      Controla como motores de busca indexam e exibem snippets desta página
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => updateConfig({ robotsIndex: !config.robotsIndex })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      config.robotsIndex
                        ? 'bg-[#16181d] border-emerald-500/40 text-emerald-300'
                        : 'bg-[#16181d] border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Indexar Página (index)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#000000]/40">
                        {config.robotsIndex ? 'INDEX' : 'NOINDEX'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] mt-1">
                      {config.robotsIndex
                        ? 'Permite que o Google adicione a página aos resultados de busca.'
                        : 'Impede o Google de exibir esta página no buscador.'}
                    </p>
                  </div>

                  <div
                    onClick={() => updateConfig({ robotsFollow: !config.robotsFollow })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      config.robotsFollow
                        ? 'bg-[#16181d] border-emerald-500/40 text-emerald-300'
                        : 'bg-[#16181d] border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Seguir Links (follow)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#000000]/40">
                        {config.robotsFollow ? 'FOLLOW' : 'NOFOLLOW'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] mt-1">
                      {config.robotsFollow
                        ? 'Transmite autoridade de link (PageRank) para links internos e externos.'
                        : 'Não transmite autoridade de link para as URLs da página.'}
                    </p>
                  </div>
                </div>

                {/* Advanced snippet directives */}
                <div className="p-4 bg-[#16181d] rounded-2xl border border-[#ffffff10] space-y-3">
                  <h4 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                    Diretivas Avançadas de Imagem e Snippet
                  </h4>
                  <div>
                    <label className="block text-[11px] text-[#a1a1aa] mb-1">
                      max-image-preview (Tamanho de imagem no Google Discover / Search)
                    </label>
                    <select
                      value={config.robotsMaxImagePreview}
                      onChange={(e) =>
                        updateConfig({
                          robotsMaxImagePreview: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#0f1115] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    >
                      <option value="large">large (Recomendado para imagens de alta resolução)</option>
                      <option value="standard">standard (Tamanho padrão)</option>
                      <option value="none">none (Nenhuma imagem em miniatura)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#a1a1aa]">
                      <input
                        type="checkbox"
                        checked={config.robotsNoArchive}
                        onChange={(e) => updateConfig({ robotsNoArchive: e.target.checked })}
                        className="rounded bg-[#1a1a1a] border-[#ffffff20] text-[#d4af37] focus:ring-[#d4af3720] accent-[#d4af37]"
                      />
                      <span>noarchive (Não salvar cópia em cache)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#a1a1aa]">
                      <input
                        type="checkbox"
                        checked={config.robotsNoSnippet}
                        onChange={(e) => updateConfig({ robotsNoSnippet: e.target.checked })}
                        className="rounded bg-[#1a1a1a] border-[#ffffff20] text-[#d4af37] focus:ring-[#d4af3720] accent-[#d4af37]"
                      />
                      <span>nosnippet (Não exibir trecho de texto)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: FAVICONS & PWA */}
            {activeConfigTab === 'icons' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#ffffff10]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#e5e5e5] flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#d4af37]" />
                      Favicons, Ícones de Aplicativo &amp; Web Manifest
                    </h3>
                    <p className="text-xs text-[#71717a]">
                      Ícones para abas do navegador, favoritos e tela inicial de smartphones
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    Favicon (.ico ou .svg / .png)
                  </label>
                  <input
                    type="url"
                    value={config.faviconUrl}
                    onChange={(e) => updateConfig({ faviconUrl: e.target.value })}
                    placeholder="https://meusite.com.br/favicon.ico"
                    className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    Apple Touch Icon (180×180 para iPhone / iPad)
                  </label>
                  <input
                    type="url"
                    value={config.appleTouchIconUrl}
                    onChange={(e) => updateConfig({ appleTouchIconUrl: e.target.value })}
                    placeholder="https://meusite.com.br/apple-touch-icon.png"
                    className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    Web App Manifest (manifest.json)
                  </label>
                  <input
                    type="url"
                    value={config.manifestUrl}
                    onChange={(e) => updateConfig({ manifestUrl: e.target.value })}
                    placeholder="https://meusite.com.br/manifest.json"
                    className="w-full px-3.5 py-2.5 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs font-mono text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Reset Button */}
            <div className="pt-2 border-t border-[#ffffff10] flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#e5e5e5] transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Valores Iniciais</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Code Generator, Live Visual Previews & SEO Auditor (6 cols) */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-4">
          {/* Output Mode Switcher */}
          <div className="flex items-center justify-between bg-[#121418] p-1.5 rounded-2xl border border-[#ffffff10]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveOutputTab('code')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeOutputTab === 'code'
                    ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af3720]'
                    : 'text-[#a1a1aa] hover:text-[#e5e5e5]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Código Gerado</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveOutputTab('preview')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeOutputTab === 'preview'
                    ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af3720]'
                    : 'text-[#a1a1aa] hover:text-[#e5e5e5]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Previews Sociais Ao Vivo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveOutputTab('audit')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeOutputTab === 'audit'
                    ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af3720]'
                    : 'text-[#a1a1aa] hover:text-[#e5e5e5]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Auditoria SEO ({audit.score}%)</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 pr-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  audit.score >= 80 ? 'bg-emerald-400' : audit.score >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              />
              <span className="text-[11px] font-mono text-[#a1a1aa]">Score: {audit.score}/100</span>
            </div>
          </div>

          {/* TAB: CODE GENERATION */}
          {activeOutputTab === 'code' && (
            <div className="bg-[#121418] border border-[#ffffff10] rounded-3xl p-5 space-y-4 shadow-xl animate-in fade-in duration-200">
              {/* Framework Pill selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {(
                  [
                    { id: 'html', label: 'HTML5 <head>' },
                    { id: 'nextjs-app', label: 'Next.js App Router' },
                    { id: 'nextjs-pages', label: 'Next.js Pages' },
                    { id: 'astro', label: 'Astro' },
                    { id: 'nuxt', label: 'Nuxt 3' },
                    { id: 'sveltekit', label: 'SvelteKit' },
                    { id: 'remix', label: 'Remix' },
                    { id: 'wordpress', label: 'WordPress (PHP)' },
                    { id: 'jsonld', label: 'Schema JSON-LD' },
                  ] as const
                ).map((fw) => (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => setSelectedFramework(fw.id as FrameworkType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedFramework === fw.id
                        ? 'bg-[#d4af37] text-black shadow-sm'
                        : 'bg-[#16181d] text-[#a1a1aa] hover:text-[#e5e5e5] hover:bg-[#1a1c20]'
                    }`}
                  >
                    {fw.label}
                  </button>
                ))}
              </div>

              {/* Code Box */}
              <div className="relative group">
                <div className="bg-[#090b0e] border border-[#ffffff15] rounded-2xl p-4 overflow-auto max-h-[520px] font-mono text-[11px] leading-relaxed text-[#93c5fd]">
                  <pre className="whitespace-pre">{generatedCode}</pre>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-2 rounded-xl bg-[#16181d]/90 hover:bg-[#27272a] text-[#f9e79f] border border-[#ffffff15] transition cursor-pointer shadow-lg"
                    title="Copiar código"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#16181d]/80 border border-[#ffffff10] flex items-start gap-2.5 text-xs text-[#a1a1aa]">
                <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  Basta colar este código no arquivo de layout ou cabeçalho do seu projeto para ativar metatags de alto impacto.
                </span>
              </div>
            </div>
          )}

          {/* TAB: LIVE PREVIEWS */}
          {activeOutputTab === 'preview' && (
            <div className="bg-[#121418] border border-[#ffffff10] rounded-3xl p-5 space-y-4 shadow-xl animate-in fade-in duration-200">
              {/* Platform selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(
                  [
                    { id: 'google-desktop', label: 'Google Search (Desktop)', icon: Search },
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                    { id: 'facebook', label: 'Facebook', icon: Facebook },
                    { id: 'twitter', label: 'Twitter / X', icon: Twitter },
                    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                    { id: 'discord', label: 'Discord', icon: MessageSquare },
                  ] as const
                ).map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreviewPlatform(p.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        previewPlatform === p.id
                          ? 'bg-[#d4af37] text-black shadow-sm'
                          : 'bg-[#16181d] text-[#a1a1aa] hover:text-[#e5e5e5] hover:bg-[#1a1c20]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Render Selected Platform Mockup */}
              <div className="p-4 bg-[#090b0e] rounded-2xl border border-[#ffffff15] min-h-[350px] flex items-center justify-center">
                {/* 1. Google Desktop Preview */}
                {previewPlatform === 'google-desktop' && (
                  <div className="w-full max-w-xl bg-white text-[#202124] p-5 rounded-2xl shadow-lg font-sans">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-700 font-bold">
                        {config.canonicalUrl.replace('https://', '').slice(0, 1).toUpperCase()}
                      </div>
                      <div className="text-xs text-[#202124] truncate">
                        <span className="font-medium text-[#202124]">
                          {config.ogSiteName || config.canonicalUrl.replace('https://', '')}
                        </span>
                        <span className="text-[#5f6368] block text-[11px] truncate font-mono">
                          {config.canonicalUrl}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug line-clamp-1 mb-1">
                      {config.pageTitle}
                    </h4>

                    <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                      {config.metaDescription}
                    </p>

                    {config.enableSchema && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-3 text-[11px] text-[#70757a]">
                        <span>⭐⭐⭐⭐⭐ 4.9 (128 avaliações)</span>
                        <span>•</span>
                        <span>{config.schemaType}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. WhatsApp Card Preview */}
                {previewPlatform === 'whatsapp' && (
                  <div className="w-full max-w-sm bg-[#0b141a] text-white p-3 rounded-2xl border border-[#ffffff10] font-sans shadow-xl">
                    <div className="bg-[#1f2c34] rounded-xl overflow-hidden border border-[#ffffff10]">
                      <div className="aspect-[16/9] w-full bg-[#111b21] relative overflow-hidden">
                        <img
                          src={config.ogImageUrl}
                          alt={config.ogTitle}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-3 bg-[#1f2c34]">
                        <h4 className="text-xs font-semibold text-[#e9edef] line-clamp-2 leading-snug">
                          {config.ogTitle || config.pageTitle}
                        </h4>
                        <p className="text-[11px] text-[#8696a0] line-clamp-2 mt-1 leading-tight">
                          {config.ogDescription || config.metaDescription}
                        </p>
                        <span className="text-[10px] text-[#8696a0] mt-2 block font-mono">
                          {config.canonicalUrl.replace('https://', '')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Facebook Feed Preview */}
                {previewPlatform === 'facebook' && (
                  <div className="w-full max-w-md bg-[#242526] text-[#e4e6eb] rounded-2xl overflow-hidden border border-[#ffffff15] font-sans shadow-xl">
                    <div className="aspect-[1.91/1] w-full bg-[#18191a] relative overflow-hidden">
                      <img
                        src={config.ogImageUrl}
                        alt={config.ogTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3.5 bg-[#3a3b3c]/60">
                      <span className="text-[10px] text-[#b0b3b8] uppercase tracking-wider block mb-0.5">
                        {config.canonicalUrl.replace('https://', '').split('/')[0]}
                      </span>
                      <h4 className="text-sm font-semibold text-[#e4e6eb] line-clamp-2 leading-snug">
                        {config.ogTitle || config.pageTitle}
                      </h4>
                      <p className="text-xs text-[#b0b3b8] line-clamp-1 mt-1">
                        {config.ogDescription || config.metaDescription}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. Twitter / X Preview */}
                {previewPlatform === 'twitter' && (
                  <div className="w-full max-w-md bg-black text-white rounded-2xl overflow-hidden border border-[#2f3336] font-sans shadow-xl">
                    <div className="aspect-[1.91/1] w-full bg-[#16181c] relative overflow-hidden">
                      <img
                        src={config.twitterImage || config.ogImageUrl}
                        alt={config.twitterTitle}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white/90">
                        {config.canonicalUrl.replace('https://', '').split('/')[0]}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-semibold text-[#e7e9ea] line-clamp-1">
                        {config.twitterTitle || config.ogTitle || config.pageTitle}
                      </h4>
                      <p className="text-[11px] text-[#71767b] line-clamp-2 mt-0.5 leading-snug">
                        {config.twitterDescription || config.ogDescription || config.metaDescription}
                      </p>
                    </div>
                  </div>
                )}

                {/* 5. LinkedIn Preview */}
                {previewPlatform === 'linkedin' && (
                  <div className="w-full max-w-md bg-[#1b1f23] text-white rounded-2xl overflow-hidden border border-[#ffffff15] font-sans shadow-xl">
                    <div className="aspect-[1.91/1] w-full bg-[#000] relative overflow-hidden">
                      <img
                        src={config.ogImageUrl}
                        alt={config.ogTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-[#282c31]">
                      <h4 className="text-xs font-semibold text-white line-clamp-1">
                        {config.ogTitle || config.pageTitle}
                      </h4>
                      <span className="text-[10px] text-[#ffffff90] block mt-1 font-mono">
                        {config.canonicalUrl.replace('https://', '')}
                      </span>
                    </div>
                  </div>
                )}

                {/* 6. Discord Preview */}
                {previewPlatform === 'discord' && (
                  <div className="w-full max-w-md bg-[#2b2d31] text-[#dbdee1] p-4 rounded-xl border-l-4 border-[#5865f2] font-sans shadow-xl">
                    <span className="text-[11px] text-[#949ba4] block font-medium">
                      {config.ogSiteName || 'Site'}
                    </span>
                    <h4 className="text-xs font-bold text-[#00a8fc] hover:underline cursor-pointer mt-0.5">
                      {config.ogTitle || config.pageTitle}
                    </h4>
                    <p className="text-[11px] text-[#dbdee1] mt-1 leading-snug line-clamp-3">
                      {config.ogDescription || config.metaDescription}
                    </p>
                    <div className="mt-2.5 rounded-lg overflow-hidden max-h-[160px] bg-[#1e1f22]">
                      <img
                        src={config.ogImageUrl}
                        alt={config.ogTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SEO AUDIT & VALIDATOR */}
          {activeOutputTab === 'audit' && (
            <div className="bg-[#121418] border border-[#ffffff10] rounded-3xl p-5 space-y-4 shadow-xl animate-in fade-in duration-200">
              {/* Score Header */}
              <div className="p-4 rounded-2xl bg-[#16181d] border border-[#ffffff10] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#e5e5e5]">
                    Diagnóstico de Qualidade das Metatags
                  </h3>
                  <p className="text-xs text-[#71717a]">
                    Verificação em conformidade com as diretrizes do Google e W3C
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-2xl font-bold font-mono ${
                      audit.score >= 80
                        ? 'text-emerald-400'
                        : audit.score >= 60
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {audit.score}%
                  </span>
                  <span className="block text-[10px] text-[#71717a] uppercase font-semibold">
                    {audit.score >= 80 ? 'Excelente' : audit.score >= 60 ? 'Bom' : 'Requer Ajustes'}
                  </span>
                </div>
              </div>

              {/* Issues / Passes List */}
              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                {audit.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                      issue.type === 'error'
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                        : issue.type === 'warning'
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    }`}
                  >
                    {issue.type === 'error' && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    {issue.type === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    {issue.type === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs font-semibold text-white">{issue.title}</h4>
                      <p className="text-[11px] text-[#a1a1aa] mt-0.5 leading-relaxed">
                        {issue.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
