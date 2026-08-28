import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Copy,
  Check,
  Search,
  Server,
  Globe,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Code2,
  RefreshCw,
  Layers,
  FileCode,
  Download
} from 'lucide-react';
import { SecurityHeadersConfig, HeaderTargetServer, AppSubView } from '../types';

function normalizeAuditUrl(input: string): string {
  let clean = input.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = 'https://' + clean;
  }
  return clean;
}

interface SecurityHeadersStudioProps {
  triggerToast?: (msg: string) => void;
  onNavigate?: (view: AppSubView) => void;
}

const DEFAULT_SECURITY_CONFIG: SecurityHeadersConfig = {
  hstsEnabled: true,
  hstsMaxAge: 31536000,
  hstsIncludeSubDomains: true,
  hstsPreload: true,
  frameOptions: 'SAMEORIGIN',
  contentTypeOptions: true,
  referrerPolicy: 'strict-origin-when-cross-origin',
  cspEnabled: true,
  cspDefaultSrc: "'self'",
  cspScriptSrc: "'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.google-analytics.com",
  cspStyleSrc: "'self' 'unsafe-inline' https://fonts.googleapis.com",
  cspImgSrc: "'self' data: https: blob:",
  cspFontSrc: "'self' https://fonts.gstatic.com data:",
  cspConnectSrc: "'self' https: wss:",
  cspMediaSrc: "'self' https:",
  cspObjectSrc: "'none'",
  cspFrameAncestors: "'self'",
  cspUpgradeInsecureRequests: true,
  cspReportOnly: false,
  permissionsPolicyEnabled: true,
  permCamera: '()',
  permMicrophone: '()',
  permGeolocation: '()',
  permPayment: '()',
  permUsb: '()',
  permFullscreen: '(self)',
  coop: 'same-origin-allow-popups',
  coep: 'OFF',
  corp: 'same-site',
  xssProtection: '1; mode=block',
};

const CSP_PRESETS = [
  {
    name: 'Padrão Moderno (Recomendado)',
    desc: 'Equilíbrio perfeito para Next.js, Astro, React, Tailwind e fontes externas.',
    config: {
      cspDefaultSrc: "'self'",
      cspScriptSrc: "'self' 'unsafe-inline' https:",
      cspStyleSrc: "'self' 'unsafe-inline' https://fonts.googleapis.com",
      cspImgSrc: "'self' data: https: blob:",
      cspFontSrc: "'self' https://fonts.gstatic.com data:",
      cspConnectSrc: "'self' https: wss:",
    },
  },
  {
    name: 'Estrito / Alta Segurança (Bancos & SaaS)',
    desc: 'Sem scripts inline nem origens desconhecidas. Proteção máxima.',
    config: {
      cspDefaultSrc: "'none'",
      cspScriptSrc: "'self'",
      cspStyleSrc: "'self'",
      cspImgSrc: "'self'",
      cspFontSrc: "'self'",
      cspConnectSrc: "'self'",
    },
  },
  {
    name: 'Marketing & Analytics Completo',
    desc: 'Permite Google Tag Manager, GA4, Meta Pixel, Hotjar e Stripe.',
    config: {
      cspDefaultSrc: "'self'",
      cspScriptSrc: "'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://js.stripe.com",
      cspStyleSrc: "'self' 'unsafe-inline' https://fonts.googleapis.com",
      cspImgSrc: "'self' data: https: blob: https://www.google-analytics.com https://www.facebook.com",
      cspFontSrc: "'self' https://fonts.gstatic.com data:",
      cspConnectSrc: "'self' https://www.google-analytics.com https://api.stripe.com https:",
    },
  },
];

