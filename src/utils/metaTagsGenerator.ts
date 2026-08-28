import { MetaTagsConfig, FrameworkType } from '../types';

export const INITIAL_METATAGS_CONFIG: MetaTagsConfig = {
  pageTitle: 'Meu Super Projeto — Plataforma Completa de Soluções Digitais',
  metaDescription: 'Descubra a melhor plataforma para acelerar seu negócio com alta performance, segurança de ponta e design inovador.',
  canonicalUrl: 'https://meusite.com.br',
  keywords: 'desenvolvimento, saas, marketing digital, performance, tecnologia, web',
  author: 'Equipe do Projeto',
  publisher: 'Minha Empresa Ltda',
  copyright: '2026 Minha Empresa',
  robotsIndex: true,
  robotsFollow: true,
  robotsNoArchive: false,
  robotsNoSnippet: false,
  robotsMaxImagePreview: 'large',
  themeColor: '#0a0a0a',
  language: 'pt-BR',
  viewport: 'width=device-width, initial-scale=1.0',

  ogType: 'website',
  ogTitle: 'Meu Super Projeto — Plataforma Completa de Soluções Digitais',
  ogDescription: 'Descubra a melhor plataforma para acelerar seu negócio com alta performance, segurança de ponta e design inovador.',
  ogUrl: 'https://meusite.com.br',
  ogImageUrl: 'https://meusite.com.br/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Banner de pré-visualização de Meu Super Projeto',
  ogImageType: 'image/png',
  ogSiteName: 'Minha Empresa',
  ogLocale: 'pt_BR',

  articlePublishedTime: '2026-08-20T10:00:00Z',
  articleModifiedTime: '2026-08-25T14:30:00Z',
  articleAuthor: 'João Silva',
  articleSection: 'Tecnologia',
  articleTags: 'SaaS, Startups, Web Development',

  productPrice: '99.00',
  productCurrency: 'BRL',
  productAvailability: 'in stock',

  twitterCard: 'summary_large_image',
  twitterSite: '@minhaempresa',
  twitterCreator: '@fundador',
  twitterTitle: 'Meu Super Projeto — Plataforma Completa de Soluções Digitais',
  twitterDescription: 'Descubra a melhor plataforma para acelerar seu negócio com alta performance e design inovador.',
  twitterImage: 'https://meusite.com.br/og-image.png',
  twitterImageAlt: 'Banner de pré-visualização de Meu Super Projeto',

  enableSchema: true,
  schemaType: 'WebSite',
  schemaOrgName: 'Minha Empresa',
  schemaOrgLogo: 'https://meusite.com.br/logo.png',
  schemaSocialLinks: 'https://twitter.com/minhaempresa, https://linkedin.com/company/minhaempresa, https://instagram.com/minhaempresa',

  faviconUrl: 'https://meusite.com.br/favicon.ico',
  appleTouchIconUrl: 'https://meusite.com.br/apple-touch-icon.png',
  manifestUrl: 'https://meusite.com.br/manifest.json',
};

export interface SeoIssue {
  type: 'error' | 'warning' | 'success';
  title: string;
  message: string;
  field?: keyof MetaTagsConfig;
}

