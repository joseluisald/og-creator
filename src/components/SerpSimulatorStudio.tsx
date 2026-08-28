import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Star,
  ShoppingBag,
  HelpCircle,
  Link2,
  Copy,
  Check,
  Code2,
  Share2,
  Sliders,
  Eye,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  Globe,
  Tag,
  ArrowRight,
  TrendingUp,
  FileCode,
  Zap
} from 'lucide-react';
import { SerpSnippetConfig, SerpCtrAnalysis, AppSubView } from '../types';

interface SerpSimulatorStudioProps {
  triggerToast?: (msg: string) => void;
  onNavigate?: (view: AppSubView) => void;
}

const POWER_WORDS = [
  'definitivo',
  'completo',
  'grátis',
  'gratuito',
  'guia',
  'passo a passo',
  'melhor',
  'melhores',
  'fácil',
  'rápido',
  'oficial',
  'atualizado',
  'novo',
  'segredo',
  'comprovado',
  'tutorial',
  'dicas',
  'online',
  'prático',
  '2026',
  '2025'
];

const CTA_WORDS = [
  'confira',
  'acesse',
  'descubra',
  'veja',
  'aprenda',
  'compre',
  'baixe',
  'conheça',
  'experimente',
  'clique',
  'leia',
  'garanta',
  'comece'
];

const DEFAULT_SNIPPET: SerpSnippetConfig = {
  title: 'Como Criar um Site de Sucesso em 2026 [Guia Definitivo]',
  description:
    'Aprenda o passo a passo completo para criar um site profissional, otimizado para o Google (SEO) e de alta conversão. Confira as melhores ferramentas e dicas grátis!',
  url: 'https://exemplo.com.br/blog/como-criar-site-sucesso',
  displayUrl: 'exemplo.com.br > blog > como-criar-site-sucesso',
  primaryKeyword: 'Como Criar um Site',
  faviconEmoji: '🚀',
  showDate: true,
  dateString: '28 de ago. de 2026',
  enableRating: true,
  ratingValue: 4.9,
  reviewCount: 1420,
  maxRating: 5,
  enableProduct: false,
  price: '99,00',
  currency: 'BRL',
  availability: 'InStock',
  enableSitelinks: true,
  sitelinks: [
    {
      id: '1',
      title: 'Passo 1: Domínio e Hospedagem',
      snippet: 'Escolha o melhor provedor com alta velocidade e suporte.',
      url: 'https://exemplo.com.br/blog/dominio-hospedagem'
    },
    {
      id: '2',
      title: 'Passo 2: Design e SEO',
      snippet: 'Configure meta tags e templates responsivos.',
      url: 'https://exemplo.com.br/blog/design-seo'
    },
    {
      id: '3',
      title: 'Ferramentas Recomendadas',
      snippet: 'Lista de plugins e suítes gratuitas para alavancar.',
      url: 'https://exemplo.com.br/blog/ferramentas'
    },
    {
      id: '4',
      title: 'Dúvidas Frequentes',
      snippet: 'Respostas para as principais perguntas sobre criação web.',
      url: 'https://exemplo.com.br/blog/faq'
    }
  ],
  enableFaq: false,
  faqItems: [
    {
      id: '1',
      question: 'Quanto custa criar um site profissional?',
      answer: 'É possível começar com custos baixos (a partir de R$ 15/mês com domínio próprio e construtor gratuito).'
    },
    {
      id: '2',
      question: 'Preciso saber programação?',
      answer: 'Não! Existem hoje ferramentas no-code e CMS modernos que permitem criar sites completos sem código.'
    }
  ],
  enableThumbnail: false,
  thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=160&auto=format&fit=crop&q=80'
};