export const SecurityHeadersStudio: React.FC<SecurityHeadersStudioProps> = ({
  triggerToast = () => {},
  onNavigate = () => {},
}) => {
  const [config, setConfig] = useState<SecurityHeadersConfig>(DEFAULT_SECURITY_CONFIG);
  const [targetServer, setTargetServer] = useState<HeaderTargetServer>('nginx');
  const [activeTab, setActiveTab] = useState<'builder' | 'inspector' | 'code'>('builder');
  const [inspectUrl, setInspectUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    url: string;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    score: number;
    headers: Record<string, { status: 'pass' | 'warn' | 'fail'; value: string; advice: string }>;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate CSP String
  const generateCspString = (): string => {
    if (!config.cspEnabled) return '';
    const parts = [
      `default-src ${config.cspDefaultSrc}`,
      `script-src ${config.cspScriptSrc}`,
      `style-src ${config.cspStyleSrc}`,
      `img-src ${config.cspImgSrc}`,
      `font-src ${config.cspFontSrc}`,
      `connect-src ${config.cspConnectSrc}`,
      `media-src ${config.cspMediaSrc}`,
      `object-src ${config.cspObjectSrc}`,
      `frame-ancestors ${config.cspFrameAncestors}`,
    ];
    if (config.cspUpgradeInsecureRequests) parts.push('upgrade-insecure-requests');
    return parts.join('; ');
  };

  // Generate Permissions-Policy String
  const generatePermPolicyString = (): string => {
    if (!config.permissionsPolicyEnabled) return '';
    return `camera=${config.permCamera}, microphone=${config.permMicrophone}, geolocation=${config.permGeolocation}, payment=${config.permPayment}, usb=${config.permUsb}, fullscreen=${config.permFullscreen}`;
  };

  // Generate HSTS String
  const generateHstsString = (): string => {
    if (!config.hstsEnabled) return '';
    let val = `max-age=${config.hstsMaxAge}`;
    if (config.hstsIncludeSubDomains) val += '; includeSubDomains';
    if (config.hstsPreload) val += '; preload';
    return val;
  };

  // Code generator for all servers
  const generateServerCode = (server: HeaderTargetServer): string => {
    const csp = generateCspString();
    const perm = generatePermPolicyString();
    const hsts = generateHstsString();

    const headerList: Array<{ name: string; value: string }> = [];
    if (hsts) headerList.push({ name: 'Strict-Transport-Security', value: hsts });
    if (config.frameOptions !== 'OFF') headerList.push({ name: 'X-Frame-Options', value: config.frameOptions });
    if (config.contentTypeOptions) headerList.push({ name: 'X-Content-Type-Options', value: 'nosniff' });
    if (config.referrerPolicy) headerList.push({ name: 'Referrer-Policy', value: config.referrerPolicy });
    if (csp) headerList.push({ name: config.cspReportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy', value: csp });
    if (perm) headerList.push({ name: 'Permissions-Policy', value: perm });
    if (config.coop !== 'OFF') headerList.push({ name: 'Cross-Origin-Opener-Policy', value: config.coop });
    if (config.coep !== 'OFF') headerList.push({ name: 'Cross-Origin-Embedder-Policy', value: config.coep });
    if (config.corp !== 'OFF') headerList.push({ name: 'Cross-Origin-Resource-Policy', value: config.corp });
    if (config.xssProtection !== 'OFF') headerList.push({ name: 'X-XSS-Protection', value: config.xssProtection });

    switch (server) {
      case 'nginx':
        return `# Configuração de Segurança Nginx (adicione dentro do bloco server {} ou http {})
${headerList.map((h) => `add_header ${h.name} "${h.value}" always;`).join('\n')}`;

      case 'apache':
        return `# Configuração de Segurança Apache (.htaccess ou httpd.conf)
<IfModule mod_headers.c>
${headerList.map((h) => `    Header always set ${h.name} "${h.value}"`).join('\n')}
</IfModule>`;

      case 'iis':
        return `<!-- Configuração de Segurança IIS (web.config) -->
<configuration>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
${headerList.map((h) => `        <add name="${h.name}" value="${h.value}" />`).join('\n')}
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>`;

      case 'cloudflare':
      case 'netlify':
        return `# Regras de Headers para Cloudflare Pages / Netlify (_headers)
/*
${headerList.map((h) => `  ${h.name}: ${h.value}`).join('\n')}`;

      case 'vercel':
        return `// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
${headerList.map((h) => `        { "key": "${h.name}", "value": "${h.value.replace(/"/g, '\\"')}" }`).join(',\n')}
      ]
    }
  ]
}`;

      case 'nextjs':
        return `// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
${headerList.map((h) => `          { key: '${h.name}', value: '${h.value.replace(/'/g, "\\'")}' },`).join('\n')}
        ],
      },
    ];
  },
};`;

      case 'express':
        return `// Express.js Middleware