export function auditSeoConfig(config: MetaTagsConfig): {
  score: number;
  issues: SeoIssue[];
} {
  const issues: SeoIssue[] = [];
  let score = 100;

  // Title Audit
  const titleLen = config.pageTitle.trim().length;
  if (!titleLen) {
    score -= 25;
    issues.push({
      type: 'error',
      title: 'Título da página ausente',
      message: 'O <title> é o fator on-page mais importante para SEO e compartilhamento.',
      field: 'pageTitle',
    });
  } else if (titleLen < 30) {
    score -= 10;
    issues.push({
      type: 'warning',
      title: 'Título muito curto',
      message: `Título com apenas ${titleLen} caracteres. O ideal para o Google é entre 45 e 60 caracteres.`,
      field: 'pageTitle',
    });
  } else if (titleLen > 65) {
    score -= 8;
    issues.push({
      type: 'warning',
      title: 'Título pode ser truncado',
      message: `Título com ${titleLen} caracteres. O Google costuma cortar títulos com mais de 60-65 caracteres no SERP.`,
      field: 'pageTitle',
    });
  } else {
    issues.push({
      type: 'success',
      title: 'Tamanho do Título ideal',
      message: `Ótimo! ${titleLen} caracteres cabem com perfeição nos resultados de busca.`,
    });
  }

  // Description Audit
  const descLen = config.metaDescription.trim().length;
  if (!descLen) {
    score -= 20;
    issues.push({
      type: 'error',
      title: 'Meta description ausente',
      message: 'A meta description resume sua página para os buscadores e melhora a taxa de clique (CTR).',
      field: 'metaDescription',
    });
  } else if (descLen < 60) {
    score -= 8;
    issues.push({
      type: 'warning',
      title: 'Descrição curta',
      message: `Descrição com ${descLen} caracteres. O recomendado é entre 120 e 160 caracteres.`,
      field: 'metaDescription',
    });
  } else if (descLen > 165) {
    score -= 6;
    issues.push({
      type: 'warning',
      title: 'Descrição pode ser cortada',
      message: `Descrição com ${descLen} caracteres. Buscadores cortam resumos após ~160 caracteres.`,
      field: 'metaDescription',
    });
  } else {
    issues.push({
      type: 'success',
      title: 'Meta description no tamanho ideal',
      message: `Excelente (${descLen} caracteres), proporcionando um snippet atraente e legível.`,
    });
  }

  // Canonical URL Audit
  if (!config.canonicalUrl.startsWith('http://') && !config.canonicalUrl.startsWith('https://')) {
    score -= 10;
    issues.push({
      type: 'error',
      title: 'URL Canônica inválida',
      message: 'A URL Canônica precisa ser absoluta iniciando com https:// para evitar duplicação de conteúdo.',
      field: 'canonicalUrl',
    });
  } else if (config.canonicalUrl.startsWith('http://')) {
    score -= 5;
    issues.push({
      type: 'warning',
      title: 'URL Canônica sem HTTPS',
      message: 'Recomenda-se fortemente usar https:// em vez de http:// por segurança e SEO.',
      field: 'canonicalUrl',
    });
  }

  // OG Image Audit
  if (!config.ogImageUrl.trim()) {
    score -= 20;
    issues.push({
      type: 'error',
      title: 'Imagem Open Graph (og:image) ausente',
      message: 'Sem og:image, redes sociais (WhatsApp, LinkedIn, Twitter) não exibirão banner em destaque.',
      field: 'ogImageUrl',
    });
  } else if (!config.ogImageUrl.startsWith('http://') && !config.ogImageUrl.startsWith('https://')) {
    score -= 12;
    issues.push({
      type: 'error',
      title: 'og:image deve ser URL absoluta',
      message: 'Facebook, WhatsApp e Twitter ignoram URLs relativas (ex: "/og.png"). Use "https://seusite.com/og.png".',
      field: 'ogImageUrl',
    });
  } else {
    issues.push({
      type: 'success',
      title: 'og:image configurada com URL absoluta',
      message: 'Pronto para visualização em cards grandes (1200×630).',
    });
  }

  // Twitter / X Audit
  if (config.twitterCard === 'summary_large_image' && !config.twitterImage) {
    score -= 8;
    issues.push({
      type: 'warning',
      title: 'Card Grande do Twitter sem imagem explícita',
      message: 'twitter:image ausente. O Twitter tentará usar o og:image, mas declarar twitter:image é a melhor prática.',
      field: 'twitterImage',
    });
  }

  // Robots Audit
  if (!config.robotsIndex) {
    issues.push({
      type: 'warning',
      title: 'Robots configurado como noindex',
      message: 'Atenção: esta página está instruindo os robôs do Google a NÃO indexarem este conteúdo.',
      field: 'robotsIndex',
    });
  }

  // Schema Audit
  if (config.enableSchema) {
    issues.push({
      type: 'success',
      title: `Dados Estruturados Schema.org (${config.schemaType}) ativos`,
      message: 'Ajuda motores de busca a gerarem Rich Snippets especiais.',
    });
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
  };
}

