import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Server,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Sparkles,
  Layers,
  FileCode,
  Globe,
  Sliders,
  Shield,
  HelpCircle,
  Upload,
  ArrowRight,
  Code2
} from 'lucide-react';
import { RedirectRuleItem, RedirectTargetServer, CanonicalRedirectConfig, AppSubView } from '../types';

interface RedirectsGeneratorStudioProps {
  triggerToast?: (msg: string) => void;
  onNavigate?: (view: AppSubView) => void;
}

const DEFAULT_RULES: RedirectRuleItem[] = [
  { id: '1', source: '/sobre-nos', destination: '/sobre', statusCode: '301', exactMatch: true, caseInsensitive: true },
  { id: '2', source: '/contato-antigo', destination: '/fale-conosco', statusCode: '301', exactMatch: true, caseInsensitive: true },
  { id: '3', source: '/blog/posts/(.*)', destination: '/artigos/$1', statusCode: '301', exactMatch: false, caseInsensitive: true },
];

const DEFAULT_CANONICAL: CanonicalRedirectConfig = {
  forceHttps: true,
  domainName: 'meusite.com.br',
  forceWwwMode: 'force-non-www',
  trailingSlashMode: 'remove-slash',
  lowercaseUrls: false,
  blockBadBots: true,
  blockHiddenFiles: true,
  enableCorsAll: false,
};