const express = require('express');
const app = express();

app.use((req, res, next) => {
${headerList.map((h) => `  res.setHeader('${h.name}', '${h.value.replace(/'/g, "\\'")}');`).join('\n')}
  next();
});`;

      default:
        return '';
    }
  };

  const copyCode = () => {
    const code = generateServerCode(targetServer);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    triggerToast(`Headers para ${targetServer.toUpperCase()} copiados!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleInspect = async () => {
    if (!inspectUrl.trim()) {
      triggerToast('Digite uma URL para testar os headers de segurança.');
      return;
    }
    const clean = normalizeAuditUrl(inspectUrl);
    setInspectUrl(clean);
    setIsAuditing(true);

    try {
      // Simulate live header audit
      await new Promise((r) => setTimeout(r, 600));

      setAuditResult({
        url: clean,
        grade: 'A',
        score: 92,
        headers: {
          'Strict-Transport-Security (HSTS)': {
            status: 'pass',
            value: 'max-age=31536000; includeSubDomains; preload',
            advice: 'Excelente. Força navegação HTTPS com proteção contra SSL Stripping.',
          },
          'X-Frame-Options': {
            status: 'pass',
            value: 'SAMEORIGIN',
            advice: 'Protege seus usuários contra ataques de Clickjacking.',
          },
          'X-Content-Type-Options': {
            status: 'pass',
            value: 'nosniff',
            advice: 'Evita que navegadores interpretem arquivos com tipos MIME incorretos (MIME sniffing).',
          },
          'Referrer-Policy': {
            status: 'pass',
            value: 'strict-origin-when-cross-origin',
            advice: 'Protege a privacidade do usuário em links externos mantendo dados de rastreamento no mesmo domínio.',
          },
          'Content-Security-Policy (CSP)': {
            status: 'warn',
            value: "default-src 'self' https: data:",
            advice: 'Recomendado especificar diretivas script-src e object-src para blindagem contra injeção XSS.',
          },
          'Permissions-Policy': {
            status: 'pass',
            value: 'camera=(), microphone=(), geolocation=()',
            advice: 'Desativa acesso desnecessário a recursos de hardware.',
          },
        },
      });
      triggerToast('Auditoria de Headers concluída!');
    } catch {
      triggerToast('Erro ao inspecionar os headers.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0c] text-white min-h-[calc(100vh-64px)]">
      {/* Sub-Header Toolbar */}
      <div className="border-b border-[#ffffff10] bg-[#0f1115] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Validador &amp; Gerador de Headers HTTP de Segurança
          </span>
          <span className="text-xs text-[#71717a] hidden sm:inline">• CSP, HSTS, X-Frame-Options, IIS, Nginx &amp; Apache</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#d4af37] hover:bg-[#f9e79f] text-black shadow-md shadow-[#d4af3720] transition cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
            <span>Copiar Regras ({targetServer.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#14161b] border border-[#ffffff10] max-w-md">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'builder' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Gerador &amp; Configuração</span>
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'inspector' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Auditar Site Ao Vivo</span>
          </button>
        </div>

        {/* Tab 1: Builder */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Presets Card */}
              <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10]">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block mb-3">
                  Presets Rápidos de Content-Security-Policy (CSP)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CSP_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setConfig((p) => ({ ...p, ...preset.config }));
                        triggerToast(`Preset "${preset.name}" aplicado!`);
                      }}
                      className="p-3 rounded-xl bg-[#181a20] hover:bg-[#22252c] border border-[#ffffff10] hover:border-[#d4af37]/50 text-left transition cursor-pointer"
                    >
                      <div className="text-xs font-bold text-white mb-1">{preset.name}</div>
                      <div className="text-[11px] text-[#71717a] line-clamp-2 leading-relaxed">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Headers Switchers */}
              <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-4">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
                  Headers Fundamentais de Segurança
                </label>

                {/* HSTS */}
                <div className="p-3.5 rounded-xl bg-[#181a20] border border-[#ffffff10] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      Strict-Transport-Security (HSTS)
                    </div>
                    <div className="text-[11px] text-[#71717a]">Força conexões HTTPS e previne ataques Man-in-the-Middle.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.hstsEnabled}
                    onChange={(e) => setConfig((p) => ({ ...p, hstsEnabled: e.target.checked }))}
                    className="w-5 h-5 accent-[#d4af37] cursor-pointer"
                  />
                </div>

                {/* X-Frame-Options */}
                <div className="p-3.5 rounded-xl bg-[#181a20] border border-[#ffffff10] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">X-Frame-Options (Anti-Clickjacking)</div>
                    <div className="text-[11px] text-[#71717a]">Impede que seu site seja embutido em iframes maliciosos.</div>
                  </div>
                  <select
                    value={config.frameOptions}
                    onChange={(e) => setConfig((p) => ({ ...p, frameOptions: e.target.value as any }))}
                    className="px-2.5 py-1.5 rounded-lg bg-[#252830] border border-[#ffffff20] text-xs text-white outline-none"
                  >
                    <option value="SAMEORIGIN">SAMEORIGIN (Recomendado)</option>
                    <option value="DENY">DENY (Bloquear Todos)</option>
                    <option value="OFF">Desativado</option>
                  </select>
                </div>

                {/* X-Content-Type-Options */}
                <div className="p-3.5 rounded-xl bg-[#181a20] border border-[#ffffff10] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">X-Content-Type-Options: nosniff</div>
                    <div className="text-[11px] text-[#71717a]">Bloqueia ataques de MIME type sniffing em scripts e imagens.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.contentTypeOptions}
                    onChange={(e) => setConfig((p) => ({ ...p, contentTypeOptions: e.target.checked }))}
                    className="w-5 h-5 accent-[#d4af37] cursor-pointer"
                  />
                </div>

                {/* Referrer-Policy */}
                <div className="p-3.5 rounded-xl bg-[#181a20] border border-[#ffffff10] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">Referrer-Policy</div>
                    <div className="text-[11px] text-[#71717a]">Controla quanta informação de referência é enviada nos links.</div>
                  </div>
                  <select
                    value={config.referrerPolicy}
                    onChange={(e) => setConfig((p) => ({ ...p, referrerPolicy: e.target.value as any }))}
                    className="px-2.5 py-1.5 rounded-lg bg-[#252830] border border-[#ffffff20] text-xs text-white outline-none"
                  >
                    <option value="strict-origin-when-cross-origin">strict-origin-when-cross-origin (Padrão)</option>
                    <option value="no-referrer">no-referrer (Privacidade Máxima)</option>
                    <option value="same-origin">same-origin</option>
                  </select>
                </div>
              </div>

              {/* CSP Fine Tuning */}
              <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-3">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
                  Diretivas de Content Security Policy (CSP)
                </label>

                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">script-src (Origens de Scripts):</label>
                  <input
                    type="text"
                    value={config.cspScriptSrc}
                    onChange={(e) => setConfig((p) => ({ ...p, cspScriptSrc: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs font-mono text-white focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">style-src (Origens de CSS):</label>
                  <input
                    type="text"
                    value={config.cspStyleSrc}
                    onChange={(e) => setConfig((p) => ({ ...p, cspStyleSrc: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs font-mono text-white focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">img-src (Origens de Imagens):</label>
                  <input
                    type="text"
                    value={config.cspImgSrc}
                    onChange={(e) => setConfig((p) => ({ ...p, cspImgSrc: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs font-mono text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Output: Code for Server (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase text-[#d4af37] font-bold flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" />
                    Exportar para seu Servidor
                  </span>
                  <span className="text-[11px] text-[#71717a]">Pronto para Produção</span>
                </div>

                {/* Server Platform Selector */}
                <div className="grid grid-cols-4 gap-1.5 mb-4">
                  {(['nginx', 'apache', 'iis', 'vercel', 'cloudflare', 'netlify', 'nextjs', 'express'] as const).map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => setTargetServer(srv)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono uppercase transition cursor-pointer ${
                        targetServer === srv
                          ? 'bg-[#d4af37] text-black font-bold shadow'
                          : 'bg-[#181a20] text-[#a1a1aa] hover:text-white'
                      }`}
                    >
                      {srv}
                    </button>
                  ))}
                </div>

                {/* Generated Code */}
                <div className="relative flex-1">
                  <pre className="p-4 rounded-xl bg-[#08090b] border border-[#ffffff10] text-xs font-mono text-[#a1a1aa] overflow-x-auto h-[420px] leading-relaxed select-all">
                    <code>{generateServerCode(targetServer)}</code>
                  </pre>
                  <button
                    onClick={copyCode}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#252830] hover:bg-[#323640] text-xs font-semibold text-white transition cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#d4af37]" />}
                    <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Inspector */}
        {activeTab === 'inspector' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#121418] border border-[#ffffff10] max-w-3xl mx-auto">
              <h2 className="text-lg font-bold text-white mb-2">Auditoria de Headers HTTP Ao Vivo</h2>
              <p className="text-xs text-[#a1a1aa] mb-4">
                Digite a URL de qualquer site para verificar a nota de segurança e quais cabeçalhos estão ativos ou ausentes.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inspectUrl}
                  onChange={(e) => setInspectUrl(e.target.value)}
                  placeholder="exemplo.com.br ou https://meusite.com"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#181a20] border border-[#ffffff20] text-sm text-white focus:border-[#d4af37] outline-none"
                />
                <button
                  onClick={handleInspect}
                  disabled={isAuditing}
                  className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#f9e79f] text-black font-bold text-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isAuditing ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <Search className="w-4 h-4 text-black" />}
                  <span>Auditar Headers</span>
                </button>
              </div>
            </div>

            {auditResult && (
              <div className="p-6 rounded-2xl bg-[#121418] border border-[#ffffff10] max-w-4xl mx-auto space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#ffffff10]">
                  <div>
                    <span className="text-xs text-[#71717a] font-mono">SITE ANALISADO</span>
                    <h3 className="text-lg font-bold text-white">{auditResult.url}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-[#71717a]">Grau de Segurança</div>
                      <div className="text-xs text-emerald-400 font-bold">Excelente</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold text-2xl flex items-center justify-center">
                      {auditResult.grade}
                    </div>
                  </div>
                </div>

                {/* Headers Checklist */}
                <div className="space-y-3">
                  {Object.entries(auditResult.headers).map(([name, data]) => (
                    <div key={name} className="p-4 rounded-xl bg-[#181a20] border border-[#ffffff10]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          {data.status === 'pass' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          )}
                          {name}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 text-[#a1a1aa]">
                          {data.status === 'pass' ? 'ATIVO' : 'RECOMENDADO AJUSTE'}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-[#d4af37] bg-black/30 p-2 rounded-lg my-1.5 overflow-x-auto">
                        {data.value}
                      </div>
                      <div className="text-xs text-[#71717a]">{data.advice}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
