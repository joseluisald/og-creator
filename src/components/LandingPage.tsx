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
  HelpCircle
} from 'lucide-react';
import { AppSubView } from '../types';

interface LandingPageProps {
  onNavigate: (view: AppSubView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [quickAuditUrl, setQuickAuditUrl] = useState('');

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
      badge: 'Desktop, Mobile & CTR Booster',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Search,
      iconBg: 'from-amber-400 to-orange-500',
      description:
        'Simule e otimize exatamente como seu site aparece nas buscas do Google (Desktop e Mobile). Teste limites de pixels (580px), corte de títulos, estrelas de avaliação, preço de produtos e snippets de FAQ.',
      highlights: [
        'Contador de largura de pixels real para título (580px) e descrição (960px)',
        'Simulador visual do Google com alternância Dark Mode e Light Mode',
        'Ativação de Rich Snippets: Estrelas de Avaliação (★★★★★), Preços e FAQ Accordion',
        'Diagnóstico de CTR Score com detecção de Power Words, números e colchetes'
      ],
      cta: 'Simular SERP do Google'
    },
    {
      id: 'favicon-studio' as AppSubView,
      title: 'Favicon & Web Manifest Studio',
      route: '/favicon-studio',
      badge: 'Pacote Completo PWA & Ícones',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Smile,
      iconBg: 'from-emerald-400 to-teal-500',
      description:
        'Crie favicons profissionais a partir de emojis, texto ou imagens e gere o pacote completo com favicon.ico, PNGs (16x16 até 512x512), Apple Touch Icon e site.webmanifest para PWA.',
      highlights: [
        'Exportação instantânea de arquivo ZIP com todos os tamanhos oficiais',
        'Editor de site.webmanifest para aplicativos web progressivos (PWA)',
        'Pré-visualização ao vivo em abas do Chrome (Dark/Light) e Home Screen de smartphones',
        'Tags HTML <head> prontas para Next.js, Astro e HTML5'
      ],
      cta: 'Criar Favicon & Manifest'
    },
    {
      id: 'security-headers' as AppSubView,
      title: 'Headers HTTP de Segurança',
      route: '/security-headers',
      badge: 'CSP, HSTS & IIS / Nginx',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      icon: ShieldCheck,
      iconBg: 'from-indigo-400 to-blue-600',
      description:
        'Audite e configure cabeçalhos HTTP de segurança de nível bancário: Content-Security-Policy (CSP), HSTS, X-Frame-Options, X-Content-Type-Options para Apache, Nginx, IIS (web.config) e Vercel.',
      highlights: [
        'Auditoria ao vivo de cabeçalhos de segurança com nota de A+ a F',
        'Presets de CSP para SaaS, Bancos, Next.js, GA4 e Google Tag Manager',
        'Geração de código em 1-clique para Nginx, Apache (.htaccess), IIS (web.config) e Express',
        'Proteção contra XSS, Clickjacking, MIME Sniffing e vazamento de dados'
      ],
      cta: 'Gerar Headers de Segurança'
    },
    {
      id: 'redirects-generator' as AppSubView,
      title: 'Gerador de Redirecionamentos 301',
      route: '/redirects-generator',
      badge: '.htaccess, Nginx & IIS web.config',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: ArrowRightLeft,
      iconBg: 'from-cyan-400 to-blue-500',
      description:
        'Crie regras de redirecionamento 301/302 individuais ou em massa, padronização canônica (HTTPS, www vs sem www, trailing slash) e bloqueio de bots maliciosos para qualquer servidor web.',
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
      badge: 'Visual Canvas 1200×630',
      badgeColor: 'bg-[#d4af37]/20 text-[#f9e79f] border-[#d4af37]/40',
      icon: ImageIcon,
      iconBg: 'from-[#d4af37] to-[#f9e79f]',
      description:
        'Crie banners e imagens Open Graph profissionais (1200x630 px) em alta resolução com presets de gradientes, logos, tags, tipografia fina e download imediato em PNG.',
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
      badge: '9 Frameworks + Google SERP',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: Code2,
      iconBg: 'from-blue-500 to-indigo-400',
      description:
        'Gerador completo de Meta Tags HTML5, Open Graph, Twitter Cards, WhatsApp/Discord e marcações estruturadas Schema.org / JSON-LD com suporte a 9 frameworks modernos.',
      highlights: [
        'Snippets prontos para Next.js App Router (metadata API), Astro, Nuxt 3, SvelteKit, Remix e HTML5',
        'Simulador visual interativo de Google SERP, Twitter/X Cards e WhatsApp',
        'Gerador de Schema.org: SoftwareApplication, Article, WebSite, Product e FAQPage',
        'Auditoria instantânea de tamanho ideal de título (50-60 car) e descrição (150-160 car)'
      ],
      cta: 'Gerar Meta Tags'
    },
    {
      id: 'robots-sitemap' as AppSubView,
      title: 'Robots, Sitemap & IA Shield',
      route: '/robots-sitemap',
      badge: 'SEO Técnico & Anti-Scraping',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: ShieldAlert,
      iconBg: 'from-emerald-500 to-teal-400',
      description:
        'Proteja seu site contra raspagem não autorizada por IAs (GPTBot, ClaudeBot, PerplexityBot), gere Sitemaps XML visuais e configure arquivos de segurança RFC 9116.',
      highlights: [
        'Bloqueio seletivo de 10+ robôs de IA (OpenAI, Anthropic, Google Gemini, Meta, ByteDance)',
        'Gerador de sitemap.xml com prioridades (1.0, 0.8), frequências e exportação para Next.js',
        'Simulador de Crawlers em tempo real: teste se rotas como /admin ou /api estão bloqueadas',
        'Gerador de security.txt (RFC 9116) e cabeçalhos HTTP recomendados (CSP, HSTS)'
      ],
      cta: 'Configurar Robots & Sitemap'
    },
    {
      id: 'llms-txt' as AppSubView,
      title: 'llms.txt & llms-full.txt Studio',
      route: '/llms-txt',
      badge: 'Novo Padrão para IAs',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Bot,
      iconBg: 'from-purple-500 to-pink-400',
      description:
        'Crie arquivos no padrão oficial Answer.AI / Jeremy Howard para que assistentes de IA (ChatGPT, Claude, Cursor IDE, Copilot, Perplexity) compreendam sua documentação e APIs.',
      highlights: [
        'Geração de /llms.txt (índice estruturado em Markdown) e /llms-full.txt (contexto unificado)',
        'Presets prontos para SaaS, APIs/SDKs de desenvolvedores e Manuais DevOps',
        'Exportação de regras para Cursor IDE (.cursorrules) e Route Handlers do Next.js',
        'Contador de caracteres e estimativa de tokens para planejar janelas de contexto'
      ],
      cta: 'Criar llms.txt'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-10 pb-14 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-[#d4af37]/10 via-[#d4af37]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14161b] border border-[#d4af37]/30 text-[#f9e79f] text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Suíte 100% Gratuita · Sem Cadastro · Sem Limites</span>
        </div>

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

        {/* Main Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full">
          <button
            type="button"
            onClick={() => onNavigate('serp-simulator')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-semibold transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulador SERP</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('favicon-studio')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181a20] hover:bg-[#252830] text-white font-semibold text-xs border border-[#ffffff20] transition cursor-pointer hover:border-emerald-500/50"
          >
            <Smile className="w-3.5 h-3.5 text-emerald-400" />
            <span>Favicon &amp; PWA</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('security-headers')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181a20] hover:bg-[#252830] text-white font-semibold text-xs border border-[#ffffff20] transition cursor-pointer hover:border-indigo-500/50"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Headers HTTP</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('redirects-generator')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181a20] hover:bg-[#252830] text-white font-semibold text-xs border border-[#ffffff20] transition cursor-pointer hover:border-cyan-500/50"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Redirecionamentos</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('og-studio')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181a20] hover:bg-[#252830] text-white font-semibold text-xs border border-[#ffffff20] transition cursor-pointer hover:border-[#d4af37]/50"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>OG Image Studio</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('meta-tags')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181a20] hover:bg-[#252830] text-white font-semibold text-xs border border-[#ffffff20] transition cursor-pointer hover:border-blue-500/50"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Meta Tags &amp; Schema</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('robots-sitemap')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181a20] hover:bg-[#252830] text-white font-semibold text-xs border border-[#ffffff20] transition cursor-pointer hover:border-emerald-500/50"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Robots &amp; Sitemap</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('llms-txt')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181a20] hover:bg-[#252830] text-white font-semibold text-xs border border-[#ffffff20] transition cursor-pointer hover:border-purple-500/50"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>llms.txt Studio</span>
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
      <section className="px-4 sm:px-6 py-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
            Cinco Ferramentas Integradas
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
            Escolha uma das ferramentas abaixo
          </h2>
          <p className="text-sm text-[#a1a1aa] mt-2 max-w-xl mx-auto">
            Cada módulo foi desenvolvido para resolver uma necessidade técnica crítica de desenvolvedores web, agências e criadores de conteúdo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUB_APPS.map((app) => {
            const IconComponent = app.icon;
            return (
              <div
                key={app.id}
                className="bg-[#121418] border border-[#ffffff15] hover:border-[#d4af37]/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-[#d4af3710] group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center text-black shadow-md`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#f9e79f] transition">
                          {app.title}
                        </h3>
                        <span className="text-xs font-mono text-[#71717a]">{app.route}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${app.badgeColor}`}>
                      {app.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mb-5">
                    {app.description}
                  </p>

                  <div className="space-y-2 mb-6 pt-2 border-t border-[#ffffff10]">
                    {app.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#d4d4d8]">
                        <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate(app.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a1c22] group-hover:bg-[#d4af37] group-hover:text-black text-[#f9e79f] font-bold text-xs sm:text-sm transition cursor-pointer border border-[#d4af37]/30 group-hover:border-transparent shadow-sm"
                >
                  <span>{app.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us vs Traditional Paid Tools */}
      <section className="px-4 sm:px-6 py-12 max-w-6xl mx-auto w-full border-t border-[#ffffff10]">
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
      <section className="px-4 sm:px-6 py-12 max-w-4xl mx-auto w-full">
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
      <footer className="border-t border-[#ffffff10] bg-[#0c0d10] py-8 px-6 mt-12 text-xs text-[#71717a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#d4af37] flex items-center justify-center text-black font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-white">Web &amp; SEO Studio</span>
            <span>— Suíte de Ferramentas Web Gratuitas</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('serp-simulator')}
              className="text-amber-400 hover:text-white transition cursor-pointer font-medium"
            >
              Simulador SERP
            </button>
            <button
              type="button"
              onClick={() => onNavigate('og-studio')}
              className="hover:text-white transition cursor-pointer"
            >
              OG Studio
            </button>
            <button
              type="button"
              onClick={() => onNavigate('meta-tags')}
              className="hover:text-white transition cursor-pointer"
            >
              Meta Tags
            </button>
            <button
              type="button"
              onClick={() => onNavigate('robots-sitemap')}
              className="hover:text-white transition cursor-pointer"
            >
              Robots &amp; Sitemap
            </button>
            <button
              type="button"
              onClick={() => onNavigate('llms-txt')}
              className="hover:text-white transition cursor-pointer"
            >
              llms.txt Studio
            </button>
            <button
              type="button"
              onClick={handleShareApp}
              className="text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Share2 className="w-3 h-3" />
              <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