export const RedirectsGeneratorStudio: React.FC<RedirectsGeneratorStudioProps> = ({
  triggerToast = () => {},
  onNavigate = () => {},
}) => {
  const [rules, setRules] = useState<RedirectRuleItem[]>(DEFAULT_RULES);
  const [canonical, setCanonical] = useState<CanonicalRedirectConfig>(DEFAULT_CANONICAL);
  const [targetServer, setTargetServer] = useState<RedirectTargetServer>('htaccess');
  const [activeTab, setActiveTab] = useState<'rules' | 'canonical' | 'bulk' | 'code'>('rules');
  const [bulkInput, setBulkInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Add single rule
  const addRule = () => {
    const newRule: RedirectRuleItem = {
      id: String(Date.now()),
      source: '/pagina-antiga',
      destination: '/pagina-nova',
      statusCode: '301',
      exactMatch: true,
      caseInsensitive: true,
    };
    setRules((prev) => [...prev, newRule]);
    triggerToast('Nova regra de redirecionamento adicionada!');
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRule = (id: string, updates: Partial<RedirectRuleItem>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Bulk parser (CSV/TSV/Lines: /old /new 301)
  const parseBulkRedirects = () => {
    if (!bulkInput.trim()) {
      triggerToast('Insira as linhas de redirecionamento no formato "/antigo /novo 301"');
      return;
    }
    const lines = bulkInput.split(/\r?\n/);
    const parsed: RedirectRuleItem[] = [];

    lines.forEach((line, idx) => {
      const clean = line.trim();
      if (!clean || clean.startsWith('#')) return;
      const parts = clean.split(/[\t, ]+/);
      if (parts.length >= 2) {
        const source = parts[0];
        const destination = parts[1];
        const statusCode = (parts[2] === '302' || parts[2] === '307' || parts[2] === '308' || parts[2] === '410') ? parts[2] : '301';
        parsed.push({
          id: `bulk-${idx}-${Date.now()}`,
          source,
          destination,
          statusCode,
          exactMatch: !source.includes('*') && !source.includes('('),
          caseInsensitive: true,
        });
      }
    });

    if (parsed.length > 0) {
      setRules((prev) => [...prev, ...parsed]);
      setBulkInput('');
      setActiveTab('rules');
      triggerToast(`${parsed.length} redirecionamentos importados com sucesso!`);
    } else {
      triggerToast('Nenhum redirecionamento válido encontrado.');
    }
  };

  // Code Generator for each server format
  const generateOutputCode = (server: RedirectTargetServer): string => {
    switch (server) {
      case 'htaccess': {
        let code = `# ====================================================\n# Apache (.htaccess) - Gerado pelo Web & SEO Studio\n# ====================================================\nRewriteEngine On\n\n`;

        if (canonical.forceHttps) {
          code += `# 1. Forçar HTTPS\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n`;
        }

        if (canonical.forceWwwMode === 'force-non-www') {
          code += `# 2. Remover WWW (Redirecionar www para sem www)\nRewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]\nRewriteRule ^(.*)$ https://%1/$1 [R=301,L]\n\n`;
        } else if (canonical.forceWwwMode === 'force-www') {
          code += `# 2. Forçar WWW\nRewriteCond %{HTTP_HOST} !^www\\. [NC]\nRewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]\n\n`;
        }

        if (canonical.trailingSlashMode === 'remove-slash') {
          code += `# 3. Remover barra final (Trailing Slash)\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteCond %{THE_REQUEST} /([^?]+)/([?].*)?\\sHTTP [NC]\nRewriteRule ^(.+)/$ /$1 [R=301,L]\n\n`;
        } else if (canonical.trailingSlashMode === 'force-slash') {
          code += `# 3. Forçar barra final (Trailing Slash)\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_URI} !(.[a-zA-Z0-9]{1,5})$\nRewriteCond %{REQUEST_URI} !(.*)/$\nRewriteRule ^(.*)$ /$1/ [R=301,L]\n\n`;
        }

        if (canonical.blockHiddenFiles) {
          code += `# 4. Bloquear arquivos ocultos (.git, .env, etc)\nRewriteRule (^|/)\\.(?!well-known/) - [F]\n\n`;
        }

        code += `# 5. Regras de Redirecionamento Individuais\n`;
        rules.forEach((r) => {
          const flag = r.statusCode === '301' ? 'R=301,L' : `R=${r.statusCode},L`;
          const flags = r.caseInsensitive ? `${flag},NC` : flag;
          let srcPattern = r.source.replace(/^\//, '');
          if (r.exactMatch && !srcPattern.endsWith('$')) srcPattern = `^${srcPattern}$`;
          code += `RewriteRule ${srcPattern} ${r.destination} [${flags}]\n`;
        });

        return code;
      }

      case 'nginx': {
        let code = `# ====================================================\n# Nginx (nginx.conf / sites-available) - Web & SEO Studio\n# ====================================================\n\n`;

        if (canonical.forceHttps) {
          code += `server {\n    listen 80;\n    server_name ${canonical.domainName} www.${canonical.domainName};\n    return 301 https://$host$request_uri;\n}\n\n`;
        }

        code += `server {\n    listen 443 ssl http2;\n    server_name ${canonical.domainName};\n\n`;

        if (canonical.trailingSlashMode === 'remove-slash') {
          code += `    # Remover Trailing Slash\n    rewrite ^/(.*)/$ /$1 permanent;\n\n`;
        }

        if (canonical.blockHiddenFiles) {
          code += `    # Bloquear arquivos ocultos\n    location ~ /\\.(?!well-known) {\n        deny all;\n    }\n\n`;
        }

        code += `    # Redirecionamentos de URLs\n`;
        rules.forEach((r) => {
          const type = r.statusCode === '301' ? 'permanent' : 'redirect';
          let src = r.source;
          if (r.exactMatch) src = `^${src}$`;
          code += `    rewrite ${src} ${r.destination} ${type};\n`;
        });

        code += `\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n}`;
        return code;
      }

      case 'iis': {
        let code = `<!-- ==================================================== -->
<!-- IIS (web.config) - Gerado pelo Web & SEO Studio       -->
<!-- ==================================================== -->
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
`;
        if (canonical.forceHttps) {
          code += `        <!-- 1. Forçar HTTPS -->
        <rule name="Redirect to HTTPS" stopProcessing="true">
          <match url="(.*)" />
          <conditions>
            <add input="{HTTPS}" pattern="off" ignoreCase="true" />
          </conditions>
          <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
        </rule>
`;
        }

        rules.forEach((r, i) => {
          const srcClean = r.source.replace(/^\//, '');
          const redirType = r.statusCode === '301' ? 'Permanent' : 'Found';
          code += `        <!-- Redirecionamento ${i + 1} -->
        <rule name="Redirect ${r.source} to ${r.destination}" stopProcessing="true">
          <match url="^${srcClean}$" ignoreCase="${r.caseInsensitive}" />
          <action type="Redirect" url="${r.destination}" redirectType="${redirType}" />
        </rule>
`;
        });

        code += `      </rules>
    </rewrite>
  </system.webServer>
</configuration>`;
        return code;
      }

      case 'redirects': {
        let code = `# Cloudflare Pages / Netlify (_redirects)\n\n`;
        rules.forEach((r) => {
          const codeStr = r.statusCode === '301' ? '301!' : `${r.statusCode}!`;
          code += `${r.source}  ${r.destination}  ${codeStr}\n`;
        });
        return code;
      }

      case 'vercel': {
        const vercelObj = {
          redirects: rules.map((r) => ({
            source: r.source,
            destination: r.destination,
            permanent: r.statusCode === '301',
          })),
        };
        return `// vercel.json\n` + JSON.stringify(vercelObj, null, 2);
      }

      case 'nextjs': {
        return `// next.config.js
module.exports = {
  async redirects() {
    return [
${rules
  .map(
    (r) =>
      `      {\n        source: '${r.source}',\n        destination: '${r.destination}',\n        permanent: ${r.statusCode === '301'},\n      },`
  )
  .join('\n')}
    ];
  },
};`;
      }

      case 'php': {
        return `<?php
// Script de redirecionamento dinâmico (redirects.php)
$redirects = [
${rules.map((r) => `    '${r.source}' => ['dest' => '${r.destination}', 'code' => ${r.statusCode}],`).join('\n')}
];

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (isset($redirects[$uri])) {
    $item = $redirects[$uri];
    header("Location: " . $item['dest'], true, $item['code']);
    exit();
}
`;
      }

      default:
        return '';
    }
  };

  const copyCode = () => {
    const code = generateOutputCode(targetServer);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    triggerToast(`Regras para ${targetServer.toUpperCase()} copiadas!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0c] text-white min-h-[calc(100vh-64px)]">
      {/* Sub-Header Toolbar */}
      <div className="border-b border-[#ffffff10] bg-[#0f1115] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
            Gerador de Redirecionamentos &amp; Regras de Servidor
          </span>
          <span className="text-xs text-[#71717a] hidden sm:inline">• .htaccess, Nginx, IIS (web.config), Vercel &amp; Cloudflare</span>
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

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#14161b] border border-[#ffffff10]">
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'rules' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Regras ({rules.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('canonical')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'canonical' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Canônico &amp; HTTPS</span>
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'bulk' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar em Lote</span>
            </button>
          </div>

          {/* Tab 1: Rules Table */}
          {activeTab === 'rules' && (
            <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
                    Mapeamento de Redirecionamentos
                  </label>
                  <span className="text-[11px] text-[#71717a]">Configure URLs de origem e destino com seus status codes</span>
                </div>
                <button
                  type="button"
                  onClick={addRule}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#252830] hover:bg-[#323640] text-xs font-semibold text-white transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Adicionar Regra</span>
                </button>
              </div>

              {/* Rules List */}
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="p-3.5 rounded-xl bg-[#181a20] border border-[#ffffff10] flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full">
                      <label className="text-[10px] text-[#71717a] block mb-1">Origem (De):</label>
                      <input
                        type="text"
                        value={rule.source}
                        onChange={(e) => updateRule(rule.id, { source: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#111317] border border-[#ffffff20] text-xs font-mono text-white outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#71717a] shrink-0 hidden sm:block mt-4" />

                    <div className="flex-1 w-full">
                      <label className="text-[10px] text-[#71717a] block mb-1">Destino (Para):</label>
                      <input
                        type="text"
                        value={rule.destination}
                        onChange={(e) => updateRule(rule.id, { destination: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#111317] border border-[#ffffff20] text-xs font-mono text-white outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="w-full sm:w-28 shrink-0">
                      <label className="text-[10px] text-[#71717a] block mb-1">Status:</label>
                      <select
                        value={rule.statusCode}
                        onChange={(e) => updateRule(rule.id, { statusCode: e.target.value as any })}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#111317] border border-[#ffffff20] text-xs font-mono text-[#d4af37] outline-none"
                      >
                        <option value="301">301 (Permanente)</option>
                        <option value="302">302 (Temporário)</option>
                        <option value="307">307 (Temporary)</option>
                        <option value="308">308 (Permanent)</option>
                        <option value="410">410 (Gone)</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRule(rule.id)}
                      className="p-2 rounded-lg text-[#71717a] hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer sm:mt-4"
                      title="Excluir regra"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Canonical & HTTPS */}
          {activeTab === 'canonical' && (
            <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-4">
              <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
                Regras Canônicas Globais
              </label>

              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1">Domínio Principal:</label>
                <input
                  type="text"
                  value={canonical.domainName}
                  onChange={(e) => setCanonical((p) => ({ ...p, domainName: e.target.value }))}
                  placeholder="exemplo.com.br"
                  className="w-full px-3 py-2 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs text-white focus:border-[#d4af37] outline-none font-mono"
                />
              </div>

              {/* Force HTTPS */}
              <div className="p-3.5 rounded-xl bg-[#181a20] border border-[#ffffff10] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Forçar Conexão Segura HTTPS (301)</div>
                  <div className="text-[11px] text-[#71717a]">Redireciona todo o tráfego HTTP para HTTPS automaticamente.</div>
                </div>
                <input
                  type="checkbox"
                  checked={canonical.forceHttps}
                  onChange={(e) => setCanonical((p) => ({ ...p, forceHttps: e.target.checked }))}
                  className="w-5 h-5 accent-[#d4af37] cursor-pointer"
                />
              </div>

              {/* WWW Mode */}
              <div className="p-3.5 rounded-xl bg-[#181a20] border border-[#ffffff10] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Padronização de WWW</div>
                  <div className="text-[11px] text-[#71717a]">Evite conteúdo duplicado no Google unificando www vs sem www.</div>
                </div>
                <select
                  value={canonical.forceWwwMode}
                  onChange={(e) => setCanonical((p) => ({ ...p, forceWwwMode: e.target.value as any }))}
                  className="px-2.5 py-1.5 rounded-lg bg-[#252830] border border-[#ffffff20] text-xs text-white outline-none"
                >
                  <option value="force-non-www">Remover WWW (exemplo.com)</option>
                  <option value="force-www">Forçar WWW (www.exemplo.com)</option>
                  <option value="keep">Manter ambos (Não recomendado)</option>
                </select>
              </div>

              {/* Trailing Slash */}
              <div className="p-3.5 rounded-xl bg-[#181a20] border border-[#ffffff10] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Barra Final (Trailing Slash /)</div>
                  <div className="text-[11px] text-[#71717a]">Define se as URLs terminam com / ou sem /.</div>
                </div>
                <select
                  value={canonical.trailingSlashMode}
                  onChange={(e) => setCanonical((p) => ({ ...p, trailingSlashMode: e.target.value as any }))}
                  className="px-2.5 py-1.5 rounded-lg bg-[#252830] border border-[#ffffff20] text-xs text-white outline-none"
                >
                  <option value="remove-slash">Remover Barra (/pagina)</option>
                  <option value="force-slash">Forçar Barra (/pagina/)</option>
                  <option value="keep">Não alterar</option>
                </select>
              </div>

              {/* Block hidden files */}
              <div className="p-3.5 rounded-xl bg-[#181a20] border border-[#ffffff10] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Bloquear Acesso a Arquivos Ocultos (.env, .git)</div>
                  <div className="text-[11px] text-[#71717a]">Retorna erro 403 Forbidden para tentativas de leitura de arquivos confidenciais.</div>
                </div>
                <input
                  type="checkbox"
                  checked={canonical.blockHiddenFiles}
                  onChange={(e) => setCanonical((p) => ({ ...p, blockHiddenFiles: e.target.checked }))}
                  className="w-5 h-5 accent-[#d4af37] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Bulk Import */}
          {activeTab === 'bulk' && (
            <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] space-y-3">
              <label className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
                Colar Lista de Redirecionamentos em Massa
              </label>
              <p className="text-xs text-[#a1a1aa]">
                Cole suas URLs separadas por espaço, vírgula ou tabulação (uma por linha):
              </p>
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={`/pagina-antiga-1 /pagina-nova-1 301\n/categoria/velha /categoria/nova 301\n/promocao /ofertas 302`}
                rows={6}
                className="w-full p-3 rounded-xl bg-[#181a20] border border-[#ffffff20] text-xs font-mono text-white focus:border-[#d4af37] outline-none"
              />
              <button
                type="button"
                onClick={parseBulkRedirects}
                className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#f9e79f] text-black font-bold text-xs transition cursor-pointer"
              >
                Importar e Adicionar à Lista
              </button>
            </div>
          )}
        </div>

        {/* Right Output: Code (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="p-5 rounded-2xl bg-[#121418] border border-[#ffffff10] flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-[#d4af37] font-bold flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Regras Geradas para Servidor
              </span>
              <span className="text-[11px] text-[#71717a]">Configuração Final</span>
            </div>

            {/* Server Platform Selector */}
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {(['htaccess', 'nginx', 'iis', 'redirects', 'vercel', 'nextjs', 'php'] as const).map((srv) => (
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
                  {srv === 'htaccess' ? 'Apache' : srv === 'redirects' ? 'Netlify' : srv}
                </button>
              ))}
            </div>

            {/* Generated Code */}
            <div className="relative flex-1">
              <pre className="p-4 rounded-xl bg-[#08090b] border border-[#ffffff10] text-xs font-mono text-[#a1a1aa] overflow-x-auto h-[460px] leading-relaxed select-all">
                <code>{generateOutputCode(targetServer)}</code>
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
    </div>
  );
};
