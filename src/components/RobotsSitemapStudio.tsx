import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  FileCode2,
  FileSpreadsheet,
  Lock,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Sparkles,
  Bot,
  Globe,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Zap,
  ArrowRight,
  Code2,
  RefreshCw,
  ExternalLink,
  Layers,
  HelpCircle,
  Calendar,
  Eye
} from 'lucide-react';
import { RobotsConfig, SitemapUrlItem, AiBotRule } from '../types';

interface RobotsSitemapStudioProps {
  triggerToast: (msg: string) => void;
  onNavigateToMetaTags?: () => void;
}

const DEFAULT_AI_BOTS: AiBotRule[] = [
  {
    botName: 'OpenAI GPTBot',
    userAgent: 'GPTBot',
    description: 'Scraper da OpenAI usado para treinar modelos GPT / ChatGPT.',
    category: 'llm_training',
    allowed: false,
  },
  {
    botName: 'ChatGPT Browsing',
    userAgent: 'ChatGPT-User',
    description: 'Acessos sob demanda quando um usuário pede ao ChatGPT para ler sua página.',
    category: 'search_ai',
    allowed: true,
  },
  {
    botName: 'Google Extended',
    userAgent: 'Google-Extended',
    description: 'Crawler de treinamento para modelos Gemini e Vertex AI do Google.',
    category: 'llm_training',
    allowed: false,
  },
  {
    botName: 'Anthropic ClaudeBot',
    userAgent: 'ClaudeBot',
    description: 'Coletor de dados da Anthropic para treinamento da família Claude.',
    category: 'llm_training',
    allowed: false,
  },
  {
    botName: 'Claude Realtime Web',
    userAgent: 'Claude-Web',
    description: 'Requisições ao vivo do assistente Claude para pesquisar páginas na web.',
    category: 'search_ai',
    allowed: true,
  },
  {
    botName: 'Perplexity AI Bot',
    userAgent: 'PerplexityBot',
    description: 'Buscador inteligente da Perplexity para indexação e respostas com fontes.',
    category: 'search_ai',
    allowed: true,
  },
  {
    botName: 'Common Crawl (CCBot)',
    userAgent: 'CCBot',
    description: 'Base pública massiva usada por centenas de IAs para treinamento geral.',
    category: 'scraper',
    allowed: false,
  },
  {
    botName: 'ByteDance Bytespider',
    userAgent: 'Bytespider',
    description: 'Crawler do TikTok / Douyin para modelos multimodais de IA.',
    category: 'scraper',
    allowed: false,
  },
  {
    botName: 'Applebot Extended',
    userAgent: 'Applebot-Extended',
    description: 'Crawler da Apple para alimentar dados do Apple Intelligence.',
    category: 'llm_training',
    allowed: false,
  },
  {
    botName: 'Cohere AI',
    userAgent: 'cohere-ai',
    description: 'Crawler de LLMs empresariais da plataforma Cohere.',
    category: 'llm_training',
    allowed: false,
  },
  {
    botName: 'Meta External Agent',
    userAgent: 'Meta-ExternalAgent',
    description: 'Crawler da Meta para modelos Llama e busca no WhatsApp/Instagram.',
    category: 'llm_training',
    allowed: false,
  }
];

const INITIAL_SITEMAP_URLS: SitemapUrlItem[] = [
  {
    id: '1',
    loc: 'https://meusite.com/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '1.0',
  },
  {
    id: '2',
    loc: 'https://meusite.com/sobre',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    id: '3',
    loc: 'https://meusite.com/recursos',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    id: '4',
    loc: 'https://meusite.com/precos',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    id: '5',
    loc: 'https://meusite.com/blog',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '0.7',
  },
  {
    id: '6',
    loc: 'https://meusite.com/contato',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.5',
  },
];

