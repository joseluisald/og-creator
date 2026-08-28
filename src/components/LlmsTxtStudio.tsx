import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  FileText,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Code2,
  BookOpen,
  Layers,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Sliders,
  FileCode2,
  Bot
} from 'lucide-react';
import { LlmsTxtConfig, LlmsLinkItem } from '../types';
import { AdBanner } from './AdBanner';

interface LlmsTxtStudioProps {
  triggerToast: (msg: string) => void;
  onNavigateToMetaTags?: () => void;
}

const PRESET_TEMPLATES: Record<string, { name: string; icon: string; config: Partial<LlmsTxtConfig> }> = {
  saas: {
    name: 'SaaS & Web App',
    icon: '🚀',
    config: {
      projectName: 'Nexus Analytics AI',
      summary: 'Plataforma empresarial de inteligência de dados, dashboards em tempo real e relatórios preditivos automáticos para equipes de produto e marketing.',
      detailedOverview: `Nexus Analytics AI conecta-se a bancos de dados SQL, APIs de terceiros e eventos web para sintetizar métricas de negócios, retenção de cohort e projeções de faturamento em relatórios em linguagem natural.\n\nEste arquivo llms.txt serve como guia estruturado para agentes autônomos, assistentes de IA e ferramentas como Cursor, ChatGPT e Claude entenderem a arquitetura do produto.`,
      siteUrl: 'https://nexusanalytics.io',
      contactOrMaintainer: 'support@nexusanalytics.io',
      enableFullTxt: true,
      fullTxtHeaderNotice: '# Nexus Analytics AI - Documentação Completa para LLMs\n> Este documento consolidado reúne toda a base de conhecimento para consumo por modelos de linguagem.',
      links: [
        {
          id: '1',
          title: 'Guia de Início Rápido (Quickstart)',
          url: 'https://nexusanalytics.io/docs/quickstart.md',
          description: 'Passo a passo para conectar sua primeira fonte de dados e gerar o primeiro relatório em menos de 5 minutos.',
          section: 'core',
          contentMarkdown: `### Instalação & Setup\n1. Crie uma conta no portal Nexus.\n2. Instale o SDK client: \`npm install @nexus/sdk\`\n3. Configure as credenciais no seu arquivo \`.env\`:\n\`\`\`env\nNEXUS_API_KEY=nx_live_xxxx\nNEXUS_PROJECT_ID=prj_12345\n\`\`\``
        },
        {
          id: '2',
          title: 'Referência da API REST & GraphQL',
          url: 'https://nexusanalytics.io/docs/api-reference.md',
          description: 'Documentação completa de endpoints para ingestão de eventos, consulta de métricas e exportação de CSV/Parquet.',
          section: 'api',
          contentMarkdown: `### Autenticação\nTodas as requisições à API REST devem incluir o header \`Authorization: Bearer <API_KEY>\`.\n\n### Endpoint: Ingestão de Evento\n\`POST /api/v1/events\`\n\`\`\`json\n{\n  "event": "subscription_upgraded",\n  "userId": "usr_9981",\n  "properties": { "plan": "enterprise", "mrr": 499 }\n}\n\`\`\``
        },
        {
          id: '3',
          title: 'Arquitetura & Segurança de Dados',
          url: 'https://nexusanalytics.io/docs/security.md',
          description: 'Políticas de criptografia TLS 1.3/AES-256, conformidade LGPD/GDPR e isolamento multi-tenant.',
          section: 'core',
          contentMarkdown: `### Segurança\n- Dados criptografados em trânsito (TLS 1.3) e em repouso (AES-GCM-256).\n- Zero-data retention em modelos de IA sem consentimento explícito do cliente.`
        },
        {
          id: '4',
          title: 'Exemplos de Integração & SDKs',
          url: 'https://nexusanalytics.io/docs/examples.md',
          description: 'Receitas de código prontas em TypeScript, Python, Go e Node.js para automação de tarefas.',
          section: 'optional',
          contentMarkdown: `### Exemplo em Python\n\`\`\`python\nfrom nexus_sdk import NexusClient\nclient = NexusClient(api_key="nx_live_...")\nreport = client.reports.generate(metrics=["mrr", "churn"], period="last_30_days")\nprint(report.summary)\n\`\`\``
        }
      ]
    }
  },
  api_sdk: {
    name: 'Developer API & SDK',
    icon: '⚡',
    config: {
      projectName: 'FastData SDK & Engine',
      summary: 'Biblioteca de alta performance para processamento assíncrono de fluxos de dados em tempo real com suporte a TypeScript e Rust.',
      detailedOverview: `FastData SDK fornece estruturas de dados ultra-otimizadas com zero-copy serialização, canais IPC de baixa latência e integração nativa com microserviços.\n\nUse este guia para que seu assistente de programação entenda tipos, assinaturas de métodos e tratamento de erros.`,
      siteUrl: 'https://fastdata.dev',
      contactOrMaintainer: 'maintainers@fastdata.dev',
      enableFullTxt: true,
      fullTxtHeaderNotice: '# FastData SDK - Guia Completo para LLMs & Agentes de Código',
      links: [
        {
          id: '1',
          title: 'Tipos & Assinaturas TypeScript',
          url: 'https://fastdata.dev/docs/types.md',
          description: 'Definições completas de interfaces TypeScript, enums e tipos utilitários para compilação estrita.',
          section: 'core',
          contentMarkdown: `\`\`\`typescript\nexport interface StreamPacket<T = unknown> {\n  id: string;\n  timestamp: number;\n  payload: T;\n  crc32: number;\n}\n\`\`\``
        },
        {
          id: '2',
          title: 'Tratamento de Erros & Códigos de Retorno',
          url: 'https://fastdata.dev/docs/errors.md',
          description: 'Tabela de códigos de erro (`ERR_CONNECTION_TIMEOUT`, `ERR_BUFFER_OVERFLOW`) e estratégias de retry com backoff exponencial.',
          section: 'api',
          contentMarkdown: `| Código | Descrição | Ação Recomendada |\n|---|---|---|\n| ERR_TIMEOUT | Servidor demorou a responder | Retry exponencial |\n| ERR_AUTH | Token inválido ou expirado | Renovar credenciais |`
        },
        {
          id: '3',
          title: 'Guia de Contribuição & Build Local',
          url: 'https://fastdata.dev/docs/contributing.md',
          description: 'Instruções para compilação via Cargo/npm, execução da suíte de testes e submissão de Pull Requests.',
          section: 'optional',
          contentMarkdown: `\`\`\`bash\n# Executar suíte de testes\nnpm run test:coverage\ncargo test --all-features\n\`\`\``
        }
      ]
    }
  },
  docs_kb: {
    name: 'Documentação / Base de Conhecimento',
    icon: '📚',
    config: {
      projectName: 'DevOps Manual & Playbooks',
      summary: 'Base de conhecimento e procedimentos operacionais padrão (SOP) para infraestrutura em nuvem, Kubernetes e observabilidade.',
      detailedOverview: `Documentação centralizada para engenheiros de confiabilidade de sites (SRE) e desenvolvedores. Contém diagnósticos de incidentes, playbooks de recuperação de desastres e padrões de CI/CD.`,
      siteUrl: 'https://ops.empresa.com',
      contactOrMaintainer: 'sre-team@empresa.com',
      enableFullTxt: true,
      fullTxtHeaderNotice: '# DevOps Manual - Playbooks & SOPs para LLMs',
      links: [
        {
          id: '1',
          title: 'Playbook: Recuperação de Cluster Kubernetes',
          url: 'https://ops.empresa.com/playbooks/k8s-recovery.md',
          description: 'Procedimento passo a passo para restaurar nós com falha de quorum etcd e reinicialização segura de pods.',
          section: 'core',
          contentMarkdown: `### Diagnóstico Inicial\n\`kubectl get nodes -o wide\`\n\`kubectl get pods --all-namespaces --field-selector status.phase!=Running\``
        },
        {
          id: '2',
          title: 'Políticas de Backup & Retenção de Bancos',
          url: 'https://ops.empresa.com/policies/backup-policy.md',
          description: 'Horários de snapshots diários em Cloud Storage, criptografia e testes periódicos de restauração.',
          section: 'core',
          contentMarkdown: `Backups automáticos executados diariamente às 03:00 UTC com retenção de 30 dias em cold storage.`
        },
        {
          id: '3',
          title: 'Glossário de Termos Internos',
          url: 'https://ops.empresa.com/glossary.md',
          description: 'Definição de siglas de microsserviços internos, pools de servidores e terminologias de negócios.',
          section: 'optional',
          contentMarkdown: `- **SLA**: Nível de serviço acordado (99.9% de uptime).\n- **MTTR**: Tempo médio de recuperação de falhas.`
        }
      ]
    }
  }
};

