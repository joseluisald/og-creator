import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Code2,
  ShieldAlert,
  Bot,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Lock,
  Layers,
  FileCode,
  Share2,
  Search,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Heart,
  Sliders,
  Terminal,
  ShieldCheck,
  Smile,
  ArrowRightLeft,
  Check,
  HelpCircle,
  ArrowUp,
  LayoutGrid,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { AppSubView } from '../types';

interface LandingPageProps {
  onNavigate: (view: AppSubView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [quickAuditUrl, setQuickAuditUrl] = useState('');

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'seo' | 'security' | 'design'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleShareApp = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Web & SEO Studio - Suíte Grátis para Webmasters',
          text: 'Gere imagens OG, analise sites no Lighthouse, Meta Tags, Robots.txt e llms.txt gratuitamente!',
          url: window.location.origin,
        });
      } else {
        navigator.clipboard.writeText(window.location.origin);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleQuickAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAuditUrl.trim()) {
      onNavigate('serp-simulator');
      return;
    }
    const targetUrl = quickAuditUrl.trim();
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/serp-simulator?q=${encodeURIComponent(targetUrl)}`);
    }
    onNavigate('serp-simulator');
  };

  const SUB_APPS = [
    {
      id: 'serp-simulator' as AppSubView,
      title: 'Simulador de SERP Google & Rich Snippets',
      route: '/serp-simulator',
      category: 'seo' as const,
      categoryLabel: 'SEO & Busca',
      badge: 'Desktop & Mobile',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: Search,
      iconBg: 'from-amber-400 to-orange-500',
      description:
        'Simule e otimize exatamente como seu site aparece nas buscas do Google (Desktop e Mobile). Teste limites de corte em 580px, estrelas de avaliação, preços de produtos e FAQ Accordion.',
      techTags: ['Google 580px', 'Mobile & Desktop', 'CTR Score', 'Rich Snippets', 'Dark/Light'],
      highlights: [
        'Contador de largura de pixels real para título (580px) e descrição (960px)',
        'Simulador visual do Google com alternância Dark Mode e Light Mode',
        'Ativação de Rich Snippets: Estrelas de Avaliação (★★★★★), Preços e FAQ',
        'Diagnóstico de CTR Score com detecção de Power Words e números'
      ],
      cta: 'Simular SERP do Google'
    },
    {
      id: 'favicon-studio' as AppSubView,
      title: 'Favicon & Web Manifest Studio',
      route: '/favicon-studio',
      category: 'design' as const,
      categoryLabel: 'Design & Ativos',
      badge: 'Pacote PWA Completo',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: Smile,
      iconBg: 'from-emerald-400 to-teal-500',
      description:
        'Crie favicons profissionais a partir de emojis, texto ou imagens e gere o pacote completo com favicon.ico, PNGs (16x16 até 512x512), Apple Touch Icon e site.webmanifest para PWA.',
      techTags: ['favicon.ico', 'Apple Touch Icon', 'site.webmanifest', 'ZIP 1-Clique', 'PWA Ready'],
      highlights: [
        'Exportação instantânea de arquivo ZIP com todos os tamanhos oficiais',
        'Editor de site.webmanifest para aplicativos web progressivos (PWA)',
        'Pré-visualização em abas do Chrome e Home Screen de smartphones',
        'Tags HTML <head> prontas para Next.js, Astro e HTML5'
      ],
      cta: 'Criar Favicon & Manifest'
    },
    {
      id: 'security-headers' as AppSubView,
      title: 'Headers HTTP de Segurança',
      route: '/security-headers',
      category: 'security' as const,
      categoryLabel: 'Infra & Segurança',
      badge: 'CSP, HSTS & Grade A+',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      icon: ShieldCheck,
      iconBg: 'from-indigo-400 to-blue-600',
      description:
        'Audite e configure cabeçalhos HTTP de segurança de nível bancário: Content-Security-Policy (CSP), HSTS, X-Frame-Options e X-Content-Type-Options para Nginx, Apache, IIS e Vercel.',
      techTags: ['CSP Level 3', 'HSTS Preload', 'X-Frame-Options', 'Nginx / Apache', 'IIS web.config'],
      highlights: [
        'Auditoria ao vivo de cabeçalhos de segurança com nota de A+ a F',
        'Presets de CSP para SaaS, Bancos, Next.js, GA4 e Google Tag Manager',
        'Geração de código em 1-clique para Nginx, Apache (.htaccess), IIS e Express',
        'Proteção contra XSS, Clickjacking, MIME Sniffing e vazamento de dados'
      ],
      cta: 'Gerar Headers de Segurança'
    },
    {
      id: 'redirects-generator' as AppSubView,
      title: 'Gerador de Redirecionamentos 301',
      route: '/redirects-generator',
      category: 'security' as const,
      categoryLabel: 'Infra & Servidor',
      badge: '301 / 302 & Anti-Leak',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      icon: ArrowRightLeft,
      iconBg: 'from-cyan-400 to-blue-500',
      description:
        'Crie regras de redirecionamento 301/302 individuais ou em massa, padronização canônica (HTTPS, www vs sem www, trailing slash) e bloqueio de bots maliciosos para qualquer servidor web.',
      techTags: ['.htaccess', 'Nginx Conf', 'IIS web.config', 'HTTPS Forçado', 'Lote em Massa'],
      highlights: [
        'Geração para Apache (.htaccess), Nginx, IIS (web.config), Vercel e Cloudflare',
        'Importação em lote de dezenas de URLs via copiar e colar',
        'Regras automáticas de HTTPS e unificação de domínio www vs non-www',
        'Bloqueio de arquivos ocultos (.env, .git) e rotas sensíveis'
      ],
      cta: 'Gerar Redirecionamentos'
    },
    {
      id: 'og-studio' as AppSubView,
      title: 'OG Image Studio',
      route: '/og-studio',
      category: 'design' as const,
      categoryLabel: 'Design & Social',
      badge: 'Canvas 1200×630',
      badgeColor: 'bg-[#d4af37]/15 text-[#f9e79f] border-[#d4af37]/30',
      icon: ImageIcon,
      iconBg: 'from-[#d4af37] to-[#f9e79f]',
      description:
        'Crie banners e imagens Open Graph profissionais (1200x630 px) em alta resolução com presets de gradientes, logos, tags, tipografia fina e download imediato em PNG.',
      techTags: ['1200×630 px', 'WhatsApp / Discord', 'Twitter Card', 'Upload de Logo', 'Download PNG'],
      highlights: [
        'Resolução exata 1200×630 recomendada por Facebook, Twitter e WhatsApp',
        'Controle fino de cores, gradientes dourados, overlays e tipografia de luxo',
        'Upload de logo customizado com ajuste de escala, rotação e opacidade',
        'Auto-renderização em canvas HTML5 com exportação ultrarrápida'
      ],
      cta: 'Abrir OG Studio'
    },
    {
      id: 'meta-tags' as AppSubView,
      title: 'Meta Tags & Schema Studio',
      route: '/meta-tags',
      category: 'seo' as const,
      categoryLabel: 'SEO & Código',
      badge: '9 Frameworks + Schema',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      icon: Code2,
      iconBg: 'from-blue-500 to-indigo-400',
      description:
        'Gerador completo de Meta Tags HTML5, Open Graph, Twitter Cards, WhatsApp/Discord e marcações estruturadas Schema.org / JSON-LD com suporte a 9 frameworks modernos.',
      techTags: ['Schema JSON-LD', 'Next.js Metadata', 'Astro / Nuxt', 'Open Graph', 'Twitter Cards'],
      highlights: [
        'Snippets prontos para Next.js App Router, Astro, Nuxt 3, SvelteKit e HTML5',
        'Simulador visual interativo de Google SERP, Twitter/X Cards e WhatsApp',
        'Gerador de Schema.org: SoftwareApplication, Article, WebSite e FAQPage',
        'Auditoria instantânea de tamanho de título e descrição'
      ],
      cta: 'Gerar Meta Tags'
    },
    {
      id: 'robots-sitemap' as AppSubView,
      title: 'Robots, Sitemap & IA Shield',
      route: '/robots-sitemap',
      category: 'seo' as const,
      categoryLabel: 'SEO & Anti-Scraping',
      badge: 'Robots.txt & Sitemap',
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: ShieldAlert,
      iconBg: 'from-rose-500 to-red-600',
      description:
        'Proteja seu site contra raspagem não autorizada por IAs (GPTBot, ClaudeBot, PerplexityBot), gere Sitemaps XML visuais e configure arquivos de segurança RFC 9116.',
      techTags: ['Anti-IA Scrapers', 'sitemap.xml', 'security.txt', 'Crawler Sim', 'Next.js Route'],
      highlights: [
        'Bloqueio seletivo de 10+ robôs de IA (OpenAI, Anthropic, Google, Meta, ByteDance)',
        'Gerador de sitemap.xml com prioridades (1.0, 0.8) e frequências',
        'Simulador de Crawlers em tempo real: teste se rotas estão bloqueadas',
        'Gerador de security.txt (RFC 9116) e cabeçalhos HTTP recomendados'
      ],
      cta: 'Configurar Robots & Sitemap'
    },
    {
      id: 'llms-txt' as AppSubView,
      title: 'llms.txt & llms-full.txt Studio',
      route: '/llms-txt',
      category: 'seo' as const,
      categoryLabel: 'IA & Contexto',
      badge: 'Padrão Answer.AI',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      icon: Bot,
      iconBg: 'from-purple-500 to-pink-400',
      description:
        'Crie arquivos no padrão oficial Answer.AI / Jeremy Howard para que assistentes de IA (ChatGPT, Claude, Cursor IDE, Copilot, Perplexity) compreendam sua documentação e APIs.',
      techTags: ['/llms.txt', '/llms-full.txt', '.cursorrules', 'Token Estimator', 'Answer.AI Standard'],
      highlights: [
        'Geração de /llms.txt (índice em Markdown) e /llms-full.txt (contexto unificado)',
        'Presets prontos para SaaS, APIs/SDKs de desenvolvedores e Manuais',
        'Exportação de regras para Cursor IDE (.cursorrules) e Next.js Route Handlers',
        'Contador de caracteres e estimativa de tokens para janelas de contexto'
      ],
      cta: 'Criar llms.txt'
    }
  ];

  const filteredApps = SUB_APPS.filter((app) => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    const matchesText =
      app.title.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.route.toLowerCase().includes(query) ||
      app.categoryLabel.toLowerCase().includes(query) ||
      app.techTags.some((tag) => tag.toLowerCase().includes(query)) ||
      app.highlights.some((h) => h.toLowerCase().includes(query));

    return matchesText;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-10 pb-14 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-[#d4af37]/10 via-[#d4af37]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Main Display Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl">
          Tudo o que o seu site precisa para{' '}
          <span className="bg-gradient-to-r from-[#d4af37] via-[#f9e79f] to-[#d4af37] bg-clip-text text-transparent">
            SEO, Redes Sociais &amp; IA
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#a1a1aa] mt-5 max-w-2xl leading-relaxed">
          Audite sites no Google Lighthouse, crie imagens Open Graph perfeitas, gere Meta Tags para 9 frameworks, proteja contra robôs de IA e configure arquivos llms.txt. 
          <span className="text-[#f9e79f] font-medium block mt-1">Direto no seu navegador, 100% gratuito e sem cadastro.</span>
        </p>

        {/* Quick URL Audit Form */}
        <div className="w-full max-w-xl mt-8">
          <form
            onSubmit={handleQuickAuditSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-[#14161b] border border-[#d4af37]/40 shadow-xl shadow-[#d4af3710] focus-within:border-[#d4af37] transition"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 w-full flex-1">
              <Search className="w-4 h-4 text-[#d4af37] shrink-0" />
              <input
                type="text"
                value={quickAuditUrl}
                onChange={(e) => setQuickAuditUrl(e.target.value)}
                placeholder="Simular título ou palavra-chave no Google..."
                className="w-full bg-transparent text-sm text-white placeholder-[#71717a] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#d4af37] hover:bg-[#f9e79f] text-black font-bold text-xs sm:text-sm transition shadow-md shadow-[#d4af3720] cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-black" />
              <span>Simular SERP Google</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-center gap-4 mt-2.5 text-[11px] text-[#71717a]">
            <span>⚡ Testes em tempo real:</span>
            <span className="text-[#a1a1aa]">Corte em Pixels (580px)</span>
            <span>•</span>
            <span className="text-[#a1a1aa]">Mobile &amp; Desktop</span>
            <span>•</span>
            <span className="text-[#a1a1aa]">Avaliações (★★★★★)</span>
            <span>•</span>
            <span className="text-[#a1a1aa]">CTR Booster</span>
          </div>
        </div>

        {/* Main Action Buttons - Luxury Interactive App Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mt-8 w-full max-w-4xl">
          <button
            type="button"
            onClick={() => onNavigate('serp-simulator')}
            className="group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-[#14161f]/90 hover:bg-[#1c202d] border border-amber-500/30 hover:border-amber-400/80 transition-all duration-200 cursor-pointer shadow-md shadow-black/20 hover:shadow-amber-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                580px
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors text-left">
              Simulador SERP
            </span>
            <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors text-left truncate w-full">
              Google Desktop &amp; Mobile
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('favicon-studio')}
            className="group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-[#14161f]/90 hover:bg-[#1c202d] border border-emerald-500/30 hover:border-emerald-400/80 transition-all duration-200 cursor-pointer shadow-md shadow-black/20 hover:shadow-emerald-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Smile className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                PWA
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors text-left">
              Favicon &amp; PWA
            </span>
            <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors text-left truncate w-full">
              .ico, Apple &amp; Manifest ZIP
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('security-headers')}
            className="group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-[#14161f]/90 hover:bg-[#1c202d] border border-indigo-500/30 hover:border-indigo-400/80 transition-all duration-200 cursor-pointer shadow-md shadow-black/20 hover:shadow-indigo-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                CSP
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors text-left">
              Headers HTTP
            </span>
            <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors text-left truncate w-full">
              HSTS &amp; Web.config / Nginx
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('redirects-generator')}
            className="group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-[#14161f]/90 hover:bg-[#1c202d] border border-cyan-500/30 hover:border-cyan-400/80 transition-all duration-200 cursor-pointer shadow-md shadow-black/20 hover:shadow-cyan-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                301
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors text-left">
              Redirecionamentos
            </span>
            <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors text-left truncate w-full">
              .htaccess, Nginx &amp; IIS
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('og-studio')}
            className="group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-[#14161f]/90 hover:bg-[#1c202d] border border-yellow-500/30 hover:border-yellow-400/80 transition-all duration-200 cursor-pointer shadow-md shadow-black/20 hover:shadow-yellow-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                1200×630
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-yellow-300 transition-colors text-left">
              OG Image Studio
            </span>
            <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors text-left truncate w-full">
              Cards para WhatsApp &amp; Twitter
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('meta-tags')}
            className="group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-[#14161f]/90 hover:bg-[#1c202d] border border-blue-500/30 hover:border-blue-400/80 transition-all duration-200 cursor-pointer shadow-md shadow-black/20 hover:shadow-blue-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                Schema
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors text-left">
              Meta Tags &amp; Schema
            </span>
            <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors text-left truncate w-full">
              JSON-LD &amp; 9 Frameworks
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('robots-sitemap')}
            className="group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-[#14161f]/90 hover:bg-[#1c202d] border border-rose-500/30 hover:border-rose-400/80 transition-all duration-200 cursor-pointer shadow-md shadow-black/20 hover:shadow-rose-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                Shield
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-300 transition-colors text-left">
              Robots &amp; Sitemap
            </span>
            <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors text-left truncate w-full">
              Bloqueio de Bots de IA
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('llms-txt')}
            className="group relative flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-[#14161f]/90 hover:bg-[#1c202d] border border-purple-500/30 hover:border-purple-400/80 transition-all duration-200 cursor-pointer shadow-md shadow-black/20 hover:shadow-purple-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                LLMs
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors text-left">
              llms.txt Studio
            </span>
            <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors text-left truncate w-full">
              Índice para IA &amp; Cursor
            </span>
          </button>
        </div>

        {/* Feature Checkpoints */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-10 text-xs text-[#a1a1aa]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
            <span>Zero Login ou Cartão</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
            <span>Processamento 100% no Navegador</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
            <span>Exportação Imediata em 1-Clique</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
            <span>Compatível com Next.js, Astro &amp; Vite</span>
          </div>
        </div>
      </section>

      {/* Sub-Applications Bento Grid */}
      <section id="ferramentas" className="px-4 sm:px-6 py-14 max-w-6xl mx-auto w-full scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
            8 Módulos Integrados · 100% Gratuitos
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1.5 tracking-tight">
            Explore a Suíte Completa de Ferramentas
          </h2>
          <p className="text-sm text-[#a1a1aa] mt-2 max-w-2xl mx-auto">
            Soluções completas e especializadas para SEO técnico, segurança de infraestrutura, imagens otimizadas e compatibilidade com IAs.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-[#101217]/90 border border-[#ffffff15] rounded-2xl p-2.5 sm:p-3 mb-8 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg shadow-black/30">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Todas', count: SUB_APPS.length, icon: LayoutGrid },
              { id: 'seo', label: 'SEO & Buscas', count: SUB_APPS.filter((a) => a.category === 'seo').length, icon: Search },
              { id: 'security', label: 'Infra & Segurança', count: SUB_APPS.filter((a) => a.category === 'security').length, icon: ShieldCheck },
              { id: 'design', label: 'Design & Ativos', count: SUB_APPS.filter((a) => a.category === 'design').length, icon: ImageIcon },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id as typeof selectedCategory)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#e6be44] text-black shadow-md shadow-[#d4af3720]'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#181b24]'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#71717a]'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      isActive ? 'bg-black/20 text-black' : 'bg-[#ffffff10] text-[#71717a]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tecnologia ou recurso..."
              className="w-full bg-[#161822] border border-[#ffffff15] focus:border-[#d4af37] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-[#71717a] font-mono mb-4 px-1">
          <span>
            Exibindo <strong className="text-[#f9e79f]">{filteredApps.length}</strong> de {SUB_APPS.length} ferramentas
          </span>
          {searchTerm && (
            <span>
              Filtro ativo: &quot;<span className="text-white">{searchTerm}</span>&quot;
            </span>
          )}
        </div>

        {/* Grid of Apps */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredApps.map((app) => {
              const IconComponent = app.icon;
              return (
                <div
                  key={app.id}
                  className="bg-gradient-to-b from-[#12141c] to-[#0c0d12] border border-[#ffffff15] hover:border-[#d4af37]/70 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4af3715] group relative overflow-hidden"
                >
                  {/* Subtle Top Glow on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/0 to-transparent group-hover:via-[#d4af37]/80 transition-all duration-300" />

                  <div>
                    {/* Top Row: Category and Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                          {app.categoryLabel}
                        </span>
                        <span className="text-xs font-mono text-[#71717a]">{app.route}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${app.badgeColor}`}>
                        {app.badge}
                      </span>
                    </div>

                    {/* App Header with Icon and Title */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center text-black shadow-lg shadow-black/40 shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#f9e79f] transition-colors leading-snug">
                          {app.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mb-4">
                      {app.description}
                    </p>

                    {/* Tech Tags / Formats Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {app.techTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#161824] border border-[#ffffff10] text-[10px] font-mono text-[#d4d4d8] group-hover:border-[#d4af37]/30 transition"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Highlights Checkpoints */}
                    <div className="space-y-2 mb-6 pt-3 border-t border-[#ffffff10]">
                      {app.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#d4d4d8]">
                          <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <button
                    type="button"
                    onClick={() => onNavigate(app.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#181a24] group-hover:bg-gradient-to-r group-hover:from-[#d4af37] group-hover:to-[#e6be44] group-hover:text-black text-[#f9e79f] font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer border border-[#d4af37]/30 group-hover:border-transparent shadow-md group-hover:shadow-lg group-hover:shadow-[#d4af3720]"
                  >
                    <span>{app.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#12141c] border border-[#ffffff15] rounded-2xl p-10 text-center max-w-md mx-auto my-8">
            <Search className="w-8 h-8 text-[#71717a] mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">Nenhuma ferramenta encontrada</h4>
            <p className="text-xs text-[#a1a1aa] mb-4">
              Não encontramos resultados para &quot;{searchTerm}&quot;. Tente outro termo de busca.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#e6be44] transition cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </section>

      {/* Why Choose Us vs Traditional Paid Tools */}
      <section id="sobre" className="px-4 sm:px-6 py-12 max-w-6xl mx-auto w-full border-t border-[#ffffff10] scroll-mt-20">
        <div className="bg-gradient-to-b from-[#121418] to-[#0d0f12] border border-[#ffffff15] rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
              Totalmente Aberto &amp; Gratuito
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Por que nossa suíte é 100% gratuita?
            </h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2">
              Acreditamos que ferramentas fundamentais de SEO e infraestrutura web não devem ter barreiras de pagamento ou exigir criação de conta. Nos mantemos através de parcerias e patrocínios de empresas de tecnologia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#0a0a0a] border border-[#ffffff10] rounded-2xl p-5 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#d4af37]/15 flex items-center justify-center text-[#f9e79f]">
                <Lock className="w-4 h-4 text-[#d4af37]" />
              </div>
              <h4 className="text-sm font-bold text-white">Privacidade Absoluta</h4>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Suas imagens, dados de SEO e regras de robots são processados no seu navegador. Nada é salvo em servidores externos.
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#ffffff10] rounded-2xl p-5 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-300">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Sem Cadastro ou Bloqueios</h4>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Abra a página e use imediatamente. Não pedimos e-mail, cartão de crédito ou login obrigatório.
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#ffffff10] rounded-2xl p-5 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-300">
                <FileCode className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Código Pronto para Produção</h4>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Exportamos TypeScript e JSX validados para Next.js App Router, Astro, Nuxt e Vite prontos para copiar e colar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-4 sm:px-6 py-12 max-w-4xl mx-auto w-full scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
            Tire Suas Dúvidas
          </span>
          <h3 className="text-2xl font-bold text-white mt-1">Perguntas Frequentes</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Posso usar as imagens e códigos gerados em projetos comerciais?',
              a: 'Sim! 100% dos códigos, meta tags, sitemaps e imagens geradas são seus para utilizar livremente em projetos pessoais ou de clientes comerciais.'
            },
            {
              q: 'Qual o tamanho oficial para imagens Open Graph?',
              a: 'O padrão internacional suportado por Facebook, Twitter/X, LinkedIn e WhatsApp é 1200 × 630 pixels (proporção aproximada de 1.91:1), exatamente o tamanho gerado pelo nosso OG Studio.'
            },
            {
              q: 'O que é o arquivo llms.txt e por que devo tê-lo?',
              a: 'O llms.txt é a nova especificação aberta proposta para permitir que assistentes de IA (como Cursor, Claude Projects e ChatGPT) consumam a documentação da sua empresa de forma limpa, evitando alucinações e respostas incorretas.'
            },
            {
              q: 'Como colocar os arquivos robots.txt e sitemap.xml no meu site?',
              a: 'Basta baixar os arquivos gerados e colocá-los na pasta "public/" do seu projeto (Next.js, Astro, Vite, Laravel, etc.) para que fiquem acessíveis em https://seusite.com/robots.txt e https://seusite.com/sitemap.xml.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-[#121418] border border-[#ffffff10] rounded-xl p-4.5">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <HelpCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{faq.q}</span>
              </div>
              <p className="text-xs text-[#a1a1aa] mt-2 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ffffff15] bg-[#08090c] pt-14 pb-8 px-4 sm:px-6 mt-16 text-xs text-[#71717a]">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          {/* Main Multi-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Column 1: Brand & Philosophy */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#f9e79f] to-[#b38f28] flex items-center justify-center text-black font-bold shadow-md shadow-[#d4af3720]">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  Web &amp; SEO <span className="text-[#d4af37]">Studio</span>
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Suíte completa e profissional de utilitários para webmasters, agências e desenvolvedores. Gere e valide ativos essenciais sem cadastro ou assinaturas.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14161f] border border-emerald-500/20 text-[11px] text-emerald-400 font-medium w-fit">
                <Lock className="w-3.5 h-3.5" />
                <span>Privacidade Total · Zero Armazenamento</span>
              </div>
            </div>

            {/* Column 2: SEO & Indexação */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4af37]">
                SEO &amp; Indexação
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('serp-simulator')}
                    className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition text-left cursor-pointer group bg-transparent border-0 p-0"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Simulador SERP Google</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">580px</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('meta-tags')}
                    className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition text-left cursor-pointer group bg-transparent border-0 p-0"
                  >
                    <Code2 className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>Meta Tags &amp; Schema JSON-LD</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('robots-sitemap')}
                    className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition text-left cursor-pointer group bg-transparent border-0 p-0"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span>Robots.txt &amp; Sitemap Shield</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('llms-txt')}
                    className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition text-left cursor-pointer group bg-transparent border-0 p-0"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>llms.txt Studio para IA</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Design, Performance & Segurança */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4af37]">
                Design &amp; Infraestrutura
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('favicon-studio')}
                    className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition text-left cursor-pointer group bg-transparent border-0 p-0"
                  >
                    <Smile className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Favicon &amp; Web Manifest PWA</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('security-headers')}
                    className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition text-left cursor-pointer group bg-transparent border-0 p-0"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span>Headers HTTP de Segurança (CSP)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('redirects-generator')}
                    className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition text-left cursor-pointer group bg-transparent border-0 p-0"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Gerador de Redirecionamentos 301</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('og-studio')}
                    className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition text-left cursor-pointer group bg-transparent border-0 p-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-yellow-400 group-hover:scale-110 transition-transform" />
                    <span>OG Image Studio 1200×630</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Share & Status */}
            <div className="flex flex-col gap-3.5 bg-[#12141a]/60 border border-[#ffffff10] p-4 rounded-2xl">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Acesso Instantâneo
              </h4>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Compartilhe a suíte com seu time de desenvolvedores e criadores.
              </p>
              <button
                type="button"
                onClick={handleShareApp}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6be44] hover:from-[#e6be44] hover:to-[#d4af37] text-black font-bold text-xs transition cursor-pointer shadow-md shadow-[#d4af3720]"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Share2 className="w-3.5 h-3.5 text-black" />}
                <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar Suíte'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Copyright and Navigation Bar */}
          <div className="pt-6 border-t border-[#ffffff10] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-[#71717a] flex-wrap">
              <span>© {new Date().getFullYear()} Web &amp; SEO Studio</span>
              <span>•</span>
              <span>Construído com Astro &amp; React</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">100% Gratuito</span>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 text-[#a1a1aa] hover:text-[#f9e79f] transition cursor-pointer bg-transparent border-0 text-xs font-medium"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
