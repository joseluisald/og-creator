export type BgFitMode = 'cover' | 'contain' | 'stretch' | 'blur-fill';

export type AlignmentMode = 'center' | 'center-top' | 'center-bottom' | 'center-left' | 'center-right';

export interface BgConfig {
  sourceType: 'image' | 'gradient' | 'color';
  imageUrl: string | null;
  imageFileName?: string;
  imageNaturalWidth?: number;
  imageNaturalHeight?: number;
  fitMode: BgFitMode;
  scale: number; // 0.5 to 2.0 (default 1.0)
  offsetX: number; // -300 to 300
  offsetY: number; // -300 to 300
  blur: number; // 0 to 50
  brightness: number; // 0 to 200 (default 100)
  contrast: number; // 0 to 200 (default 100)
  saturation: number; // 0 to 200 (default 100)
  overlayColor: string; // e.g. '#000000'
  overlayOpacity: number; // 0 to 100
  gradientPreset?: string;
  solidColor?: string;
}

export interface KvConfig {
  imageUrl: string | null;
  imageFileName?: string;
  imageNaturalWidth?: number;
  imageNaturalHeight?: number;
  scalePercent: number; // 10 to 100 (relative to canvas safe area, default 60)
  offsetX: number; // -400 to 400
  offsetY: number; // -200 to 200
  alignment: AlignmentMode;
  borderRadius: number; // 0 to 100 (or 'circle' style)
  isCircle: boolean;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number; // 0 to 80
  shadowOffsetY: number; // -50 to 50
  shadowOpacity: number; // 0 to 100
  borderWidth: number; // 0 to 20
  borderColor: string;
  glowEnabled: boolean;
  glowColor: string;
  glowBlur: number;
}

export interface TextOverlayConfig {
  enabled: boolean;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;
  badgePosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  titleText: string;
  titleColor: string;
  titleFontSize: number;
  titlePosition: 'below-kv' | 'bottom-center' | 'bottom-left';
  subtitleText: string;
  subtitleColor: string;
}

export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center';

export interface WatermarkConfig {
  enabled: boolean;
  imageUrl: string | null;
  imageFileName?: string;
  position: WatermarkPosition;
  scalePercent: number; // 5 to 50%
  opacity: number; // 0 to 100
  margin: number; // 10 to 120
  rotation: number; // -45 to 45 deg
  filterMode: 'original' | 'grayscale' | 'white' | 'black';
  backgroundStyle: 'none' | 'glass' | 'dark-pill' | 'light-pill';
}

export interface PresetTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  bgConfig: Partial<BgConfig>;
  kvConfig: Partial<KvConfig>;
  textOverlay?: Partial<TextOverlayConfig>;
  thumbnailBg: string;
  previewKvIcon?: string;
}

export interface ExportSettings {
  format: 'png' | 'jpeg' | 'webp';
  quality: number; // 0.1 to 1.0 for jpeg/webp
  fileName: string;
}

export type OgType = 'website' | 'article' | 'product' | 'profile' | 'video.other' | 'book';
export type TwitterCardType = 'summary_large_image' | 'summary' | 'app' | 'player';
export type SchemaType =
  | 'WebSite'
  | 'Organization'
  | 'Article'
  | 'BlogPosting'
  | 'Product'
  | 'SoftwareApplication'
  | 'LocalBusiness'
  | 'FAQPage'
  | 'BreadcrumbList';

export type FrameworkType =
  | 'html'
  | 'nextjs-app'
  | 'nextjs-pages'
  | 'astro'
  | 'nuxt'
  | 'sveltekit'
  | 'remix'
  | 'wordpress'
  | 'jsonld';

export interface MetaTagsConfig {
  // General & Standard Meta
  pageTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string;
  author: string;
  publisher: string;
  copyright: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  robotsNoArchive: boolean;
  robotsNoSnippet: boolean;
  robotsMaxImagePreview: 'large' | 'standard' | 'none';
  themeColor: string;
  language: string;
  viewport: string;

  // Open Graph
  ogType: OgType;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImageUrl: string;
  ogImageWidth: number;
  ogImageHeight: number;
  ogImageAlt: string;
  ogImageType: string;
  ogSiteName: string;
  ogLocale: string;

  // Article Specific
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  articleTags?: string;

  // Product Specific
  productPrice?: string;
  productCurrency?: string;
  productAvailability?: 'in stock' | 'out of stock' | 'preorder';

  // Twitter / X
  twitterCard: TwitterCardType;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterImageAlt: string;

  // Schema.org / JSON-LD
  enableSchema: boolean;
  schemaType: SchemaType;
  schemaOrgName: string;
  schemaOrgLogo: string;
  schemaSocialLinks: string; // comma separated
  schemaFaqItems?: Array<{ question: string; answer: string }>;
  schemaSoftwareCategory?: string;
  schemaRatingValue?: string;
  schemaReviewCount?: string;

  // Icons & PWA
  faviconUrl: string;
  appleTouchIconUrl: string;
  manifestUrl: string;
}

export type AppSubView = 'home' | 'og-studio' | 'meta-tags' | 'robots-sitemap' | 'llms-txt';

export interface LlmsLinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  section: 'core' | 'optional' | 'api' | 'custom';
  contentMarkdown?: string;
}

export interface LlmsTxtConfig {
  projectName: string;
  summary: string;
  detailedOverview: string;
  siteUrl: string;
  contactOrMaintainer: string;
  customSections: string;
  links: LlmsLinkItem[];
  enableFullTxt: boolean;
  fullTxtHeaderNotice: string;
}

export interface SitemapUrlItem {
  id: string;
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  images?: Array<{ loc: string; title?: string }>;
  hreflangs?: Array<{ lang: string; href: string }>;
}

export interface AiBotRule {
  botName: string;
  userAgent: string;
  description: string;
  category: 'llm_training' | 'search_ai' | 'scraper';
  allowed: boolean;
}

export interface RobotsConfig {
  siteUrl: string;
  allowAllSearchEngines: boolean;
  disallowPaths: string[];
  allowPaths: string[];
  crawlDelay?: number;
  sitemapUrl: string;
  aiBots: AiBotRule[];
  customRules: string;
  enableSecurityTxt: boolean;
  securityContact: string;
  securityExpires: string;
  securityEncryption: string;
  securityPolicy: string;
  securityCanonical: string;
}