const PRESETS: Array<{
  id: string;
  name: string;
  category: string;
  config: Partial<SerpSnippetConfig>;
}> = [
  {
    id: 'blog-guide',
    name: 'Artigo de Blog / Guia Completo',
    category: 'Conteúdo',
    config: {
      title: 'SEO para Iniciantes: 10 Dicas Práticas em 2026 [Guia]',
      description:
        'Descubra como posicionar seu site na primeira página do Google com técnicas de SEO on-page, palavras-chave e link building comprovadas. Acesse o guia grátis!',
      url: 'https://meusite.com.br/seo/guia-iniciantes',
      displayUrl: 'meusite.com.br > seo > guia-iniciantes',
      primaryKeyword: 'SEO para Iniciantes',
      faviconEmoji: '📚',
      showDate: true,
      enableRating: true,
      ratingValue: 4.8,
      reviewCount: 320,
      enableProduct: false,
      enableSitelinks: true,
      enableFaq: true
    }
  },
  {
    id: 'ecommerce-product',
    name: 'Produto / Loja Virtual',
    category: 'E-commerce',
    config: {
      title: 'Fone Bluetooth Pro Noise Cancelling com 40h de Bateria | LojaTech',
      description:
        'Compre o Fone Bluetooth Pro com cancelamento de ruído ativo e som HD. Frete Grátis para todo o Brasil e até 12x sem juros. Garanta o seu com desconto!',
      url: 'https://lojatech.com.br/audio/fone-bluetooth-pro',
      displayUrl: 'lojatech.com.br > audio > fone-bluetooth-pro',
      primaryKeyword: 'Fone Bluetooth Pro',
      faviconEmoji: '🎧',
      showDate: false,
      enableRating: true,
      ratingValue: 4.9,
      reviewCount: 2840,
      enableProduct: true,
      price: '289,90',
      currency: 'BRL',
      availability: 'InStock',
      enableSitelinks: false,
      enableFaq: false
    }
  },
  {
    id: 'saas-tool',
    name: 'SaaS / Ferramenta Online',
    category: 'Software',
    config: {
      title: 'Gerador de Faturas e Boletos Grátis para MEI e Empresas',
      description:
        'Crie e envie faturas profissionais em segundos com cálculo automático de impostos e notificações via WhatsApp. Experimente 100% grátis agora!',
      url: 'https://appfatura.io/gerador-faturas',
      displayUrl: 'appfatura.io > ferramentas > gerador-faturas',
      primaryKeyword: 'Gerador de Faturas',
      faviconEmoji: '⚡',
      showDate: false,
      enableRating: true,
      ratingValue: 4.9,
      reviewCount: 950,
      enableProduct: false,
      enableSitelinks: true,
      enableFaq: true
    }
  },
  {
    id: 'local-business',
    name: 'Empresa Local / Serviço',
    category: 'Local',
    config: {
      title: 'Clínica Odontológica em São Paulo - Implantes e Ortodontia',
      description:
        'Atendimento odontológico de excelência na Av. Paulista. Especialistas em implantes, alinhadores invisíveis e clareamento a laser. Agende sua avaliação!',
      url: 'https://odontopaulista.com.br/servicos',
      displayUrl: 'odontopaulista.com.br > sao-paulo > servicos',
      primaryKeyword: 'Clínica Odontológica em São Paulo',
      faviconEmoji: '🦷',
      showDate: false,
      enableRating: true,
      ratingValue: 5.0,
      reviewCount: 480,
      enableProduct: false,
      enableSitelinks: true,
      enableFaq: true
    }
  }
];