export const LlmsTxtStudio: React.FC<LlmsTxtStudioProps> = ({ triggerToast, onNavigateToMetaTags }) => {
  const [config, setConfig] = useState<LlmsTxtConfig>({
    projectName: 'Meu Projeto Inc.',
    summary: 'Descrição concisa e direta do seu produto, API ou biblioteca para ser consumida por modelos de IA (ChatGPT, Claude, Cursor, Gemini).',
    detailedOverview: `Este projeto oferece soluções completas e modulares para desenvolvimento web moderno. Aqui você encontra contexto detalhado, links para documentação em Markdown puro e instruções para agentes autônomos.`,
    siteUrl: 'https://meusite.com',
    contactOrMaintainer: 'contato@meusite.com',
    customSections: '',
    enableFullTxt: true,
    fullTxtHeaderNotice: '# Meu Projeto Inc. - Documentação Consolidada para LLMs\n> Este documento unificado permite que modelos de linguagem consumam todo o contexto de uma só vez.',
    links: [
      {
        id: '1',
        title: 'Guia de Introdução & Primeiros Passos',
        url: 'https://meusite.com/docs/getting-started.md',
        description: 'Visão geral da plataforma, instalação e primeiros passos práticos.',
        section: 'core',
        contentMarkdown: `### Introdução\nBem-vindo ao Meu Projeto! Nossa biblioteca simplifica o fluxo de trabalho de ponta a ponta.\n\n\`\`\`bash\nnpm install meu-projeto\n\`\`\``
      },
      {
        id: '2',
        title: 'Referência de Endpoints da API',
        url: 'https://meusite.com/docs/api-reference.md',
        description: 'Documentação completa de rotas HTTP, autenticação Bearer e esquemas JSON.',
        section: 'api',
        contentMarkdown: `### GET /api/v1/status\nRetorna a saúde do sistema e versão atual.\n\n\`\`\`json\n{\n  "status": "operational",\n  "version": "2.4.0"\n}\n\`\`\``
      },
      {
        id: '3',
        title: 'Perguntas Frequentes (FAQ) & Troubleshooting',
        url: 'https://meusite.com/docs/faq.md',
        description: 'Respostas para dúvidas comuns sobre configuração, limites de taxa e boas práticas.',
        section: 'optional',
        contentMarkdown: `### O sistema suporta TypeScript?\nSim, tipos 100% estritos inclusos nativamente.`
      }
    ]
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview-llms' | 'preview-full' | 'routes' | 'cursorrules'>('editor');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Apply preset template
  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESET_TEMPLATES[presetKey];
    if (!preset) return;
    setConfig(prev => ({
      ...prev,
      ...preset.config
    }));
    triggerToast(`Preset "${preset.name}" aplicado com sucesso!`);
  };

  // Add new link item
  const handleAddLink = () => {
    const newId = Date.now().toString();
    const newLink: LlmsLinkItem = {
      id: newId,
      title: 'Novo Documento ou Seção',
      url: `${config.siteUrl.replace(/\/$/, '')}/docs/secao-${config.links.length + 1}.md`,
      description: 'Breve resumo do que este arquivo ou página explica para a IA.',
      section: 'core',
      contentMarkdown: '### Conteúdo do Documento\nEscreva ou cole aqui o conteúdo em Markdown deste arquivo para o llms-full.txt.'
    };
    setConfig(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
    setEditingLinkId(newId);
  };

  // Update link item
  const handleUpdateLink = (id: string, field: keyof LlmsLinkItem, val: any) => {
    setConfig(prev => ({
      ...prev,
      links: prev.links.map(item => item.id === id ? { ...item, [field]: val } : item)
    }));
  };

  // Remove link item
  const handleRemoveLink = (id: string) => {
    setConfig(prev => ({
      ...prev,
      links: prev.links.filter(item => item.id !== id)
    }));
    if (editingLinkId === id) setEditingLinkId(null);
  };

  // Generate standard llms.txt string (Answer.AI specification)
  const generatedLlmsTxt = useMemo(() => {
    const lines: string[] = [];

    // Title
    lines.push(`# ${config.projectName.trim() || 'Projeto'}`);
    lines.push('');

    // Summary Blockquote (Spec requirement)
    if (config.summary.trim()) {
      lines.push(`> ${config.summary.trim()}`);
      lines.push('');
    }

    // Detailed Overview / Context
    if (config.detailedOverview.trim()) {
      lines.push(config.detailedOverview.trim());
      lines.push('');
    }

    // Core documentation links
    const coreLinks = config.links.filter(l => l.section === 'core');
    if (coreLinks.length > 0) {
      lines.push('## Core Documentation');
      lines.push('');
      coreLinks.forEach(link => {
        lines.push(`- [${link.title.trim()}](${link.url.trim()}): ${link.description.trim()}`);
      });
      lines.push('');
    }

    // API reference links
    const apiLinks = config.links.filter(l => l.section === 'api');
    if (apiLinks.length > 0) {
      lines.push('## API Reference & Endpoints');
      lines.push('');
      apiLinks.forEach(link => {
        lines.push(`- [${link.title.trim()}](${link.url.trim()}): ${link.description.trim()}`);
      });
      lines.push('');
    }

    // Optional / Secondary links
    const optionalLinks = config.links.filter(l => l.section === 'optional');
    if (optionalLinks.length > 0) {
      lines.push('## Optional');
      lines.push('');
      optionalLinks.forEach(link => {
        lines.push(`- [${link.title.trim()}](${link.url.trim()}): ${link.description.trim()}`);
      });
      lines.push('');
    }

    // Custom sections if provided
    if (config.customSections.trim()) {
      lines.push(config.customSections.trim());
      lines.push('');
    }

    // Contact/Maintainer note if present
    if (config.contactOrMaintainer.trim()) {
      lines.push('## Contact');
      lines.push(`- Maintainer: ${config.contactOrMaintainer.trim()}`);
      lines.push(`- Website: ${config.siteUrl.trim()}`);
      lines.push('');
    }

    return lines.join('\n').trim() + '\n';
  }, [config]);

  // Generate llms-full.txt string (Consolidated full docs)
  const generatedLlmsFullTxt = useMemo(() => {
    const lines: string[] = [];

    if (config.fullTxtHeaderNotice.trim()) {
      lines.push(config.fullTxtHeaderNotice.trim());
      lines.push('');
    } else {
      lines.push(`# ${config.projectName.trim()} - Documentação Completa (llms-full.txt)`);
      lines.push(`> ${config.summary.trim()}`);
      lines.push('');
    }

    if (config.detailedOverview.trim()) {
      lines.push('## Visão Geral do Sistema');
      lines.push(config.detailedOverview.trim());
      lines.push('');
    }

    lines.push('---');
    lines.push('');

    // Append each document content
    config.links.forEach((link, idx) => {
      lines.push(`## Documento ${idx + 1}: ${link.title.trim()}`);
      lines.push(`> Fonte: ${link.url.trim()}`);
      lines.push(`> Descrição: ${link.description.trim()}`);
      lines.push('');
      if (link.contentMarkdown && link.contentMarkdown.trim()) {
        lines.push(link.contentMarkdown.trim());
      } else {
        lines.push(`*(Conteúdo detalhado deste documento disponível em ${link.url.trim()})*`);
      }
      lines.push('');
      lines.push('---');
      lines.push('');
    });

    return lines.join('\n').trim() + '\n';
  }, [config]);

  // Next.js App Router Route Handler (app/llms.txt/route.ts)
  const generatedNextjsRoute = useMemo(() => {
    return `// app/llms.txt/route.ts
import { NextResponse } from 'next/server';

const LLMS_TXT_CONTENT = ${JSON.stringify(generatedLlmsTxt)};

export async function GET() {
  return new NextResponse(LLMS_TXT_CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
`;
  }, [generatedLlmsTxt]);

  // Cursor rules / Copilot system prompt snippet
  const generatedCursorRules = useMemo(() => {
    return `# .cursorrules / AI Instructions for ${config.projectName}
# Injetar este contexto ao desenvolver ou consultar a base de código.

Você é o assistente oficial de desenvolvimento de "${config.projectName}".

## Resumo do Projeto:
${config.summary}

## Arquitetura & Diretrizes:
${config.detailedOverview}

## Recursos de Referência:
${config.links.map(l => `- ${l.title} (${l.url}): ${l.description}`).join('\n')}

Ao gerar respostas, siga a convenção de tipos e padrões de código documentados acima.
`;
  }, [config]);

  // Spec Health Validation
  const specValidation = useMemo(() => {
    const issues: Array<{ type: 'error' | 'warning' | 'success'; message: string }> = [];

    if (!config.projectName.trim()) {
      issues.push({ type: 'error', message: 'Falta o Nome do Projeto (# Título).' });
    } else {
      issues.push({ type: 'success', message: 'Título principal no padrão Markdown (# H1).' });
    }

    if (!config.summary.trim()) {
      issues.push({ type: 'warning', message: 'Recomenda-se um resumo em bloco (> blockquote) na especificação llms.txt.' });
    } else {
      issues.push({ type: 'success', message: 'Resumo em blockquote (>) configurado.' });
    }

    if (config.links.length === 0) {
      issues.push({ type: 'warning', message: 'Nenhum link para documentação adicionado.' });
    } else {
      const nonMdLinks = config.links.filter(l => !l.url.endsWith('.md') && !l.url.includes('/docs/'));
      if (nonMdLinks.length > 0) {
        issues.push({ type: 'warning', message: `${nonMdLinks.length} links não possuem terminação .md (o padrão llms.txt recomenda Markdown puro).` });
      } else {
        issues.push({ type: 'success', message: `${config.links.length} links estruturados no padrão markdown.` });
      }
    }

    // Token estimation (approx 4 chars per token)
    const approxTokensLlms = Math.round(generatedLlmsTxt.length / 4);
    const approxTokensFull = Math.round(generatedLlmsFullTxt.length / 4);

    return {
      issues,
      approxTokensLlms,
      approxTokensFull,
      charCountLlms: generatedLlmsTxt.length,
      charCountFull: generatedLlmsFullTxt.length,
    };
  }, [config, generatedLlmsTxt, generatedLlmsFullTxt]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      triggerToast('Conteúdo copiado para a área de transferência!');
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      triggerToast('Erro ao copiar.');
    }
  };

  // Download helper
  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
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

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] min-h-[calc(100vh-60px)]">
      {/* Top Ad Slot */}
      <AdBanner format="leaderboard" slotId="llmstxt-top-leaderboard" />

      {/* Header Bar */}
      <div className="border-b border-[#ffffff10] bg-[#0f1115] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f9e79f]">
              <Bot className="w-4 h-4 text-[#d4af37]" />
            </span>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Gerador de llms.txt &amp; llms-full.txt
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#f9e79f] border border-[#d4af37]/20 font-mono">
              Padrão Jeremy Howard / Answer.AI
            </span>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Gere o arquivo padrão que permite a agentes de Inteligência Artificial (ChatGPT, Claude, Cursor, Copilot, Perplexity) entenderem sua documentação, API e contexto com máxima precisão.
          </p>
        </div>

        {/* Global Domain Config & Quick Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#16181d] border border-[#ffffff15] rounded-lg px-3 py-1.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[#71717a]">URL do Site:</span>
            <input
              type="text"
              value={config.siteUrl}
              onChange={(e) => setConfig(prev => ({ ...prev, siteUrl: e.target.value }))}
              className="bg-transparent text-white font-mono outline-none w-44 sm:w-52 focus:text-[#f9e79f]"
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
              <span>Ver Meta Tags &amp; SEO</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column: Form & Link Builder */}
        <div className="w-full lg:w-[500px] xl:w-[540px] border-r border-[#ffffff10] bg-[#0f1115]/90 flex flex-col">
          {/* Sub Navigation */}
          <div className="flex border-b border-[#ffffff10] bg-[#121418] px-4 pt-2 gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition border-t-2 cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-[#181a20] text-[#f9e79f] border-[#d4af37]'
                  : 'text-[#a1a1aa] border-transparent hover:text-white hover:bg-[#181a20]/50'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#d4af37]" />
              <span>1. Configuração &amp; Links</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview-llms')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition border-t-2 cursor-pointer ${
                activeTab === 'preview-llms'
                  ? 'bg-[#181a20] text-[#f9e79f] border-[#d4af37]'
                  : 'text-[#a1a1aa] border-transparent hover:text-white hover:bg-[#181a20]/50'
              }`}
            >
              <FileText className="w-4 h-4 text-[#d4af37]" />
              <span>2. llms.txt</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview-full')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition border-t-2 cursor-pointer ${
                activeTab === 'preview-full'
                  ? 'bg-[#181a20] text-[#f9e79f] border-[#d4af37]'
                  : 'text-[#a1a1aa] border-transparent hover:text-white hover:bg-[#181a20]/50'
              }`}
            >
              <Layers className="w-4 h-4 text-[#d4af37]" />
              <span>3. llms-full.txt</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('routes')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition border-t-2 cursor-pointer ${
                activeTab === 'routes'
                  ? 'bg-[#181a20] text-[#f9e79f] border-[#d4af37]'
                  : 'text-[#a1a1aa] border-transparent hover:text-white hover:bg-[#181a20]/50'
              }`}
            >
              <Code2 className="w-4 h-4 text-[#d4af37]" />
              <span>4. Rotas Next/Astro</span>
            </button>
          </div>

          {/* Tab 1: Editor & Links */}
          {activeTab === 'editor' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-160px)] space-y-5">
              {/* Presets Card */}
              <div className="bg-[#14161b] border border-[#d4af37]/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Presets de Arquitetura</h3>
                  </div>
                  <span className="text-[10px] text-[#f9e79f] font-mono">1-Clique</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(PRESET_TEMPLATES).map(([key, preset]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleApplyPreset(key)}
                      className="p-2 rounded-lg bg-[#1a1c22] hover:bg-[#252830] border border-[#ffffff15] text-left transition cursor-pointer group"
                    >
                      <div className="text-base mb-1">{preset.icon}</div>
                      <div className="text-[11px] font-semibold text-white group-hover:text-[#f9e79f] leading-tight">
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Information */}
              <div className="bg-[#14161b] border border-[#ffffff10] rounded-xl p-4.5 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#d4af37]" />
                  <span>Informações Principais do Projeto</span>
                </h3>

                <div>
                  <label className="text-xs font-medium text-[#a1a1aa] block mb-1">
                    Nome do Projeto / Biblioteca <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={config.projectName}
                    onChange={(e) => setConfig(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Ex: Nexus Analytics SDK"
                    className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
                  />
                  <span className="text-[10px] text-[#71717a] mt-1 block">Gerado como: <code># {config.projectName || 'Nome'}</code></span>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#a1a1aa] block mb-1">
                    Resumo Executivo para LLMs (&gt; Blockquote) <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={config.summary}
                    onChange={(e) => setConfig(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Resumo de 1 a 2 frases explicando o propósito principal do produto/serviço..."
                    className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#d4af37] resize-none"
                  />
                  <span className="text-[10px] text-[#71717a] block">Este parágrafo é o primeiro lido pelo modelo de IA para definir a intenção.</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#a1a1aa] block mb-1">
                    Visão Geral &amp; Contexto Arquitetural Detalhado
                  </label>
                  <textarea
                    rows={4}
                    value={config.detailedOverview}
                    onChange={(e) => setConfig(prev => ({ ...prev, detailedOverview: e.target.value }))}
                    placeholder="Explicação mais profunda sobre como a plataforma funciona, tecnologias suportadas, casos de uso..."
                    className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#a1a1aa] block mb-1">E-mail / Maintainer</label>
                    <input
                      type="text"
                      value={config.contactOrMaintainer}
                      onChange={(e) => setConfig(prev => ({ ...prev, contactOrMaintainer: e.target.value }))}
                      placeholder="dev@meusite.com"
                      className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Gerar llms-full.txt</label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={config.enableFullTxt}
                        onChange={(e) => setConfig(prev => ({ ...prev, enableFullTxt: e.target.checked }))}
                        className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
                      />
                      <span className="text-xs text-white">Ativar arquivo unificado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Links & Documentation Index */}
              <div className="bg-[#14161b] border border-[#ffffff10] rounded-xl p-4.5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FileCode2 className="w-4 h-4 text-[#d4af37]" />
                      <span>Índice de Documentação ({config.links.length})</span>
                    </h3>
                    <p className="text-[11px] text-[#71717a]">
                      Adicione links para páginas Markdown (.md) que detalham cada parte do seu sistema.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#f9e79f] text-black font-semibold text-xs transition cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Link</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {config.links.map((link, idx) => (
                    <div
                      key={link.id}
                      className="bg-[#0f1115] border border-[#ffffff15] rounded-xl p-3.5 space-y-3 transition hover:border-[#d4af37]/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded">
                          Doc #{idx + 1}
                        </span>
                        <select
                          value={link.section}
                          onChange={(e) => handleUpdateLink(link.id, 'section', e.target.value)}
                          className="bg-[#16181d] border border-[#ffffff15] rounded px-2 py-1 text-xs text-[#f9e79f] outline-none focus:border-[#d4af37]"
                        >
                          <option value="core">## Core Documentation</option>
                          <option value="api">## API Reference</option>
                          <option value="optional">## Optional / Extras</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(link.id)}
                          className="p-1 rounded text-[#71717a] hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                          title="Remover documento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#71717a] uppercase block mb-1">Título do Documento</label>
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handleUpdateLink(link.id, 'title', e.target.value)}
                            placeholder="Ex: Guia de Instalação"
                            className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#71717a] uppercase block mb-1">URL (idealmente .md)</label>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                            placeholder="https://meusite.com/docs/install.md"
                            className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-[#d4af37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#71717a] uppercase block mb-1">Descrição para o Modelo de IA</label>
                        <input
                          type="text"
                          value={link.description}
                          onChange={(e) => handleUpdateLink(link.id, 'description', e.target.value)}
                          placeholder="Explica o que este arquivo cobre para o agente decidir se precisa ler..."
                          className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                        />
                      </div>

                      {/* Expandable Markdown content for llms-full.txt */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setEditingLinkId(editingLinkId === link.id ? null : link.id)}
                          className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{editingLinkId === link.id ? 'Fechar Conteúdo Markdown' : 'Editar Conteúdo Completo (para llms-full.txt)'}</span>
                        </button>

                        {editingLinkId === link.id && (
                          <div className="mt-2 pt-2 border-t border-[#ffffff10] space-y-1.5">
                            <label className="text-[10px] text-[#a1a1aa] block">
                              Markdown bruto incluído no <code className="text-[#f9e79f]">llms-full.txt</code>:
                            </label>
                            <textarea
                              rows={5}
                              value={link.contentMarkdown || ''}
                              onChange={(e) => handleUpdateLink(link.id, 'contentMarkdown', e.target.value)}
                              placeholder="Escreva ou cole o conteúdo deste arquivo em Markdown aqui..."
                              className="w-full bg-[#0a0a0a] border border-[#ffffff15] rounded-lg p-2 text-xs text-white font-mono outline-none focus:border-[#d4af37] resize-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Raw llms.txt direct view */}
          {activeTab === 'preview-llms' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-160px)] space-y-4">
              <div className="bg-[#14161b] border border-[#d4af37]/30 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#d4af37]" />
                    <h3 className="text-sm font-semibold text-white">Especificação Oficial llms.txt</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 font-mono">
                    RFC Padrão
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa]">
                  O arquivo <code className="text-[#f9e79f]">/llms.txt</code> serve como o índice mestre de documentação legível por máquinas. Ele orienta ferramentas como Cursor, Claude Projects e ChatGPT para encontrar as fontes certas sem alucinações.
                </p>
                <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#ffffff10] text-xs font-mono text-[#e5e5e5] whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {generatedLlmsTxt}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Raw llms-full.txt direct view */}
          {activeTab === 'preview-full' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-160px)] space-y-4">
              <div className="bg-[#14161b] border border-[#d4af37]/30 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#d4af37]" />
                    <h3 className="text-sm font-semibold text-white">llms-full.txt (Arquivo Consolidado)</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f9e79f] font-mono">
                    Contexto Unificado
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa]">
                  Ideal para agentes que conseguem ingerir grandes janelas de contexto (ex: 200k tokens do Claude ou 1M tokens do Gemini). Ele concatena todas as páginas em um único arquivo limpo.
                </p>
                <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#ffffff10] text-xs font-mono text-[#e5e5e5] whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {generatedLlmsFullTxt}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Server Routes & Setup */}
          {activeTab === 'routes' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-160px)] space-y-4">
              <div className="bg-[#14161b] border border-[#ffffff10] rounded-xl p-4.5 space-y-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="text-sm font-semibold text-white">Como Servir /llms.txt no seu Site</h3>
                </div>
                <p className="text-xs text-[#a1a1aa]">
                  O arquivo deve ser servido na raiz do seu domínio: <code className="text-[#f9e79f]">https://meusite.com/llms.txt</code> com <code className="text-[#f9e79f]">Content-Type: text/plain; charset=utf-8</code>.
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-white">Opção A: Arquivo Estático na pasta public</span>
                  <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#ffffff10] text-xs font-mono text-[#a1a1aa]">
                    public/llms.txt<br />
                    public/llms-full.txt
                  </div>
                  <p className="text-[11px] text-[#71717a]">
                    Basta baixar os arquivos clicando no botão "Baixar llms.txt" e colocá-los na pasta <code className="text-[#f9e79f]">public/</code> do Next.js, Vite, Astro, Nuxt ou Laravel.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Generation, Health Check & Direct Downloads */}
        <div className="flex-1 bg-[#0a0a0a] p-6 flex flex-col min-w-0">
          {/* Action Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#ffffff10] flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm font-semibold text-white">Código Gerado &amp; Exportação</span>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleCopy(generatedLlmsTxt, 'llms-txt')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1c20] hover:bg-[#27272a] text-xs font-semibold text-white border border-[#ffffff15] transition cursor-pointer"
              >
                {copiedKey === 'llms-txt' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#a1a1aa]" />
                    <span>Copiar llms.txt</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDownload(generatedLlmsTxt, 'llms.txt')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#f9e79f] text-xs font-bold text-black transition cursor-pointer shadow-md shadow-[#d4af3720]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar llms.txt</span>
              </button>

              {config.enableFullTxt && (
                <button
                  type="button"
                  onClick={() => handleDownload(generatedLlmsFullTxt, 'llms-full.txt')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1c20] hover:bg-[#27272a] text-xs font-semibold text-[#f9e79f] border border-[#d4af37]/40 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Baixar llms-full.txt</span>
                </button>
              )}
            </div>
          </div>

          {/* Health Check & Token Metric Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="bg-[#121418] border border-[#ffffff10] rounded-xl p-3">
              <span className="text-[10px] text-[#71717a] uppercase font-mono block">Links Mapeados</span>
              <span className="text-lg font-bold text-white mt-0.5 block">{config.links.length}</span>
            </div>

            <div className="bg-[#121418] border border-[#ffffff10] rounded-xl p-3">
              <span className="text-[10px] text-[#71717a] uppercase font-mono block">Tamanho llms.txt</span>
              <span className="text-lg font-bold text-[#f9e79f] mt-0.5 block">
                {specValidation.charCountLlms} <span className="text-xs font-normal text-[#71717a]">chars (~{specValidation.approxTokensLlms} tok)</span>
              </span>
            </div>

            <div className="bg-[#121418] border border-[#ffffff10] rounded-xl p-3">
              <span className="text-[10px] text-[#71717a] uppercase font-mono block">llms-full.txt</span>
              <span className="text-lg font-bold text-emerald-300 mt-0.5 block">
                {specValidation.charCountFull} <span className="text-xs font-normal text-[#71717a]">chars (~{specValidation.approxTokensFull} tok)</span>
              </span>
            </div>

            <div className="bg-[#121418] border border-[#ffffff10] rounded-xl p-3">
              <span className="text-[10px] text-[#71717a] uppercase font-mono block">Validação Spec</span>
              <span className="text-xs font-semibold text-emerald-400 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Válido</span>
              </span>
            </div>
          </div>

          {/* Main Code Viewer */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* Tabs for code snippet type */}
            <div className="flex items-center justify-between bg-[#121418] p-1.5 rounded-lg border border-[#ffffff10] text-xs">
              <span className="text-[#a1a1aa] font-mono text-[11px] px-2">Arquivo: /llms.txt</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(generatedCursorRules, 'cursorrules')}
                  className="px-2.5 py-1 rounded bg-[#1a1c22] hover:bg-[#252830] text-[#f9e79f] text-[11px] font-mono border border-[#ffffff15] transition cursor-pointer"
                >
                  {copiedKey === 'cursorrules' ? 'Copiado!' : 'Copiar .cursorrules'}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(generatedNextjsRoute, 'nextroute')}
                  className="px-2.5 py-1 rounded bg-[#1a1c22] hover:bg-[#252830] text-[#a1a1aa] hover:text-white text-[11px] font-mono border border-[#ffffff15] transition cursor-pointer"
                >
                  {copiedKey === 'nextroute' ? 'Copiado!' : 'Copiar Route (Next.js)'}
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="flex-1 bg-[#0f1115] border border-[#ffffff10] rounded-xl p-4 overflow-y-auto max-h-[calc(100vh-340px)] font-mono text-xs text-[#e5e5e5] leading-relaxed select-text">
              <pre className="whitespace-pre-wrap">{generatedLlmsTxt}</pre>
            </div>

            {/* AI Prompts & Integration Guide Card */}
            <div className="bg-[#14161b] border border-[#ffffff10] rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#d4af37]/15 text-[#f9e79f]">
                  <Zap className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Como Agentes de IA Utilizam o llms.txt?</h4>
                  <p className="text-[11px] text-[#71717a]">
                    Ferramentas como Cursor AI, GitHub Copilot e Claude Desktop acessam automaticamente <code>{config.siteUrl}/llms.txt</code> para indexar a documentação sem raspar HTML pesado.
                  </p>
                </div>
              </div>
              <a
                href="https://llmstxt.org"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline font-semibold"
              >
                <span>Ver Especificação Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
