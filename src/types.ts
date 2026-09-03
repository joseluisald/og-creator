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

export type AppSubView =
  | 'home'
  | 'serp-simulator'
  | 'favicon-studio'
  | 'security-headers'
  | 'redirects-generator'
  | 'og-studio'
  | 'meta-tags'
  | 'robots-sitemap'
  | 'llms-txt';

export interface SerpSnippetConfig {
  title: string;
  description: string;
  url: string;
  displayUrl: string;
  primaryKeyword: string;
  faviconEmoji: string;
  faviconUrl?: string;
  
  // Date badge
  showDate: boolean;
  dateString: string;
  
  // Rich Snippets: Rating
  enableRating: boolean;
  ratingValue: number;
  reviewCount: number;
  maxRating: number;
  
  // Rich Snippets: Product
  enableProduct: boolean;
  price: string;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  
  // Rich Snippets: Sitelinks
  enableSitelinks: boolean;
  sitelinks: Array<{ id: string; title: string; snippet: string; url: string }>;
  
  // Rich Snippets: FAQ
  enableFaq: boolean;
  faqItems: Array<{ id: string; question: string; answer: string }>;
  
  // Thumbnail
  enableThumbnail: boolean;
  thumbnailUrl: string;
}

export interface SerpCtrAnalysis {
  score: number; // 0-100
  titlePixelWidth: number;
  titleCharCount: number;
  isTitleTruncated: boolean;
  descPixelWidth: number;
  descCharCount: number;
  isDescTruncated: boolean;
  checks: Array<{
    id: string;
    label: string;
    passed: boolean;
    importance: 'high' | 'medium' | 'low';
    feedback: string;
  }>;
}

// ==========================================
// Favicon & Web Manifest Studio Types
// ==========================================
export type FaviconSourceType = 'image' | 'emoji' | 'text' | 'icon';
export type FaviconShape = 'square' | 'rounded' | 'circle' | 'squircle';

export interface FaviconConfig {
  sourceType: FaviconSourceType;
  imageUrl: string | null;
  imageFileName?: string;
  emoji: string;
  text: string;
  fontFamily: string;
  textColor: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
  bgGradientEnd?: string;
  useGradient: boolean;
  shape: FaviconShape;
  borderRadiusPercent: number; // 0 to 50
  paddingPercent: number; // 0 to 40
  borderWidth: number; // 0 to 20
  borderColor: string;
  shadowBlur: number;
  shadowColor: string;
  scale: number; // 20 to 250% (redimensionamento / zoom do elemento)
  offsetX: number; // -50 to +50% de deslocamento horizontal
  offsetY: number; // -50 to +50% de deslocamento vertical
  rotation: number; // -180 to +180 graus
  imageFit: 'contain' | 'cover' | 'fill';
  opacity?: number; // 0 to 100
}

export interface WebManifestConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'portrait' | 'landscape';
  themeColor: string;
  backgroundColor: string;
  scope: string;
  lang: string;
  dir: 'ltr' | 'rtl' | 'auto';
  id: string;
  categories: string[];
}

// ==========================================
// Security Headers Studio Types
// ==========================================
export type HeaderTargetServer =
  | 'apache'
  | 'nginx'
  | 'iis'
  | 'cloudflare'
  | 'vercel'
  | 'netlify'
  | 'nextjs'
  | 'express';

export interface SecurityHeadersConfig {
  // HSTS
  hstsEnabled: boolean;
  hstsMaxAge: number; // in seconds (e.g. 31536000)
  hstsIncludeSubDomains: boolean;
  hstsPreload: boolean;

  // X-Frame-Options
  frameOptions: 'DENY' | 'SAMEORIGIN' | 'OFF';

  // X-Content-Type-Options
  contentTypeOptions: boolean; // nosniff

  // Referrer-Policy
  referrerPolicy:
    | 'strict-origin-when-cross-origin'
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'unsafe-url';

  // Content Security Policy (CSP)
  cspEnabled: boolean;
  cspDefaultSrc: string;
  cspScriptSrc: string;
  cspStyleSrc: string;
  cspImgSrc: string;
  cspFontSrc: string;
  cspConnectSrc: string;
  cspMediaSrc: string;
  cspObjectSrc: string;
  cspFrameAncestors: string;
  cspUpgradeInsecureRequests: boolean;
  cspReportOnly: boolean;

  // Permissions-Policy
  permissionsPolicyEnabled: boolean;
  permCamera: string;
  permMicrophone: string;
  permGeolocation: string;
  permPayment: string;
  permUsb: string;
  permFullscreen: string;

  // Cross Origin Policies
  coop: 'same-origin' | 'same-origin-allow-popups' | 'unsafe-none' | 'OFF';
  coep: 'require-corp' | 'credentialless' | 'unsafe-none' | 'OFF';
  corp: 'same-origin' | 'same-site' | 'cross-origin' | 'OFF';

  // Legacy X-XSS-Protection
  xssProtection: '1; mode=block' | '0' | 'OFF';
}

// ==========================================
// Redirects & Web Rules Types
// ==========================================
export type RedirectType = '301' | '302' | '307' | '308' | '410';
export type RedirectTargetServer =
  | 'htaccess'
  | 'nginx'
  | 'iis'
  | 'redirects'
  | 'vercel'
  | 'nextjs'
  | 'php';

export interface RedirectRuleItem {
  id: string;
  source: string;
  destination: string;
  statusCode: RedirectType;
  exactMatch: boolean;
  caseInsensitive: boolean;
  notes?: string;
}

export interface CanonicalRedirectConfig {
  forceHttps: boolean;
  domainName: string;
  forceWwwMode: 'keep' | 'force-www' | 'force-non-www';
  trailingSlashMode: 'keep' | 'force-slash' | 'remove-slash';
  lowercaseUrls: boolean;
  blockBadBots: boolean;
  blockHiddenFiles: boolean;
  enableCorsAll: boolean;
  customHeaderRules?: Array<{ name: string; value: string }>;
}

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