export const SerpSimulatorStudio: React.FC<SerpSimulatorStudioProps> = ({
  triggerToast = () => {},
  onNavigate
}) => {
  const [config, setConfig] = useState<SerpSnippetConfig>(DEFAULT_SNIPPET);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [googleTheme, setGoogleTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<'editor' | 'competitors' | 'code'>('editor');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [codeType, setCodeType] = useState<'html' | 'jsonld' | 'nextjs' | 'astro'>('html');

  // Pixel Width Approximations (Google Font metrics)
  // Google Desktop Title cuts at ~580-600px. Average char ~9.8px.
  // Google Mobile Description cuts at ~680px, Desktop at ~960px.
  const analysis: SerpCtrAnalysis = useMemo(() => {
    const title = config.title;
    const desc = config.description;
    const kw = config.primaryKeyword.trim().toLowerCase();

    // Approximate Google Sans / Arial title pixel width
    let titlePixels = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title[i];
      if (/[A-Z]/.test(char)) titlePixels += 11.5;
      else if (/[iljt1| ]/.test(char)) titlePixels += 4.5;
      else if (/[wmfWM]/.test(char)) titlePixels += 13.5;
      else titlePixels += 8.8;
    }

    let descPixels = 0;
    for (let i = 0; i < desc.length; i++) {
      const char = desc[i];
      if (/[A-Z]/.test(char)) descPixels += 9.5;
      else if (/[iljt1| ]/.test(char)) descPixels += 3.8;
      else if (/[wmfWM]/.test(char)) descPixels += 11.0;
      else descPixels += 7.2;
    }

    const titleMaxPixels = 580;
    const descMaxPixels = previewDevice === 'mobile' ? 680 : 960;

    const isTitleTruncated = titlePixels > titleMaxPixels;
    const isDescTruncated = descPixels > descMaxPixels;

    // Checks for CTR optimization
    const hasNumbers = /\d+/.test(title);
    const hasBrackets = /[\[\]\(\)\{\}]/.test(title);
    const lowerTitle = title.toLowerCase();
    const hasPowerWords = POWER_WORDS.some((pw) => lowerTitle.includes(pw));
    const hasKwInTitle = kw ? lowerTitle.includes(kw) : false;
    const isKwAtStart = kw ? lowerTitle.indexOf(kw) === 0 || lowerTitle.indexOf(kw) < 15 : false;
    const lowerDesc = desc.toLowerCase();
    const hasCtaInDesc = CTA_WORDS.some((cta) => lowerDesc.includes(cta));
    const hasKwInDesc = kw ? lowerDesc.includes(kw) : false;
    const isTitleGoodLength = title.length >= 40 && title.length <= 60;
    const isDescGoodLength = desc.length >= 120 && desc.length <= 160;

    const checks = [
      {
        id: 'title-pixels',
        label: 'Largura do Título (Pixels)',
        passed: !isTitleTruncated && titlePixels >= 280,
        importance: 'high' as const,
        feedback: isTitleTruncated
          ? `O título tem ~${Math.round(titlePixels)}px e será cortado pelo Google com "..." (limite: 580px).`
          : titlePixels < 280
          ? 'Título muito curto. Aproveite mais espaço para incluir benefícios e palavras-chave.'
          : `Excelente (~${Math.round(titlePixels)}px). Visível por completo sem reticências.`
      },
      {
        id: 'desc-pixels',
        label: 'Tamanho da Meta Description',
        passed: !isDescTruncated && desc.length >= 110,
        importance: 'high' as const,
        feedback: isDescTruncated
          ? `Descrição longa (${desc.length} caracteres). Pode ser cortada no Google.`
          : desc.length < 110
          ? 'Descrição curta. Use entre 120 e 160 caracteres para maximizar a área de clique.'
          : `Tamanho ideal (${desc.length} caracteres, ~${Math.round(descPixels)}px).`
      },
      {
        id: 'kw-title',
        label: 'Palavra-chave Principal no Título',
        passed: hasKwInTitle,
        importance: 'high' as const,
        feedback: hasKwInTitle
          ? isKwAtStart
            ? 'Perfeito! Palavra-chave posicionada no início do título para máximo impacto de SEO.'
            : 'Palavra-chave presente no título. Considere movê-la mais para o início.'
          : `Adicione "${config.primaryKeyword}" no título para relevância e ranqueamento.`
      },
      {
        id: 'numbers-year',
        label: 'Uso de Números ou Ano',
        passed: hasNumbers,
        importance: 'medium' as const,
        feedback: hasNumbers
          ? 'Ótimo! Números e anos (ex: 2026) aumentam a taxa de cliques (CTR) em até +36%.'
          : 'Dica: Incluir números (ex: "10 Dicas", "2026", "100% Grátis") atrai mais olhares na SERP.'
      },
      {
        id: 'brackets',
        label: 'Colchetes ou Parênteses [ ] ( )',
        passed: hasBrackets,
        importance: 'medium' as const,
        feedback: hasBrackets
          ? 'Excelente! Colchetes criam contraste visual e aumentam cliques.'
          : 'Dica: Adicione [Guia], [2026] ou (Passo a Passo) no final do título para destacar.'
      },
      {
        id: 'power-words',
        label: 'Palavras de Ação / Power Words',
        passed: hasPowerWords,
        importance: 'medium' as const,
        feedback: hasPowerWords
          ? 'Contém termos de alto impacto que geram curiosidade e autoridade.'
          : 'Inclua palavras como "Definitivo", "Grátis", "Melhor", "Fácil" ou "Oficial".'
      },
      {
        id: 'cta-desc',
        label: 'Chamada para Ação (CTA) na Descrição',
        passed: hasCtaInDesc,
        importance: 'medium' as const,
        feedback: hasCtaInDesc
          ? 'Possui verbo de ação estimulando o usuário a clicar no resultado.'
          : 'Adicione um convite à ação (ex: "Confira!", "Acesse agora!", "Veja o passo a passo!").'
      },
      {
        id: 'rich-snippets',
        label: 'Rich Snippets Ativos (Avaliação / Preço / FAQ)',
        passed: config.enableRating || config.enableProduct || config.enableFaq || config.enableSitelinks,
        importance: 'high' as const,
        feedback:
          config.enableRating || config.enableProduct || config.enableFaq || config.enableSitelinks
            ? 'Snippets visuais ativados! Ocupam mais espaço na tela e atraem muito mais cliques.'
            : 'Ative Estrelas de Avaliação, Preço ou FAQ para dominar a página de resultados.'
      }
    ];

    // Calculate score
    let points = 0;
    checks.forEach((c) => {
      if (c.passed) {
        points += c.importance === 'high' ? 18 : 11;
      }
    });
    const score = Math.min(100, Math.max(10, points));

    return {
      score,
      titlePixelWidth: Math.round(titlePixels),
      titleCharCount: title.length,
      isTitleTruncated,
      descPixelWidth: Math.round(descPixels),
      descCharCount: desc.length,
      isDescTruncated,
      checks
    };
  }, [config, previewDevice]);

  const handleApplyPreset = (presetId: string) => {
    const p = PRESETS.find((item) => item.id === presetId);
    if (p) {
      setConfig((prev) => ({ ...prev, ...p.config }));
      triggerToast(`Preset "${p.name}" aplicado!`);
    }
  };

  const handleAddFaq = () => {
    const newId = String(Date.now());
    setConfig((prev) => ({
      ...prev,
      faqItems: [
        ...prev.faqItems,
        { id: newId, question: 'Nova pergunta frequente...', answer: 'Resposta explicativa e direta.' }
      ]
    }));
  };

  const handleRemoveFaq = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      faqItems: prev.faqItems.filter((f) => f.id !== id)
    }));
  };

  const handleAddSitelink = () => {
    const newId = String(Date.now());
    if (config.sitelinks.length >= 6) {
      triggerToast('Máximo de 6 sitelinks recomendados para visualização no Google.');
      return;
    }
    setConfig((prev) => ({
      ...prev,
      sitelinks: [
        ...prev.sitelinks,
        { id: newId, title: 'Novo Link de Destaque', snippet: 'Breve descrição do conteúdo.', url: `${config.url}/novo` }
      ]
    }));
  };

  const handleRemoveSitelink = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      sitelinks: prev.sitelinks.filter((s) => s.id !== id)
    }));
  };

  // Generate clean export code
  const generatedCode = useMemo(() => {
    if (codeType === 'html') {
      return `<!-- Meta Tags Principais para SEO & Google SERP -->
<title>${config.title}</title>
<meta name="description" content="${config.description}" />
<link rel="canonical" href="${config.url}" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

<!-- Open Graph / Redes Sociais -->
<meta property="og:title" content="${config.title}" />
<meta property="og:description" content="${config.description}" />
<meta property="og:url" content="${config.url}" />
<meta property="og:type" content="website" />`;
    }

    if (codeType === 'jsonld') {
      const schemas: Record<string, unknown>[] = [];

      // Breadcrumb Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://exemplo.com.br' },
          { '@type': 'ListItem', position: 2, name: config.primaryKeyword || 'Artigo', item: config.url }
        ]
      });

      // Product or Rating Schema
      if (config.enableProduct) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: config.title,
          description: config.description,
          offers: {
            '@type': 'Offer',
            price: config.price.replace(',', '.'),
            priceCurrency: config.currency,
            availability: `https://schema.org/${config.availability}`
          },
          ...(config.enableRating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: config.ratingValue,
              reviewCount: config.reviewCount,
              bestRating: config.maxRating
            }
          })
        });
      } else if (config.enableRating) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: config.title,
          description: config.description,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: config.ratingValue,
            reviewCount: config.reviewCount,
            bestRating: config.maxRating
          }
        });
      }

      // FAQ Schema
      if (config.enableFaq && config.faqItems.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: config.faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer
            }
          }))
        });
      }

      return `<script type="application/ld+json">\n${JSON.stringify(
        schemas.length === 1 ? schemas[0] : schemas,
        null,
        2
      )}\n<\/script>`;
    }

    if (codeType === 'nextjs') {
      return `// Next.js (App Router - layout.tsx ou page.tsx)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${config.title}',
  description: '${config.description}',
  alternates: {
    canonical: '${config.url}',
  },
  openGraph: {
    title: '${config.title}',
    description: '${config.description}',
    url: '${config.url}',
    siteName: '${config.displayUrl.split('>')[0].trim()}',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};`;
    }

    if (codeType === 'astro') {
      return `---
// Astro Component (<head>)
const title = "${config.title}";
const description = "${config.description}";
const canonicalURL = new URL("${config.url}", Astro.site);
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />`;
    }

    return '';
  }, [config, codeType]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    triggerToast('Código copiado com sucesso!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0c] text-white min-h-[calc(100vh-64px)]">
      {/* Sub-Header Toolbar */}
      <div className="border-b border-[#ffffff10] bg-[#0f1115] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            Simulador de SERP Google &amp; Rich Snippets Studio
          </span>
          <span className="text-xs text-[#71717a] hidden sm:inline">• Teste de Pixels, CTR Booster, Avaliações &amp; Mobile</span>
        </div>

        {/* View and Mode Selectors */}
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-[#181a20] p-1 rounded-lg border border-[#ffffff10] text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                activeTab === 'editor' ? 'bg-[#272a34] text-white' : 'text-[#8b8d98] hover:text-white'
              }`}
            >
              Editor &amp; SERP
            </button>
            <button
              onClick={() => setActiveTab('competitors')}
              className={`px-3 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'competitors' ? 'bg-[#272a34] text-white' : 'text-[#8b8d98] hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              Concorrentes
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'code' ? 'bg-[#272a34] text-white' : 'text-[#8b8d98] hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Exportar
            </button>
          </div>

          {/* Device & Theme Toggles */}
          <div className="flex items-center bg-[#181a20] p-1 rounded-lg border border-[#ffffff10]">
            <button
              onClick={() => setPreviewDevice('desktop')}
              title="Visualização Desktop"
              className={`p-1.5 rounded-md transition cursor-pointer ${
                previewDevice === 'desktop' ? 'bg-[#272a34] text-white' : 'text-[#71717a] hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              title="Visualização Mobile"
              className={`p-1.5 rounded-md transition cursor-pointer ${
                previewDevice === 'mobile' ? 'bg-[#272a34] text-white' : 'text-[#71717a] hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center bg-[#181a20] p-1 rounded-lg border border-[#ffffff10]">
            <button
              onClick={() => setGoogleTheme(googleTheme === 'dark' ? 'light' : 'dark')}
              title={`Alternar tema do Google (Atual: ${googleTheme === 'dark' ? 'Escuro' : 'Claro'})`}
              className="p-1.5 rounded-md text-[#71717a] hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs"
            >
              {googleTheme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span className="hidden md:inline">{googleTheme === 'dark' ? 'Google Dark' : 'Google Light'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto">
        {/* Left Side: Form Controls */}
        <div className="lg:col-span-5 border-r border-[#ffffff10] bg-[#0c0d11] p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-[#8b8d98] uppercase tracking-wider block mb-2.5 flex items-center justify-between">
              <span>Modelos Rápidos (Presets)</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p.id)}
                  className="p-2.5 rounded-xl bg-[#14161d] hover:bg-[#1c1f28] border border-[#ffffff10] hover:border-[#ffffff25] text-left transition cursor-pointer group"
                >
                  <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition truncate">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-[#71717a] mt-0.5">{p.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Title & Pixels */}
          <div className="bg-[#12141a] rounded-2xl border border-[#ffffff10] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-amber-400" />
                Título da Página (SEO Title)
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                    analysis.isTitleTruncated
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  ~{analysis.titlePixelWidth}px / 580px
                </span>
                <span className="text-[11px] text-[#71717a] font-mono">{analysis.titleCharCount} caracteres</span>
              </div>
            </div>

            <textarea
              rows={2}
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full bg-[#181a22] border border-[#ffffff15] focus:border-amber-500/60 rounded-xl p-3 text-sm text-white focus:outline-none transition resize-none"
              placeholder="Digite o título SEO atraente..."
            />

            {/* Pixel Gauge Bar */}
            <div>
              <div className="h-1.5 w-full bg-[#20232c] rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-300 ${
                    analysis.isTitleTruncated ? 'bg-rose-500' : analysis.titlePixelWidth > 480 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (analysis.titlePixelWidth / 580) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#71717a] mt-1 font-mono">
                <span>0px</span>
                <span>480px (Ideal)</span>
                <span className={analysis.isTitleTruncated ? 'text-rose-400 font-bold' : ''}>580px (Corte Google)</span>
              </div>
            </div>
          </div>

          {/* Section: Description */}
          <div className="bg-[#12141a] rounded-2xl border border-[#ffffff10] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-400" />
                Meta Description
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                    analysis.isDescTruncated
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}
                >
                  {analysis.descCharCount} / 160 caracteres
                </span>
              </div>
            </div>

            <textarea
              rows={3}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full bg-[#181a22] border border-[#ffffff15] focus:border-blue-500/60 rounded-xl p-3 text-sm text-white focus:outline-none transition resize-none"
              placeholder="Descreva o conteúdo com benefício claro e chamada para ação..."
            />

            {/* Quick Power Words Buttons */}
            <div className="pt-1">
              <span className="text-[11px] text-[#71717a] block mb-1.5 font-medium">Inserir Gatilho / Power Word:</span>
              <div className="flex flex-wrap gap-1.5">
                {['[Guia 2026]', '100% Grátis', 'Passo a Passo', 'Confira Agora!', 'Melhores Dicas'].map((word) => (
                  <button
                    key={word}
                    onClick={() => setConfig({ ...config, title: `${config.title} ${word}`.trim() })}
                    className="px-2 py-1 bg-[#1a1d26] hover:bg-[#252834] text-[11px] text-[#a1a1aa] hover:text-white rounded-lg border border-[#ffffff10] transition cursor-pointer"
                  >
                    + {word}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: URL & Keyword */}
          <div className="bg-[#12141a] rounded-2xl border border-[#ffffff10] p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-white block mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  URL Canônica
                </label>
                <input
                  type="text"
                  value={config.url}
                  onChange={(e) => {
                    const clean = e.target.value;
                    const display = clean.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/\//g, ' > ');
                    setConfig({ ...config, url: clean, displayUrl: display });
                  }}
                  className="w-full bg-[#181a22] border border-[#ffffff15] focus:border-emerald-500/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  Palavra-chave Foco
                </label>
                <input
                  type="text"
                  value={config.primaryKeyword}
                  onChange={(e) => setConfig({ ...config, primaryKeyword: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#ffffff15] focus:border-purple-500/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
                  placeholder="Ex: Como Criar um Site"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#ffffff08]">
              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">Ícone Favicon (Emoji ou Letra)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={2}
                    value={config.faviconEmoji}
                    onChange={(e) => setConfig({ ...config, faviconEmoji: e.target.value })}
                    className="w-12 text-center bg-[#181a22] border border-[#ffffff15] rounded-xl py-1.5 text-base text-white focus:outline-none"
                  />
                  <div className="flex gap-1">
                    {['🚀', '⚡', '🔥', '💎', '📚', '🛒'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setConfig({ ...config, faviconEmoji: emoji })}
                        className="p-1.5 bg-[#1a1d26] hover:bg-[#252834] rounded-lg border border-[#ffffff10] text-sm cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <label className="text-xs font-semibold text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showDate}
                    onChange={(e) => setConfig({ ...config, showDate: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Exibir Data de Publicação</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Rich Snippets Modules */}
          <div className="bg-[#12141a] rounded-2xl border border-[#ffffff10] p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Rich Snippets (Aprimoramentos de Busca)
              </span>
            </h3>

            {/* 1. Star Rating */}
            <div className="p-3.5 rounded-xl bg-[#181a22] border border-[#ffffff10] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableRating}
                    onChange={(e) => setConfig({ ...config, enableRating: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Estrelas de Avaliação (Review Stars)</span>
                </label>
                {config.enableRating && (
                  <span className="text-[11px] font-mono text-amber-300 font-bold">
                    {config.ratingValue} ★ ({config.reviewCount.toLocaleString('pt-BR')} votos)
                  </span>
                )}
              </div>

              {config.enableRating && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-[10px] text-[#71717a] block mb-1">Nota (0 a 5.0)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={config.ratingValue}
                      onChange={(e) => setConfig({ ...config, ratingValue: parseFloat(e.target.value) || 5 })}
                      className="w-full bg-[#12141a] border border-[#ffffff15] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71717a] block mb-1">Qtd. Avaliações</span>
                    <input
                      type="number"
                      value={config.reviewCount}
                      onChange={(e) => setConfig({ ...config, reviewCount: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-[#12141a] border border-[#ffffff15] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Product Price */}
            <div className="p-3.5 rounded-xl bg-[#181a22] border border-[#ffffff10] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableProduct}
                    onChange={(e) => setConfig({ ...config, enableProduct: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preço &amp; Disponibilidade de Produto</span>
                </label>
              </div>

              {config.enableProduct && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div>
                    <span className="text-[10px] text-[#71717a] block mb-1">Preço</span>
                    <input
                      type="text"
                      value={config.price}
                      onChange={(e) => setConfig({ ...config, price: e.target.value })}
                      className="w-full bg-[#12141a] border border-[#ffffff15] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      placeholder="99,90"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71717a] block mb-1">Moeda</span>
                    <select
                      value={config.currency}
                      onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                      className="w-full bg-[#12141a] border border-[#ffffff15] rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value="BRL">R$ (BRL)</option>
                      <option value="USD">$ (USD)</option>
                      <option value="EUR">€ (EUR)</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71717a] block mb-1">Estoque</span>
                    <select
                      value={config.availability}
                      onChange={(e) => setConfig({ ...config, availability: e.target.value as any })}
                      className="w-full bg-[#12141a] border border-[#ffffff15] rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value="InStock">Em Estoque</option>
                      <option value="OutOfStock">Esgotado</option>
                      <option value="PreOrder">Pré-venda</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Sitelinks */}
            <div className="p-3.5 rounded-xl bg-[#181a22] border border-[#ffffff10] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableSitelinks}
                    onChange={(e) => setConfig({ ...config, enableSitelinks: e.target.checked })}
                    className="rounded text-blue-500 focus:ring-0 cursor-pointer"
                  />
                  <Link2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sitelinks (Sub-links em Destaque)</span>
                </label>
                {config.enableSitelinks && (
                  <button
                    onClick={handleAddSitelink}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                )}
              </div>

              {config.enableSitelinks && (
                <div className="space-y-2 pt-2">
                  {config.sitelinks.map((s, idx) => (
                    <div key={s.id} className="p-2.5 rounded-lg bg-[#12141a] border border-[#ffffff0a] flex items-center gap-2">
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={s.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              sitelinks: prev.sitelinks.map((item) => (item.id === s.id ? { ...item, title: val } : item))
                            }));
                          }}
                          className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none"
                          placeholder="Título do Sitelink"
                        />
                        <input
                          type="text"
                          value={s.snippet}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              sitelinks: prev.sitelinks.map((item) => (item.id === s.id ? { ...item, snippet: val } : item))
                            }));
                          }}
                          className="w-full bg-transparent text-[11px] text-[#71717a] focus:outline-none"
                          placeholder="Descrição do sublink..."
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveSitelink(s.id)}
                        className="p-1 text-[#71717a] hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. FAQ Accordions */}
            <div className="p-3.5 rounded-xl bg-[#181a22] border border-[#ffffff10] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableFaq}
                    onChange={(e) => setConfig({ ...config, enableFaq: e.target.checked })}
                    className="rounded text-purple-500 focus:ring-0 cursor-pointer"
                  />
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>FAQ Accordion (Perguntas &amp; Respostas)</span>
                </label>
                {config.enableFaq && (
                  <button
                    onClick={handleAddFaq}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Pergunta
                  </button>
                )}
              </div>

              {config.enableFaq && (
                <div className="space-y-2 pt-2">
                  {config.faqItems.map((faq) => (
                    <div key={faq.id} className="p-2.5 rounded-lg bg-[#12141a] border border-[#ffffff0a] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              faqItems: prev.faqItems.map((f) => (f.id === faq.id ? { ...f, question: val } : f))
                            }));
                          }}
                          className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none"
                          placeholder="Pergunta..."
                        />
                        <button
                          onClick={() => handleRemoveFaq(faq.id)}
                          className="p-1 text-[#71717a] hover:text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig((prev) => ({
                            ...prev,
                            faqItems: prev.faqItems.map((f) => (f.id === faq.id ? { ...f, answer: val } : f))
                          }));
                        }}
                        className="w-full bg-transparent text-[11px] text-[#8b8d98] focus:outline-none resize-none"
                        placeholder="Resposta explicativa..."
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Live SERP Simulation / Competitors / Code */}
        <div className="lg:col-span-7 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] bg-[#08090b]">
          {/* CTR Score Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#161820] to-[#1a1c24] border border-[#ffffff15] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl font-mono border ${
                  analysis.score >= 80
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : analysis.score >= 60
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {analysis.score}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Pontuação de CTR no Google</span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      analysis.score >= 80
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : analysis.score >= 60
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {analysis.score >= 80 ? 'Excelente (Alto Potencial)' : analysis.score >= 60 ? 'Bom' : 'Precisa Melhorar'}
                  </span>
                </div>
                <p className="text-xs text-[#8b8d98] mt-0.5">
                  Baseado em largura de pixels, gatilhos mentais, números e rich snippets ativos.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('code')}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Code2 className="w-3.5 h-3.5" />
                Obter Código
              </button>
            </div>
          </div>

          {/* TAB 1: Live SERP Preview */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* Google Result Frame */}
              <div
                className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xl ${
                  googleTheme === 'dark'
                    ? 'bg-[#202124] border-[#3c4043] text-[#bdc1c6]'
                    : 'bg-white border-[#dadce0] text-[#4d5156]'
                }`}
              >
                {/* Fake Google Browser Search Bar */}
                <div
                  className={`px-5 py-3 border-b flex items-center justify-between text-xs ${
                    googleTheme === 'dark' ? 'border-[#3c4043] bg-[#303134]' : 'border-[#ebebeb] bg-[#f8f9fa]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm tracking-tighter text-blue-500">
                      G<span className="text-red-500">o</span>
                      <span className="text-amber-500">o</span>
                      <span className="text-blue-500">g</span>
                      <span className="text-emerald-500">l</span>
                      <span className="text-red-500">e</span>
                    </span>
                    <div
                      className={`px-3 py-1 rounded-full text-xs flex items-center gap-2 ${
                        googleTheme === 'dark' ? 'bg-[#202124] text-white' : 'bg-white text-[#202124] shadow-sm'
                      }`}
                    >
                      <Search className="w-3 h-3 text-[#9aa0a6]" />
                      <span className="font-medium truncate max-w-[200px]">
                        {config.primaryKeyword || 'como criar site'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#9aa0a6]">
                    <span className="text-blue-400 font-semibold border-b-2 border-blue-400 pb-0.5">Todas</span>
                    <span>Imagens</span>
                    <span>Vídeos</span>
                    <span>Notícias</span>
                  </div>
                </div>

                {/* The Search Snippet Container */}
                <div className={`p-6 ${previewDevice === 'mobile' ? 'max-w-[420px] mx-auto' : ''}`}>
                  {/* Site Header: Favicon + Domain Hierarchy */}
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                        googleTheme === 'dark' ? 'bg-[#303134]' : 'bg-[#f1f3f4]'
                      }`}
                    >
                      {config.faviconEmoji}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-xs font-medium truncate ${
                          googleTheme === 'dark' ? 'text-[#dadce0]' : 'text-[#202124]'
                        }`}
                      >
                        {config.displayUrl.split('>')[0].trim() || 'exemplo.com.br'}
                      </span>
                      <span
                        className={`text-[11px] truncate ${
                          googleTheme === 'dark' ? 'text-[#bdc1c6]' : 'text-[#4d5156]'
                        }`}
                      >
                        {config.url}
                      </span>
                    </div>
                  </div>

                  {/* Title (Blue Clickable Link) */}
                  <h3 className="text-lg leading-snug font-normal hover:underline cursor-pointer mb-1">
                    <span className={googleTheme === 'dark' ? 'text-[#8ab4f8]' : 'text-[#1a0dab]'}>
                      {analysis.isTitleTruncated ? config.title.slice(0, 58) + '...' : config.title}
                    </span>
                  </h3>

                  {/* Rich Snippets Row: Ratings / Product Price */}
                  {(config.enableRating || config.enableProduct) && (
                    <div className="flex flex-wrap items-center gap-2 text-xs py-1">
                      {config.enableRating && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`font-semibold ${googleTheme === 'dark' ? 'text-white' : 'text-[#202124]'}`}
                          >
                            Avaliação: {config.ratingValue.toFixed(1)}
                          </span>
                          <span className="text-amber-500 tracking-tighter">★★★★★</span>
                          <span className="text-[11px] opacity-75">
                            ({config.reviewCount.toLocaleString('pt-BR')})
                          </span>
                        </div>
                      )}

                      {config.enableRating && config.enableProduct && <span>•</span>}

                      {config.enableProduct && (
                        <div className="flex items-center gap-1 font-semibold">
                          <span className={googleTheme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}>
                            {config.currency === 'BRL' ? 'R$' : '$'} {config.price}
                          </span>
                          <span className="text-[11px] opacity-75 font-normal">
                            ({config.availability === 'InStock' ? 'Em estoque' : 'Consulte'})
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Snippet Description + Date */}
                  <div className="flex gap-3 mt-1">
                    <p className={`text-sm leading-relaxed ${googleTheme === 'dark' ? 'text-[#bdc1c6]' : 'text-[#4d5156]'}`}>
                      {config.showDate && (
                        <span className="opacity-75 font-medium mr-1.5">{config.dateString} —</span>
                      )}
                      <span>
                        {analysis.isDescTruncated ? config.description.slice(0, 155) + '...' : config.description}
                      </span>
                    </p>

                    {config.enableThumbnail && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-[#ffffff15]">
                        <img
                          src={config.thumbnailUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Sitelinks Box */}
                  {config.enableSitelinks && config.sitelinks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#ffffff10] grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {config.sitelinks.map((link) => (
                        <div key={link.id} className="space-y-0.5">
                          <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className={`text-sm font-medium hover:underline block ${
                              googleTheme === 'dark' ? 'text-[#8ab4f8]' : 'text-[#1a0dab]'
                            }`}
                          >
                            {link.title}
                          </a>
                          <p className={`text-xs ${googleTheme === 'dark' ? 'text-[#bdc1c6]' : 'text-[#4d5156]'}`}>
                            {link.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* FAQ Accordions in SERP */}
                  {config.enableFaq && config.faqItems.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#ffffff10] space-y-2">
                      <span className="text-[11px] font-semibold text-[#9aa0a6] uppercase tracking-wider block mb-1">
                        Perguntas Frequentes
                      </span>
                      {config.faqItems.map((faq) => (
                        <div
                          key={faq.id}
                          className={`rounded-xl border transition ${
                            googleTheme === 'dark'
                              ? 'bg-[#303134]/60 border-[#3c4043]'
                              : 'bg-[#f8f9fa] border-[#ebebeb]'
                          }`}
                        >
                          <button
                            onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                            className="w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <span className={googleTheme === 'dark' ? 'text-white' : 'text-[#202124]'}>
                              {faq.question}
                            </span>
                            {expandedFaqId === faq.id ? (
                              <ChevronUp className="w-4 h-4 text-[#9aa0a6]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#9aa0a6]" />
                            )}
                          </button>
                          {expandedFaqId === faq.id && (
                            <div
                              className={`px-3.5 pb-3 text-xs leading-relaxed border-t ${
                                googleTheme === 'dark'
                                  ? 'border-[#3c4043] text-[#bdc1c6]'
                                  : 'border-[#ebebeb] text-[#4d5156]'
                              }`}
                            >
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Optimization Checklist Card */}
              <div className="bg-[#12141a] rounded-2xl border border-[#ffffff10] p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Diagnóstico &amp; Checklist de Otimização CTR
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.checks.map((check) => (
                    <div
                      key={check.id}
                      className={`p-3.5 rounded-xl border transition ${
                        check.passed
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-[#181a22] border-[#ffffff10]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {check.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            check.passed ? 'text-emerald-300' : 'text-white'
                          }`}
                        >
                          {check.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8b8d98] leading-relaxed pl-6">{check.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Competitors Battlefield Simulation */}
          {activeTab === 'competitors' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>
                  <strong>Simulador de Batalha de SERP:</strong> Veja como seu snippet se destaca visualmente frente a
                  concorrentes reais posicionados no topo do Google.
                </span>
              </div>

              {/* Competitor SERP List */}
              <div className="bg-[#202124] rounded-2xl border border-[#3c4043] p-6 space-y-6 text-[#bdc1c6]">
                {/* Result #1: Competitor */}
                <div className="space-y-1 opacity-70">
                  <span className="text-[10px] text-[#9aa0a6] uppercase font-mono font-bold">#1 Concorrente A</span>
                  <div className="text-xs text-[#dadce0]">portaltecnologia.com.br &gt; criacao-sites</div>
                  <h4 className="text-base text-[#8ab4f8]">Como Fazer um Site em 2026: Dicas e Informações</h4>
                  <p className="text-xs text-[#bdc1c6]">
                    Descubra neste artigo os fundamentos básicos para ter uma página na internet e contratar domínio.
                  </p>
                </div>

                {/* Result #2: YOUR SNIPPET (Highlighted) */}
                <div className="p-4 rounded-xl bg-[#2a2c32] border-2 border-amber-500/60 shadow-lg space-y-2 relative">
                  <div className="absolute -top-3 right-4 bg-amber-500 text-black text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow">
                    Seu Snippet Otimizado
                  </div>
                  <div className="text-xs text-[#dadce0] flex items-center gap-1.5">
                    <span>{config.faviconEmoji}</span>
                    <span>{config.displayUrl}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#8ab4f8]">{config.title}</h4>
                  {config.enableRating && (
                    <div className="text-xs text-amber-400 font-semibold">
                      {config.ratingValue} ★★★★★ ({config.reviewCount} avaliações)
                    </div>
                  )}
                  <p className="text-xs text-[#e8eaed] leading-relaxed">{config.description}</p>
                </div>

                {/* Result #3: Competitor */}
                <div className="space-y-1 opacity-70">
                  <span className="text-[10px] text-[#9aa0a6] uppercase font-mono font-bold">#3 Concorrente B</span>
                  <div className="text-xs text-[#dadce0]">wikipedia.org &gt; wiki &gt; Site</div>
                  <h4 className="text-base text-[#8ab4f8]">Sítio eletrônico - Wikipédia, a enciclopédia livre</h4>
                  <p className="text-xs text-[#bdc1c6]">
                    Um sítio eletrônico ou website é uma coleção de páginas da web e conteúdos relacionados...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Code Export */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-[#12141a] p-1 rounded-xl border border-[#ffffff10]">
                  {(['html', 'jsonld', 'nextjs', 'astro'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setCodeType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                        codeType === type ? 'bg-amber-500 text-black font-bold' : 'text-[#8b8d98] hover:text-white'
                      }`}
                    >
                      {type === 'jsonld' ? 'JSON-LD Schema' : type}
                    </button>
                  ))}
                </div>

                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-xl bg-[#272a34] hover:bg-[#343846] text-white font-semibold text-xs flex items-center gap-2 border border-[#ffffff15] transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>

              {/* Code Display Area */}
              <div className="bg-[#12141a] rounded-2xl border border-[#ffffff10] p-5 font-mono text-xs text-amber-200/90 overflow-x-auto leading-relaxed shadow-inner">
                <pre>{generatedCode}</pre>
              </div>

              <div className="p-4 rounded-xl bg-[#14161f] border border-[#ffffff10] text-xs text-[#8b8d98] space-y-1">
                <p className="font-semibold text-white">Como implementar no seu site:</p>
                <p>
                  Copie as tags acima e cole diretamente dentro do elemento <code>&lt;head&gt;</code> do seu código HTML, ou
                  no arquivo de configuração de Metadata do seu framework (Next.js, Astro, WordPress, Nuxt).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