export function generateSchemaJsonLd(config: MetaTagsConfig): string {
  const sameAsArray = config.schemaSocialLinks
    ? config.schemaSocialLinks
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  let schemaObj: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': config.schemaType,
    name: config.pageTitle,
    description: config.metaDescription,
    url: config.canonicalUrl,
    image: config.ogImageUrl,
  };

  if (config.schemaType === 'WebSite') {
    schemaObj = {
      ...schemaObj,
      publisher: {
        '@type': 'Organization',
        name: config.schemaOrgName || config.ogSiteName,
        logo: config.schemaOrgLogo ? { '@type': 'ImageObject', url: config.schemaOrgLogo } : undefined,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${config.canonicalUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  } else if (config.schemaType === 'Organization') {
    schemaObj = {
      ...schemaObj,
      name: config.schemaOrgName || config.ogSiteName,
      logo: config.schemaOrgLogo,
      sameAs: sameAsArray.length ? sameAsArray : undefined,
    };
  } else if (config.schemaType === 'Article' || config.schemaType === 'BlogPosting') {
    schemaObj = {
      ...schemaObj,
      headline: config.pageTitle,
      datePublished: config.articlePublishedTime,
      dateModified: config.articleModifiedTime || config.articlePublishedTime,
      author: {
        '@type': 'Person',
        name: config.articleAuthor || config.author,
      },
      publisher: {
        '@type': 'Organization',
        name: config.schemaOrgName || config.ogSiteName,
        logo: config.schemaOrgLogo ? { '@type': 'ImageObject', url: config.schemaOrgLogo } : undefined,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': config.canonicalUrl,
      },
    };
  } else if (config.schemaType === 'Product') {
    schemaObj = {
      ...schemaObj,
      name: config.pageTitle,
      offers: {
        '@type': 'Offer',
        price: config.productPrice || '0.00',
        priceCurrency: config.productCurrency || 'BRL',
        availability:
          config.productAvailability === 'in stock'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        url: config.canonicalUrl,
      },
    };
  } else if (config.schemaType === 'SoftwareApplication') {
    schemaObj = {
      ...schemaObj,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
    };
  }

  return JSON.stringify(schemaObj, null, 2);
}

export function generateMetaCode(config: MetaTagsConfig, format: FrameworkType): string {
  const robotsDirectives: string[] = [];
  robotsDirectives.push(config.robotsIndex ? 'index' : 'noindex');
  robotsDirectives.push(config.robotsFollow ? 'follow' : 'nofollow');
  if (config.robotsNoArchive) robotsDirectives.push('noarchive');
  if (config.robotsNoSnippet) robotsDirectives.push('nosnippet');
  if (config.robotsMaxImagePreview !== 'standard') {
    robotsDirectives.push(`max-image-preview:${config.robotsMaxImagePreview}`);
  }
  const robotsString = robotsDirectives.join(', ');

  const schemaJson = config.enableSchema ? generateSchemaJsonLd(config) : '';

  switch (format) {
    case 'html':
      return `<!DOCTYPE html>
<html lang="${config.language}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="${config.viewport}" />
  <title>${config.pageTitle}</title>

  <!-- Metadados Primários & SEO -->
  <meta name="title" content="${config.pageTitle}" />
  <meta name="description" content="${config.metaDescription}" />
  <meta name="keywords" content="${config.keywords}" />
  <meta name="author" content="${config.author}" />
  <meta name="robots" content="${robotsString}" />
  <link rel="canonical" href="${config.canonicalUrl}" />
  <meta name="theme-color" content="${config.themeColor}" />

  <!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
  <meta property="og:type" content="${config.ogType}" />
  <meta property="og:url" content="${config.ogUrl || config.canonicalUrl}" />
  <meta property="og:title" content="${config.ogTitle || config.pageTitle}" />
  <meta property="og:description" content="${config.ogDescription || config.metaDescription}" />
  <meta property="og:image" content="${config.ogImageUrl}" />
  <meta property="og:image:width" content="${config.ogImageWidth}" />
  <meta property="og:image:height" content="${config.ogImageHeight}" />
  <meta property="og:image:alt" content="${config.ogImageAlt || config.ogTitle || config.pageTitle}" />
  <meta property="og:image:type" content="${config.ogImageType}" />
  <meta property="og:site_name" content="${config.ogSiteName}" />
  <meta property="og:locale" content="${config.ogLocale}" />${
    config.ogType === 'article' && config.articlePublishedTime
      ? `\n  <meta property="article:published_time" content="${config.articlePublishedTime}" />`
      : ''
  }${
    config.ogType === 'article' && config.articleAuthor
      ? `\n  <meta property="article:author" content="${config.articleAuthor}" />`
      : ''
  }${
    config.ogType === 'article' && config.articleSection
      ? `\n  <meta property="article:section" content="${config.articleSection}" />`
      : ''
  }

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="${config.twitterCard}" />
  <meta name="twitter:url" content="${config.canonicalUrl}" />
  <meta name="twitter:title" content="${config.twitterTitle || config.ogTitle || config.pageTitle}" />
  <meta name="twitter:description" content="${config.twitterDescription || config.ogDescription || config.metaDescription}" />
  <meta name="twitter:image" content="${config.twitterImage || config.ogImageUrl}" />
  <meta name="twitter:image:alt" content="${config.twitterImageAlt || config.ogImageAlt}" />
  <meta name="twitter:site" content="${config.twitterSite}" />
  <meta name="twitter:creator" content="${config.twitterCreator}" />

  <!-- Favicons & Manifest -->
  <link rel="icon" href="${config.faviconUrl}" />
  <link rel="apple-touch-icon" href="${config.appleTouchIconUrl}" />
  <link rel="manifest" href="${config.manifestUrl}" />${
    config.enableSchema
      ? `\n\n  <!-- Schema.org JSON-LD (Rich Results) -->
  <script type="application/ld+json">
${schemaJson}
  </script>`
      : ''
  }
</head>
<body>
  <!-- Conteúdo da página -->
</body>
</html>`;

    case 'nextjs-app':
      return `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${config.pageTitle.replace(/'/g, "\\'")}',
  description: '${config.metaDescription.replace(/'/g, "\\'")}',
  keywords: [${config.keywords.split(',').map(k => `'${k.trim()}'`).join(', ')}],
  authors: [{ name: '${config.author}' }],
  creator: '${config.author}',
  publisher: '${config.publisher}',
  metadataBase: new URL('${config.canonicalUrl}'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: ${config.robotsIndex},
    follow: ${config.robotsFollow},
    nocache: ${config.robotsNoArchive},
    googleBot: {
      index: ${config.robotsIndex},
      follow: ${config.robotsFollow},
      'max-video-preview': -1,
      'max-image-preview': '${config.robotsMaxImagePreview}',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: '${config.ogType}',
    locale: '${config.ogLocale}',
    url: '${config.canonicalUrl}',
    siteName: '${config.ogSiteName.replace(/'/g, "\\'")}',
    title: '${(config.ogTitle || config.pageTitle).replace(/'/g, "\\'")}',
    description: '${(config.ogDescription || config.metaDescription).replace(/'/g, "\\'")}',
    images: [
      {
        url: '${config.ogImageUrl}',
        width: ${config.ogImageWidth},
        height: ${config.ogImageHeight},
        alt: '${(config.ogImageAlt || config.pageTitle).replace(/'/g, "\\'")}',
      },
    ],
  },
  twitter: {
    card: '${config.twitterCard}',
    title: '${(config.twitterTitle || config.pageTitle).replace(/'/g, "\\'")}',
    description: '${(config.twitterDescription || config.metaDescription).replace(/'/g, "\\'")}',
    site: '${config.twitterSite}',
    creator: '${config.twitterCreator}',
    images: ['${config.twitterImage || config.ogImageUrl}'],
  },
  icons: {
    icon: '${config.faviconUrl}',
    apple: '${config.appleTouchIconUrl}',
  },
  manifest: '${config.manifestUrl}',
};${
  config.enableSchema
    ? `\n\n// Para injetar o Schema.org JSON-LD na sua página (page.tsx):
export function StructuredData() {
  const jsonLd = ${schemaJson};
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}`
    : ''
}`;

    case 'nextjs-pages':
      return `import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        <title>${config.pageTitle}</title>
        <meta name="description" content="${config.metaDescription}" />
        <meta name="keywords" content="${config.keywords}" />
        <meta name="robots" content="${robotsString}" />
        <link rel="canonical" href="${config.canonicalUrl}" />

        {/* Open Graph */}
        <meta property="og:type" content="${config.ogType}" />
        <meta property="og:url" content="${config.canonicalUrl}" />
        <meta property="og:title" content="${config.ogTitle || config.pageTitle}" />
        <meta property="og:description" content="${config.ogDescription || config.metaDescription}" />
        <meta property="og:image" content="${config.ogImageUrl}" />
        <meta property="og:image:width" content="${config.ogImageWidth}" />
        <meta property="og:image:height" content="${config.ogImageHeight}" />
        <meta property="og:site_name" content="${config.ogSiteName}" />

        {/* Twitter */}
        <meta name="twitter:card" content="${config.twitterCard}" />
        <meta name="twitter:title" content="${config.twitterTitle || config.pageTitle}" />
        <meta name="twitter:description" content="${config.twitterDescription || config.metaDescription}" />
        <meta name="twitter:image" content="${config.twitterImage || config.ogImageUrl}" />
        <meta name="twitter:site" content="${config.twitterSite}" />

        <link rel="icon" href="${config.faviconUrl}" />
      </Head>
      <main>
        {/* Conteúdo */}
      </main>
    </>
  );
}`;

    case 'astro':
      return `---
// Layout ou Página Astro (src/layouts/Layout.astro)
interface Props {
  title?: string;
  description?: string;
  image?: string;
}

const {
  title = "${config.pageTitle}",
  description = "${config.metaDescription}",
  image = "${config.ogImageUrl}",
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, "${config.canonicalUrl}");
---

<!DOCTYPE html>
<html lang="${config.language}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="${config.viewport}" />
    <link rel="icon" href="${config.faviconUrl}" />
    <link rel="canonical" href={canonicalURL} />

    <!-- Primários -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="robots" content="${robotsString}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${config.ogType}" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:site_name" content="${config.ogSiteName}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="${config.twitterCard}" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:site" content="${config.twitterSite}" />${
      config.enableSchema
        ? `\n\n    <!-- Schema JSON-LD -->
    <script type="application/ld+json" set:html={JSON.stringify(${schemaJson})} />`
        : ''
    }
  </head>
  <body>
    <slot />
  </body>
</html>`;

    case 'nuxt':
      return `// Em páginas ou layouts Nuxt 3 (script setup)
useSeoMeta({
  title: '${config.pageTitle.replace(/'/g, "\\'")}',
  ogTitle: '${(config.ogTitle || config.pageTitle).replace(/'/g, "\\'")}',
  description: '${config.metaDescription.replace(/'/g, "\\'")}',
  ogDescription: '${(config.ogDescription || config.metaDescription).replace(/'/g, "\\'")}',
  ogImage: '${config.ogImageUrl}',
  ogImageWidth: ${config.ogImageWidth},
  ogImageHeight: ${config.ogImageHeight},
  ogImageType: '${config.ogImageType}',
  ogUrl: '${config.canonicalUrl}',
  ogSiteName: '${config.ogSiteName.replace(/'/g, "\\'")}',
  ogLocale: '${config.ogLocale}',
  twitterCard: '${config.twitterCard}',
  twitterTitle: '${(config.twitterTitle || config.pageTitle).replace(/'/g, "\\'")}',
  twitterDescription: '${(config.twitterDescription || config.metaDescription).replace(/'/g, "\\'")}',
  twitterImage: '${config.twitterImage || config.ogImageUrl}',
  twitterSite: '${config.twitterSite}',
  robots: '${robotsString}',
});

useHead({
  htmlAttrs: {
    lang: '${config.language}',
  },
  link: [
    { rel: 'canonical', href: '${config.canonicalUrl}' },
    { rel: 'icon', href: '${config.faviconUrl}' },
    { rel: 'apple-touch-icon', href: '${config.appleTouchIconUrl}' },
  ],${
    config.enableSchema
      ? `\n  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(${schemaJson}),
    },
  ],`
      : ''
  }
});`;

    case 'sveltekit':
      return `<svelte:head>
  <title>${config.pageTitle}</title>
  <meta name="description" content="${config.metaDescription}" />
  <meta name="keywords" content="${config.keywords}" />
  <meta name="robots" content="${robotsString}" />
  <link rel="canonical" href="${config.canonicalUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="${config.ogType}" />
  <meta property="og:url" content="${config.canonicalUrl}" />
  <meta property="og:title" content="${config.ogTitle || config.pageTitle}" />
  <meta property="og:description" content="${config.ogDescription || config.metaDescription}" />
  <meta property="og:image" content="${config.ogImageUrl}" />
  <meta property="og:image:width" content="${config.ogImageWidth}" />
  <meta property="og:image:height" content="${config.ogImageHeight}" />
  <meta property="og:site_name" content="${config.ogSiteName}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="${config.twitterCard}" />
  <meta name="twitter:title" content="${config.twitterTitle || config.pageTitle}" />
  <meta name="twitter:description" content="${config.twitterDescription || config.metaDescription}" />
  <meta name="twitter:image" content="${config.twitterImage || config.ogImageUrl}" />
  <meta name="twitter:site" content="${config.twitterSite}" />

  <link rel="icon" href="${config.faviconUrl}" />
</svelte:head>`;

    case 'remix':
      return `import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: '${config.pageTitle.replace(/'/g, "\\'")}' },
    { name: 'description', content: '${config.metaDescription.replace(/'/g, "\\'")}' },
    { name: 'keywords', content: '${config.keywords.replace(/'/g, "\\'")}' },
    { name: 'robots', content: '${robotsString}' },
    { tagName: 'link', rel: 'canonical', href: '${config.canonicalUrl}' },
    
    // Open Graph
    { property: 'og:type', content: '${config.ogType}' },
    { property: 'og:url', content: '${config.canonicalUrl}' },
    { property: 'og:title', content: '${(config.ogTitle || config.pageTitle).replace(/'/g, "\\'")}' },
    { property: 'og:description', content: '${(config.ogDescription || config.metaDescription).replace(/'/g, "\\'")}' },
    { property: 'og:image', content: '${config.ogImageUrl}' },
    { property: 'og:image:width', content: '${config.ogImageWidth}' },
    { property: 'og:image:height', content: '${config.ogImageHeight}' },
    { property: 'og:site_name', content: '${config.ogSiteName.replace(/'/g, "\\'")}' },

    // Twitter
    { name: 'twitter:card', content: '${config.twitterCard}' },
    { name: 'twitter:title', content: '${(config.twitterTitle || config.pageTitle).replace(/'/g, "\\'")}' },
    { name: 'twitter:description', content: '${(config.twitterDescription || config.metaDescription).replace(/'/g, "\\'")}' },
    { name: 'twitter:image', content: '${config.twitterImage || config.ogImageUrl}' },
    { name: 'twitter:site', content: '${config.twitterSite}' },
  ];
};`;

    case 'wordpress':
      return `<?php
/**
 * Adicione este trecho no arquivo functions.php do seu tema WordPress
 */
add_action('wp_head', function () {
  if (is_front_page() || is_home()) {
    ?>
    <!-- Metadados de SEO & Social Customizados -->
    <meta name="description" content="<?php echo esc_attr('${config.metaDescription}'); ?>">
    <link rel="canonical" href="<?php echo esc_url('${config.canonicalUrl}'); ?>">
    
    <!-- Open Graph -->
    <meta property="og:type" content="${config.ogType}">
    <meta property="og:url" content="<?php echo esc_url('${config.canonicalUrl}'); ?>">
    <meta property="og:title" content="<?php echo esc_attr('${config.ogTitle || config.pageTitle}'); ?>">
    <meta property="og:description" content="<?php echo esc_attr('${config.ogDescription || config.metaDescription}'); ?>">
    <meta property="og:image" content="<?php echo esc_url('${config.ogImageUrl}'); ?>">
    <meta property="og:image:width" content="${config.ogImageWidth}">
    <meta property="og:image:height" content="${config.ogImageHeight}">
    <meta property="og:site_name" content="<?php echo esc_attr('${config.ogSiteName}'); ?>">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="${config.twitterCard}">
    <meta name="twitter:title" content="<?php echo esc_attr('${config.twitterTitle || config.pageTitle}'); ?>">
    <meta name="twitter:description" content="<?php echo esc_attr('${config.twitterDescription || config.metaDescription}'); ?>">
    <meta name="twitter:image" content="<?php echo esc_url('${config.twitterImage || config.ogImageUrl}'); ?>">
    <meta name="twitter:site" content="<?php echo esc_attr('${config.twitterSite}'); ?>">
    <?php
  }
});
`;

    case 'jsonld':
      return `<script type="application/ld+json">
${schemaJson}
</script>`;

    default:
      return '';
  }
}