export const RobotsSitemapStudio: React.FC<RobotsSitemapStudioProps> = ({
  triggerToast,
  onNavigateToMetaTags,
}) => {
  const [activeTab, setActiveTab] = useState<'robots' | 'sitemap' | 'security' | 'simulator'>('robots');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Robots state
  const [siteDomain, setSiteDomain] = useState<string>('https://meusite.com');
  const [allowSearchEngines, setAllowSearchEngines] = useState<boolean>(true);
  const [disallowedPaths, setDisallowedPaths] = useState<string[]>([
    '/api/',
    '/admin/',
    '/dashboard/private/',
    '/checkout/session/',
    '/*?*utm_*'
  ]);
  const [newDisallowPath, setNewDisallowPath] = useState<string>('');
  const [allowedPaths, setAllowedPaths] = useState<string[]>([
    '/api/public/',
    '/static/media/'
  ]);
  const [newAllowPath, setNewAllowPath] = useState<string>('');
  const [crawlDelay, setCrawlDelay] = useState<number | undefined>(undefined);
  const [aiBots, setAiBots] = useState<AiBotRule[]>(DEFAULT_AI_BOTS);
  const [customRobotsText, setCustomRobotsText] = useState<string>('');

  // Sitemap state
  const [sitemapUrls, setSitemapUrls] = useState<SitemapUrlItem[]>(INITIAL_SITEMAP_URLS);
  const [bulkUrlInput, setBulkUrlInput] = useState<string>('');
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'xml' | 'nextjs' | 'nuxt' | 'astro'>('xml');

  // Security.txt & Headers State
  const [securityContact, setSecurityContact] = useState<string>('security@meusite.com');
  const [securityExpires, setSecurityExpires] = useState<string>(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString();
  });
  const [securityPolicy, setSecurityPolicy] = useState<string>('https://meusite.com/security-policy');
  const [securityLanguages, setSecurityLanguages] = useState<string>('pt-BR, en');
  const [securityCanonical, setSecurityCanonical] = useState<string>('https://meusite.com/.well-known/security.txt');

  // Live Simulator state
  const [simTestUrl, setSimTestUrl] = useState<string>('/admin/settings');
  const [simSelectedBot, setSimSelectedBot] = useState<string>('GPTBot');

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerToast('Código copiado para a área de transferência!');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Download helper
  const handleDownloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(`Arquivo ${filename} baixado com sucesso!`);
  };

  // AI Bots Bulk Toggles
  const handleToggleAllAi = (allow: boolean) => {
    setAiBots(prev => prev.map(bot => ({ ...bot, allowed: allow })));
    triggerToast(allow ? 'Todos os crawlers de IA foram liberados!' : 'Todos os crawlers de IA foram bloqueados!');
  };

  const handleAllowOnlySearchAi = () => {
    setAiBots(prev => prev.map(bot => ({
      ...bot,
      allowed: bot.category === 'search_ai'
    })));
    triggerToast('Configurado: Apenas IAs com busca ao vivo permitidas (GPTBot e LLMs de treino bloqueados).');
  };

  const handleToggleSingleBot = (userAgent: string) => {
    setAiBots(prev => prev.map(b => b.userAgent === userAgent ? { ...b, allowed: !b.allowed } : b));
  };

  // Disallow / Allow Path handlers
  const handleAddDisallow = () => {
    if (!newDisallowPath.trim()) return;
    const clean = newDisallowPath.trim().startsWith('/') ? newDisallowPath.trim() : `/${newDisallowPath.trim()}`;
    if (!disallowedPaths.includes(clean)) {
      setDisallowedPaths([...disallowedPaths, clean]);
    }
    setNewDisallowPath('');
  };

  const handleRemoveDisallow = (path: string) => {
    setDisallowedPaths(disallowedPaths.filter(p => p !== path));
  };

  const handleAddAllow = () => {
    if (!newAllowPath.trim()) return;
    const clean = newAllowPath.trim().startsWith('/') ? newAllowPath.trim() : `/${newAllowPath.trim()}`;
    if (!allowedPaths.includes(clean)) {
      setAllowedPaths([...allowedPaths, clean]);
    }
    setNewAllowPath('');
  };

  const handleRemoveAllow = (path: string) => {
    setAllowedPaths(allowedPaths.filter(p => p !== path));
  };

  // Sitemap Handlers
  const handleAddSitemapUrl = () => {
    const newId = Date.now().toString();
    const newItem: SitemapUrlItem = {
      id: newId,
      loc: `${siteDomain.replace(/\/$/, '')}/nova-pagina`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7',
    };
    setSitemapUrls([...sitemapUrls, newItem]);
  };

  const handleUpdateSitemapUrl = (id: string, field: keyof SitemapUrlItem, val: string) => {
    setSitemapUrls(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleRemoveSitemapUrl = (id: string) => {
    setSitemapUrls(prev => prev.filter(item => item.id !== id));
  };

  const handleBulkImportUrls = () => {
    if (!bulkUrlInput.trim()) return;
    const lines = bulkUrlInput.split('\n').map(l => l.trim()).filter(Boolean);
    const today = new Date().toISOString().split('T')[0];

    const generated: SitemapUrlItem[] = lines.map((line, idx) => {
      let finalLoc = line;
      if (!line.startsWith('http://') && !line.startsWith('https://')) {
        const cleanPath = line.startsWith('/') ? line : `/${line}`;
        finalLoc = `${siteDomain.replace(/\/$/, '')}${cleanPath}`;
      }
      return {
        id: `bulk-${Date.now()}-${idx}`,
        loc: finalLoc,
        lastmod: today,
        changefreq: 'monthly',
        priority: '0.7',
      };
    });

    setSitemapUrls([...sitemapUrls, ...generated]);
    setBulkUrlInput('');
    setShowBulkModal(false);
    triggerToast(`${generated.length} URLs adicionadas ao Sitemap!`);
  };

  // Generate robots.txt string
  const generatedRobotsTxt = useMemo(() => {
    const lines: string[] = [];
    lines.push(`# ========================================================`);
    lines.push(`# Robots.txt Gerado pelo MMServer SEO Studio`);
    lines.push(`# Site: ${siteDomain}`);
    lines.push(`# Data: ${new Date().toISOString().split('T')[0]}`);
    lines.push(`# ========================================================`);
    lines.push('');

    // Default search engines
    lines.push('# Regras Padrão para Mecanismos de Busca (Google, Bing, Yahoo, etc.)');
    lines.push('User-agent: *');
    if (!allowSearchEngines) {
      lines.push('Disallow: /');
    } else {
      if (disallowedPaths.length === 0 && allowedPaths.length === 0) {
        lines.push('Allow: /');
      } else {
        disallowedPaths.forEach(p => lines.push(`Disallow: ${p}`));
        allowedPaths.forEach(p => lines.push(`Allow: ${p}`));
      }
      if (crawlDelay) {
        lines.push(`Crawl-delay: ${crawlDelay}`);
      }
    }
    lines.push('');

    // AI & LLM Crawlers Section
    lines.push('# --------------------------------------------------------');
    lines.push('# Proteção & Controle de Crawlers de Inteligência Artificial / LLMs');
    lines.push('# --------------------------------------------------------');

    aiBots.forEach(bot => {
      lines.push(`# ${bot.botName} (${bot.description})`);
      lines.push(`User-agent: ${bot.userAgent}`);
      if (bot.allowed) {
        lines.push('Allow: /');
      } else {
        lines.push('Disallow: /');
      }
      lines.push('');
    });

    // Custom Rules if any
    if (customRobotsText.trim()) {
      lines.push('# Regras Customizadas');
      lines.push(customRobotsText.trim());
      lines.push('');
    }

    // Sitemap Link
    lines.push('# Localização do Sitemap Oficial');
    lines.push(`Sitemap: ${siteDomain.replace(/\/$/, '')}/sitemap.xml`);

    return lines.join('\n');
  }, [siteDomain, allowSearchEngines, disallowedPaths, allowedPaths, crawlDelay, aiBots, customRobotsText]);

  // Generate XML Sitemap string
  const generatedSitemapXml = useMemo(() => {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    lines.push('        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"');
    lines.push('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    lines.push('        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">');

    sitemapUrls.forEach(item => {
      lines.push('  <url>');
      lines.push(`    <loc>${item.loc}</loc>`);
      if (item.lastmod) lines.push(`    <lastmod>${item.lastmod}</lastmod>`);
      if (item.changefreq) lines.push(`    <changefreq>${item.changefreq}</changefreq>`);
      if (item.priority) lines.push(`    <priority>${item.priority}</priority>`);
      lines.push('  </url>');
    });

    lines.push('</urlset>');
    return lines.join('\n');
  }, [sitemapUrls]);

  // Generate Next.js App Router Sitemap & Robots
  const generatedNextjsSitemap = useMemo(() => {
    return `// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
${sitemapUrls
  .map(
    u => `    {
      url: '${u.loc}',
      lastModified: new Date('${u.lastmod || new Date().toISOString()}'),
      changeFrequency: '${u.changefreq}',
      priority: ${u.priority},
    },`
  )
  .join('\n')}
  ];
}
`;
  }, [sitemapUrls]);

  const generatedNextjsRobots = useMemo(() => {
    const blockedAiAgents = aiBots.filter(b => !b.allowed).map(b => `'${b.userAgent}'`);
    return `// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [${allowedPaths.map(p => `'${p}'`).join(', ')}],
        disallow: [${disallowedPaths.map(p => `'${p}'`).join(', ')}],
      },
      ${blockedAiAgents.length > 0 ? `{
        userAgent: [${blockedAiAgents.join(', ')}],
        disallow: ['/'],
      },` : ''}
    ],
    sitemap: '${siteDomain.replace(/\/$/, '')}/sitemap.xml',
  };
}
`;
  }, [siteDomain, allowedPaths, disallowedPaths, aiBots]);

  // Security.txt generator (RFC 9116)
  const generatedSecurityTxt = useMemo(() => {
    const lines: string[] = [];
    lines.push(`# security.txt (RFC 9116)`);
    lines.push(`Contact: mailto:${securityContact}`);
    lines.push(`Expires: ${securityExpires}`);
    lines.push(`Preferred-Languages: ${securityLanguages}`);
    if (securityPolicy) lines.push(`Policy: ${securityPolicy}`);
    if (securityCanonical) lines.push(`Canonical: ${securityCanonical}`);
    return lines.join('\n');
  }, [securityContact, securityExpires, securityLanguages, securityPolicy, securityCanonical]);

  // Security Headers code for Nginx and Next.js
  const generatedSecurityHeadersNext = useMemo(() => {
    return `// next.config.js - Security Headers
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};`;
  }, []);

  // Helper for matching robots path pattern (supporting wildcards like * and $)
  const matchRobotsPath = (pattern: string, path: string): boolean => {
    if (!pattern) return false;
    if (pattern === '/') return true;

    // Convert robots glob pattern to RegExp
    // Escape regex specials except * and $
    const escaped = pattern
      .replace(/([.+?^=!:${}()|[\]/\\])/g, '\\$1')
      .replace(/\*/g, '.*');
    
    const regex = new RegExp(`^${escaped}`);
    return regex.test(path);
  };

  // Simulator logic: test whether simTestUrl is allowed for simSelectedBot
  const simulatorResult = useMemo(() => {
    let cleanPath = simTestUrl.trim();
    if (!cleanPath) cleanPath = '/';

    // Handle full URL inputs gracefully
    try {
      if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
        const parsed = new URL(cleanPath);
        cleanPath = parsed.pathname + parsed.search;
      } else if (cleanPath.includes('.') && cleanPath.includes('/') && !cleanPath.startsWith('/')) {
        const slashIdx = cleanPath.indexOf('/');
        cleanPath = cleanPath.slice(slashIdx);
      } else if (!cleanPath.startsWith('/')) {
        cleanPath = `/${cleanPath}`;
      }
    } catch {
      if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
    }

    const bot = aiBots.find(b => b.userAgent === simSelectedBot);

    // AI Bot specific check
    if (bot) {
      if (!bot.allowed) {
        return {
          allowed: false,
          reason: `Bloqueado explicitamente pelo bloco 'User-agent: ${bot.userAgent} -> Disallow: /'`,
          botName: bot.botName,
          testPath: cleanPath,
        };
      } else {
        return {
          allowed: true,
          reason: `Permitido explicitamente pelo bloco 'User-agent: ${bot.userAgent} -> Allow: /'`,
          botName: bot.botName,
          testPath: cleanPath,
        };
      }
    }

    // Default search engines / User-agent: * rules
    if (!allowSearchEngines) {
      return {
        allowed: false,
        reason: "Bloqueado pelo bloco global 'User-agent: * -> Disallow: /'",
        botName: 'Mecanismos de Busca (*)',
        testPath: cleanPath,
      };
    }

    // Check specific allow exceptions first (Allow takes precedence if matching or longer)
    const matchingAllow = allowedPaths.find(p => matchRobotsPath(p, cleanPath));
    const matchingDisallow = disallowedPaths.find(p => matchRobotsPath(p, cleanPath));

    if (matchingAllow && matchingDisallow) {
      // If both match, the longer/more specific rule wins
      if (matchingAllow.length >= matchingDisallow.length) {
        return {
          allowed: true,
          reason: `Permitido pela regra de exceção mais específica 'Allow: ${matchingAllow}'`,
          botName: simSelectedBot === '*' ? 'Mecanismos de Busca (*)' : simSelectedBot,
          testPath: cleanPath,
        };
      } else {
        return {
          allowed: false,
          reason: `Bloqueado pela regra 'Disallow: ${matchingDisallow}'`,
          botName: simSelectedBot === '*' ? 'Mecanismos de Busca (*)' : simSelectedBot,
          testPath: cleanPath,
        };
      }
    }

    if (matchingAllow) {
      return {
        allowed: true,
        reason: `Permitido pela regra de exceção 'Allow: ${matchingAllow}'`,
        botName: simSelectedBot === '*' ? 'Mecanismos de Busca (*)' : simSelectedBot,
        testPath: cleanPath,
      };
    }

    if (matchingDisallow) {
      return {
        allowed: false,
        reason: `Bloqueado pela regra 'Disallow: ${matchingDisallow}'`,
        botName: simSelectedBot === '*' ? 'Mecanismos de Busca (*)' : simSelectedBot,
        testPath: cleanPath,
      };
    }

    return {
      allowed: true,
      reason: "Permitido pelo padrão aberto 'User-agent: * -> Allow: /'",
      botName: simSelectedBot === '*' ? 'Mecanismos de Busca (*)' : simSelectedBot,
      testPath: cleanPath,
    };
  }, [simTestUrl, simSelectedBot, aiBots, allowSearchEngines, disallowedPaths, allowedPaths]);

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] min-h-[calc(100vh-60px)]">
      {/* Sub-Header Bar */}
      <div className="border-b border-[#ffffff10] bg-[#0f1115] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#d4af3715] text-[#f9e79f] border border-[#d4af3730]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#d4af37]" />
            Robots.txt, Sitemap &amp; AI Shield
          </span>
        </div>

        {/* Global Domain Config & Quick Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#16181d] border border-[#ffffff15] rounded-lg px-3 py-1.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[#71717a]">Domínio:</span>
            <input
              type="text"
              value={siteDomain}
              onChange={(e) => setSiteDomain(e.target.value)}
              className="bg-transparent text-white font-mono outline-none w-48 sm:w-56 focus:text-[#f9e79f]"
              placeholder="https://meusite.com"
            />
          </div>

          {onNavigateToMetaTags && (
            <button
              type="button"
              onClick={onNavigateToMetaTags}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1c20] hover:bg-[#27272a] text-xs text-[#a1a1aa] hover:text-white border border-[#ffffff15] transition cursor-pointer"
            >
              <FileCode2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Ver Meta Tags & Social</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Controls & Builders */}
        <div className="w-full lg:w-[500px] xl:w-[540px] border-r border-[#ffffff10] bg-[#0f1115]/90 flex flex-col">
          {/* Sub Navigation Tabs */}
          <div className="grid grid-cols-4 border-b border-[#ffffff10] bg-[#0a0a0a] text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('robots')}
              className={`py-3 px-2 font-medium flex flex-col items-center gap-1 border-b-2 transition cursor-pointer ${
                activeTab === 'robots'
                  ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                  : 'border-transparent text-[#71717a] hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-[#d4af37]" />
              <span>1. Robots & IA</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sitemap')}
              className={`py-3 px-2 font-medium flex flex-col items-center gap-1 border-b-2 transition cursor-pointer ${
                activeTab === 'sitemap'
                  ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                  : 'border-transparent text-[#71717a] hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-[#d4af37]" />
              <span>2. Sitemap XML</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`py-3 px-2 font-medium flex flex-col items-center gap-1 border-b-2 transition cursor-pointer ${
                activeTab === 'security'
                  ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                  : 'border-transparent text-[#71717a] hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4 text-[#d4af37]" />
              <span>3. Security.txt</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`py-3 px-2 font-medium flex flex-col items-center gap-1 border-b-2 transition cursor-pointer ${
                activeTab === 'simulator'
                  ? 'border-[#d4af37] text-[#f9e79f] bg-[#16181d]'
                  : 'border-transparent text-[#71717a] hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 text-[#d4af37]" />
              <span>4. Simulador</span>
            </button>
          </div>

          {/* Tab 1: Robots.txt & AI Crawler Shield */}
          {activeTab === 'robots' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-160px)] space-y-6">
              {/* AI Shield Card */}
              <div className="bg-[#14161b] border border-[#d4af37]/30 rounded-xl p-4.5 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <h3 className="text-sm font-semibold text-white">Shield de Crawlers de IA (LLMs)</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f9e79f] font-mono uppercase">
                    Anti-Scraping
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa]">
                  Escolha se os robôs de inteligência artificial podem coletar os textos e dados do seu site para treinamento.
                </p>

                {/* Quick Presets for AI */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggleAllAi(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 text-[11px] font-medium transition cursor-pointer"
                  >
                    🚫 Bloquear Todas IAs
                  </button>
                  <button
                    type="button"
                    onClick={handleAllowOnlySearchAi}
                    className="px-2.5 py-1.5 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/30 text-[#f9e79f] text-[11px] font-medium transition cursor-pointer"
                  >
                    🔍 Apenas Busca IA
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAllAi(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-300 text-[11px] font-medium transition cursor-pointer"
                  >
                    ✅ Permitir Todas
                  </button>
                </div>

                {/* Individual Bots Switcher List */}
                <div className="space-y-2 pt-2">
                  {aiBots.map((bot) => (
                    <div
                      key={bot.userAgent}
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition ${
                        bot.allowed
                          ? 'bg-[#181d18] border-emerald-900/40'
                          : 'bg-[#1a1415] border-red-950/50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white">{bot.botName}</span>
                          <code className="text-[10px] bg-[#00000060] px-1.5 py-0.5 rounded text-[#a1a1aa] font-mono">
                            {bot.userAgent}
                          </code>
                        </div>
                        <p className="text-[11px] text-[#71717a] truncate mt-0.5">{bot.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleSingleBot(bot.userAgent)}
                        className={`shrink-0 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                          bot.allowed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {bot.allowed ? 'Permitido' : 'Bloqueado'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standard Search Engines & General Rules */}
              <div className="bg-[#14161b] border border-[#ffffff10] rounded-xl p-4.5 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#d4af37]" />
                  <span>Mecanismos de Busca Tradicionais (Google, Bing)</span>
                </h3>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0f1115] border border-[#ffffff08]">
                  <div>
                    <span className="text-xs font-medium text-white">Permitir indexação geral</span>
                    <p className="text-[11px] text-[#71717a]">Desmarque para bloquear indexação em ambientes de staging/dev.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowSearchEngines}
                    onChange={(e) => setAllowSearchEngines(e.target.checked)}
                    className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
                  />
                </div>

                {/* Disallow Paths Manager */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#a1a1aa]">Caminhos Bloqueados (Disallow:):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDisallowPath}
                      onChange={(e) => setNewDisallowPath(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddDisallow()}
                      placeholder="/admin/ ou /checkout/"
                      className="flex-1 bg-[#0a0a0a] border border-[#ffffff15] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="button"
                      onClick={handleAddDisallow}
                      className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg text-xs font-medium transition cursor-pointer"
                    >
                      + Adicionar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {disallowedPaths.map((path) => (
                      <span
                        key={path}
                        className="inline-flex items-center gap-1 bg-red-950/30 border border-red-800/40 text-red-300 text-xs px-2.5 py-1 rounded-md font-mono"
                      >
                        {path}
                        <button
                          type="button"
                          onClick={() => handleRemoveDisallow(path)}
                          className="hover:text-red-100 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allow Paths Exceptions */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-medium text-[#a1a1aa]">Exceções Permitidas (Allow:):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAllowPath}
                      onChange={(e) => setNewAllowPath(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAllow()}
                      placeholder="/api/public/"
                      className="flex-1 bg-[#0a0a0a] border border-[#ffffff15] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="button"
                      onClick={handleAddAllow}
                      className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg text-xs font-medium transition cursor-pointer"
                    >
                      + Adicionar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {allowedPaths.map((path) => (
                      <span
                        key={path}
                        className="inline-flex items-center gap-1 bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-mono"
                      >
                        {path}
                        <button
                          type="button"
                          onClick={() => handleRemoveAllow(path)}
                          className="hover:text-emerald-100 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: XML Sitemap Builder */}
          {activeTab === 'sitemap' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-160px)] space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Gerenciador de URLs do Sitemap</h3>
                  <p className="text-xs text-[#71717a]">{sitemapUrls.length} páginas cadastradas</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1a1c20] hover:bg-[#27272a] text-xs text-[#d4af37] border border-[#d4af37]/30 transition cursor-pointer"
                  >
                    + Em Massa
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSitemapUrl}
                    className="px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#f9e79f] text-black font-semibold text-xs transition cursor-pointer"
                  >
                    + Nova URL
                  </button>
                </div>
              </div>

              {/* Sitemap URLs List */}
              <div className="space-y-3">
                {sitemapUrls.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-[#14161b] border border-[#ffffff10] rounded-xl p-3.5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-[#d4af37]">#{idx + 1}</span>
                      <input
                        type="text"
                        value={item.loc}
                        onChange={(e) => handleUpdateSitemapUrl(item.id, 'loc', e.target.value)}
                        className="flex-1 bg-[#0a0a0a] border border-[#ffffff15] rounded px-2.5 py-1 text-xs text-white font-mono focus:border-[#d4af37] outline-none"
                        placeholder="https://meusite.com/pagina"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSitemapUrl(item.id)}
                        className="p-1 rounded text-[#71717a] hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                        title="Remover URL"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-[#71717a] uppercase block mb-1">Prioridade</label>
                        <select
                          value={item.priority}
                          onChange={(e) => handleUpdateSitemapUrl(item.id, 'priority', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded px-2 py-1 text-xs text-[#e5e5e5] outline-none focus:border-[#d4af37]"
                        >
                          <option value="1.0">1.0 (Home / Máxima)</option>
                          <option value="0.9">0.9 (Destaques)</option>
                          <option value="0.8">0.8 (Categorias/Páginas)</option>
                          <option value="0.7">0.7 (Artigos/Posts)</option>
                          <option value="0.6">0.6 (Geral)</option>
                          <option value="0.5">0.5 (Contato/Suporte)</option>
                          <option value="0.3">0.3 (Termos/Privacidade)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#71717a] uppercase block mb-1">Frequência</label>
                        <select
                          value={item.changefreq}
                          onChange={(e) => handleUpdateSitemapUrl(item.id, 'changefreq', e.target.value as any)}
                          className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded px-2 py-1 text-xs text-[#e5e5e5] outline-none focus:border-[#d4af37]"
                        >
                          <option value="always">Always</option>
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                          <option value="never">Never</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#71717a] uppercase block mb-1">Modificação</label>
                        <input
                          type="date"
                          value={item.lastmod}
                          onChange={(e) => handleUpdateSitemapUrl(item.id, 'lastmod', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded px-2 py-0.5 text-xs text-[#e5e5e5] outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Security.txt & Headers */}
          {activeTab === 'security' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-160px)] space-y-4">
              <div className="bg-[#14161b] border border-[#ffffff10] rounded-xl p-4.5 space-y-3.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="text-sm font-semibold text-white">security.txt (Padrão RFC 9116)</h3>
                </div>
                <p className="text-xs text-[#a1a1aa]">
                  O arquivo <code className="text-[#f9e79f]">/.well-known/security.txt</code> é o padrão mundial para pesquisadores de segurança relatarem vulnerabilidades de forma responsável.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-medium text-[#a1a1aa] block mb-1">E-mail ou URL de Contato de Segurança *</label>
                    <input
                      type="text"
                      value={securityContact}
                      onChange={(e) => setSecurityContact(e.target.value)}
                      placeholder="security@meusite.com"
                      className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Data de Expiração (Expires) *</label>
                    <input
                      type="text"
                      value={securityExpires}
                      onChange={(e) => setSecurityExpires(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Página de Política de Vulnerabilidade (Policy)</label>
                    <input
                      type="text"
                      value={securityPolicy}
                      onChange={(e) => setSecurityPolicy(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Live Crawler Simulator */}
          {activeTab === 'simulator' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-160px)] space-y-5">
              <div className="bg-[#14161b] border border-[#d4af37]/30 rounded-xl p-4.5 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="text-sm font-semibold text-white">Simulador em Tempo Real</h3>
                </div>
                <p className="text-xs text-[#a1a1aa]">
                  Teste se um caminho específico do seu site será rastreado ou bloqueado pelas regras ativas.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#a1a1aa] block mb-1">Selecione o Robô / User-Agent:</label>
                    <select
                      value={simSelectedBot}
                      onChange={(e) => setSimSelectedBot(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
                    >
                      <option value="*">Googlebot / Bingbot / Padrão (*)</option>
                      {aiBots.map(b => (
                        <option key={b.userAgent} value={b.userAgent}>
                          {b.botName} ({b.userAgent})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#a1a1aa] block mb-1">URL / Caminho a Testar:</label>
                    <input
                      type="text"
                      value={simTestUrl}
                      onChange={(e) => setSimTestUrl(e.target.value)}
                      placeholder="/admin/settings ou /blog/meu-post"
                      className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#d4af37]"
                    />
                    
                    {/* Quick test buttons */}
                    <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                      <span className="text-[10px] text-[#71717a]">Exemplos rápidos:</span>
                      {[
                        { label: 'Home (/)', path: '/' },
                        { label: '/admin/settings', path: '/admin/settings' },
                        { label: '/api/auth/login', path: '/api/auth/login' },
                        { label: '/blog/post-1', path: '/blog/post-1' },
                        { label: '/checkout', path: '/checkout' },
                      ].map((sample) => (
                        <button
                          key={sample.path}
                          type="button"
                          onClick={() => setSimTestUrl(sample.path)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border transition cursor-pointer ${
                            simTestUrl === sample.path
                              ? 'bg-[#d4af37]/20 text-[#f9e79f] border-[#d4af37]/40'
                              : 'bg-[#181a20] text-[#a1a1aa] border-[#ffffff10] hover:text-white'
                          }`}
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real-time Verdict */}
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 transition ${
                    simulatorResult.allowed
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                      : 'bg-red-950/30 border-red-800/50 text-red-200'
                  }`}
                >
                  {simulatorResult.allowed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-sm">
                        {simulatorResult.allowed ? 'ACESSO PERMITIDO (200 OK)' : 'ACESSO BLOQUEADO (Disallowed)'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
                        {simulatorResult.testPath}
                      </span>
                    </div>
                    <p className="text-xs mt-1 text-[#e5e5e5]/80">
                      {simulatorResult.reason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Code Generation & Direct Downloads */}
        <div className="flex-1 bg-[#0a0a0a] p-6 flex flex-col min-w-0">
          <div className="flex items-center justify-between pb-4 border-b border-[#ffffff10] flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm font-semibold text-white">Visualização de Código Gerado</span>
            </div>

            {/* Output Selector for Sitemap Tab */}
            {activeTab === 'sitemap' && (
              <div className="flex items-center gap-1.5 bg-[#16181d] p-1 rounded-lg border border-[#ffffff10] text-xs">
                <button
                  type="button"
                  onClick={() => setOutputFormat('xml')}
                  className={`px-2.5 py-1 rounded transition cursor-pointer ${
                    outputFormat === 'xml' ? 'bg-[#d4af37] text-black font-semibold' : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  sitemap.xml
                </button>
                <button
                  type="button"
                  onClick={() => setOutputFormat('nextjs')}
                  className={`px-2.5 py-1 rounded transition cursor-pointer ${
                    outputFormat === 'nextjs' ? 'bg-[#d4af37] text-black font-semibold' : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  Next.js (sitemap.ts)
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const textToCopy =
                    activeTab === 'robots' || activeTab === 'simulator'
                      ? generatedRobotsTxt
                      : activeTab === 'sitemap'
                      ? outputFormat === 'xml' ? generatedSitemapXml : generatedNextjsSitemap
                      : generatedSecurityTxt;
                  handleCopy(textToCopy, 'main-code');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1c20] hover:bg-[#27272a] text-xs font-semibold text-white border border-[#ffffff15] transition cursor-pointer"
              >
                {copiedKey === 'main-code' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#a1a1aa]" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'robots' || activeTab === 'simulator') {
                    handleDownloadFile(generatedRobotsTxt, 'robots.txt');
                  } else if (activeTab === 'sitemap') {
                    handleDownloadFile(generatedSitemapXml, 'sitemap.xml', 'application/xml');
                  } else {
                    handleDownloadFile(generatedSecurityTxt, 'security.txt');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#f9e79f] text-black font-semibold text-xs transition cursor-pointer shadow-sm shadow-[#d4af3720]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  Baixar {activeTab === 'robots' || activeTab === 'simulator' ? 'robots.txt' : activeTab === 'sitemap' ? 'sitemap.xml' : 'security.txt'}
                </span>
              </button>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 mt-4 relative bg-[#060709] border border-[#ffffff10] rounded-xl overflow-hidden flex flex-col font-mono text-xs">
            <div className="bg-[#0f1115] px-4 py-2 border-b border-[#ffffff10] flex items-center justify-between text-[11px] text-[#71717a]">
              <span>
                {activeTab === 'robots' || activeTab === 'simulator'
                  ? 'public/robots.txt'
                  : activeTab === 'sitemap'
                  ? outputFormat === 'xml' ? 'public/sitemap.xml' : 'app/sitemap.ts'
                  : '.well-known/security.txt'}
              </span>
              <span>UTF-8 · Pronto para Deploy</span>
            </div>

            <pre className="flex-1 p-4 overflow-auto text-[#d4af37] selection:bg-[#d4af37]/30 selection:text-white leading-relaxed">
              <code>
                {activeTab === 'robots' || activeTab === 'simulator'
                  ? generatedRobotsTxt
                  : activeTab === 'sitemap'
                  ? outputFormat === 'xml' ? generatedSitemapXml : generatedNextjsSitemap
                  : generatedSecurityTxt}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161b] border border-[#ffffff15] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Importar URLs em Massa</h3>
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="text-[#71717a] hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#a1a1aa]">
              Cole uma lista de caminhos ou URLs completas (uma por linha):
            </p>
            <textarea
              rows={8}
              value={bulkUrlInput}
              onChange={(e) => setBulkUrlInput(e.target.value)}
              placeholder={`/sobre\n/servicos\n/planos\n/contato\n/blog/post-1`}
              className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-xl p-3 text-xs text-white font-mono outline-none focus:border-[#d4af37]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 rounded-lg bg-[#27272a] text-xs text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleBulkImportUrls}
                className="px-4 py-2 rounded-lg bg-[#d4af37] text-black font-semibold text-xs"
              >
                Importar {bulkUrlInput.split('\n').filter(Boolean).length} URLs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
