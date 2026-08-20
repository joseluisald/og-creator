import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Globe,
  FileCode,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface MetaTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle?: string;
  defaultSubtitle?: string;
}

export const MetaTagsModal: React.FC<MetaTagsModalProps> = ({
  isOpen,
  onClose,
  defaultTitle = 'Título do Projeto',
  defaultSubtitle = 'Descrição personalizada para compartilhamento em redes sociais.',
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultSubtitle);
  const [siteUrl, setSiteUrl] = useState('https://seusite.com.br');
  const [imageUrl, setImageUrl] = useState('https://seusite.com.br/og-image.png');
  const [siteName, setSiteName] = useState('Minha Plataforma');
  const [twitterHandle, setTwitterHandle] = useState('@meuperfil');
  const [locale, setLocale] = useState('pt_BR');
  const [activeTab, setActiveTab] = useState<'html' | 'nextjs' | 'nuxt' | 'astro'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Code Generation
  const htmlCode = `<!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${siteUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${title}" />
<meta property="og:site_name" content="${siteName}" />
<meta property="og:locale" content="${locale}" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${siteUrl}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />
<meta name="twitter:site" content="${twitterHandle}" />
<meta name="twitter:creator" content="${twitterHandle}" />

<!-- Tags de Busca Padrão -->
<title>${title}</title>
<meta name="description" content="${description}" />`;

  const nextJsCode = `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title}',
  description: '${description}',
  openGraph: {
    title: '${title}',
    description: '${description}',
    url: '${siteUrl}',
    siteName: '${siteName}',
    locale: '${locale}',
    type: 'website',
    images: [
      {
        url: '${imageUrl}',
        width: 1200,
        height: 630,
        alt: '${title}',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title}',
    description: '${description}',
    creator: '${twitterHandle}',
    images: ['${imageUrl}'],
  },
};`;

  const nuxtCode = `useSeoMeta({
  title: '${title}',
  ogTitle: '${title}',
  description: '${description}',
  ogDescription: '${description}',
  ogImage: '${imageUrl}',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogUrl: '${siteUrl}',
  ogSiteName: '${siteName}',
  ogLocale: '${locale}',
  twitterCard: 'summary_large_image',
  twitterTitle: '${title}',
  twitterDescription: '${description}',
  twitterImage: '${imageUrl}',
  twitterSite: '${twitterHandle}',
});`;

  const astroCode = `---
// Inserir no Layout ou Página Astro
const title = "${title}";
const description = "${description}";
const ogImage = "${imageUrl}";
const siteUrl = "${siteUrl}";
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  
  <meta property="og:type" content="website" />
  <meta property="og:url" content={siteUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</head>`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'html':
        return htmlCode;
      case 'nextjs':
        return nextJsCode;
      case 'nuxt':
        return nuxtCode;
      case 'astro':
        return astroCode;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getActiveCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f1115] border border-[#ffffff15] rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#ffffff10] flex items-center justify-between bg-[#16181d]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#f9e79f] font-['Cormorant_Garamond',serif] italic tracking-wide">
                Gerador de Meta Tags &amp; Open Graph
              </h3>
              <p className="text-xs text-[#71717a]">
                Código pronto para colar no cabeçalho do seu site
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#27272a] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split in 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              Configurações da Página
            </h4>

            {/* Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-medium text-[#a1a1aa]">Título da Página (og:title)</label>
                <span className={`text-[10px] ${title.length > 60 ? 'text-amber-400' : 'text-[#71717a]'}`}>
                  {title.length}/60 carac.
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título impactante"
                className="w-full px-3 py-2 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-medium text-[#a1a1aa]">Descrição (og:description)</label>
                <span className={`text-[10px] ${description.length > 160 ? 'text-amber-400' : 'text-[#71717a]'}`}>
                  {description.length}/160 carac.
                </span>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve resumo da página para cards sociais..."
                className="w-full px-3 py-2 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none resize-none"
              />
            </div>

            {/* Site URL */}
            <div>
              <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1">
                URL da Página (og:url)
              </label>
              <input
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://meusite.com.br/artigo"
                className="w-full px-3 py-2 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] font-mono focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1">
                URL Absoluta da Imagem OG (1200×630)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://meusite.com.br/og-image.png"
                className="w-full px-3 py-2 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] font-mono focus:border-[#d4af37] focus:outline-none"
              />
              <p className="text-[10px] text-[#71717a] mt-1">
                💡 Faça o upload da imagem exportada no seu servidor/CDN e cole o link acima.
              </p>
            </div>

            {/* Site Name & Twitter Handle */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1">
                  Nome do Site
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Minha Marca"
                  className="w-full px-3 py-2 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1">
                  Twitter / X (@)
                </label>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@empresa"
                  className="w-full px-3 py-2 bg-[#16181d] border border-[#ffffff15] rounded-xl text-xs text-[#e5e5e5] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Code Generator */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              {/* Framework Format Tabs */}
              <div className="flex items-center gap-1 bg-[#16181d] p-1 rounded-xl border border-[#ffffff10]">
                {(
                  [
                    { id: 'html', label: 'HTML <head>' },
                    { id: 'nextjs', label: 'Next.js App' },
                    { id: 'astro', label: 'Astro' },
                    { id: 'nuxt', label: 'Nuxt' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#d4af37] text-black shadow-sm'
                        : 'text-[#a1a1aa] hover:text-[#e5e5e5]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                    : 'bg-[#d4af37] hover:bg-[#c19a2e] text-black shadow-md shadow-[#d4af3720]'
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
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Box */}
            <div className="flex-1 bg-[#090b0e] border border-[#ffffff15] rounded-2xl p-4 overflow-auto max-h-[380px] font-mono text-[11px] leading-relaxed text-[#a5b4fc]">
              <pre className="whitespace-pre">{getActiveCode()}</pre>
            </div>

            {/* Help callout */}
            <div className="mt-3 p-3 rounded-xl bg-[#16181d]/80 border border-[#ffffff10] flex items-start gap-2.5 text-[11px] text-[#a1a1aa]">
              <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <span>
                As dimensões <strong>1200×630</strong> são ideais para WhatsApp, Facebook, LinkedIn, Twitter, Discord e Slack, garantindo que o card apareça em resolução máxima sem cortes.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#ffffff10] bg-[#16181d]/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#27272a] hover:bg-[#3f3f46] text-[#e5e5e5] transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
