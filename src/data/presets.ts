import { BgConfig, KvConfig, PresetTemplate, TextOverlayConfig, WatermarkConfig } from '../types';

// Procedural SVG Backgrounds as Data URIs for Instant Loading
export const PRESET_BACKGROUNDS = [
  {
    id: 'cyber-mesh',
    name: 'Cyber Mesh Indigo',
    category: 'Gradients',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <defs>
          <radialGradient id="g1" cx="20%" cy="20%" r="60%">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="1"/>
          </radialGradient>
          <radialGradient id="g2" cx="80%" cy="80%" r="50%">
            <stop offset="0%" stop-color="#ec4899" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="g3" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="630" fill="#090d16"/>
        <rect width="1200" height="630" fill="url(#g1)"/>
        <rect width="1200" height="630" fill="url(#g2)"/>
        <rect width="1200" height="630" fill="url(#g3)"/>
      </svg>
    `),
    config: {
      sourceType: 'image' as const,
      fitMode: 'cover' as const,
      blur: 0,
      brightness: 100,
      contrast: 105,
      saturation: 110,
      overlayColor: '#000000',
      overlayOpacity: 0,
    }
  },
  {
    id: 'aurora-emerald',
    name: 'Aurora Emerald',
    category: 'Gradients',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="50%" stop-color="#022c22"/>
            <stop offset="100%" stop-color="#051410"/>
          </linearGradient>
          <radialGradient id="g2" cx="70%" cy="30%" r="50%">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#064e3b" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="g3" cx="30%" cy="80%" r="45%">
            <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#051410" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#g1)"/>
        <rect width="1200" height="630" fill="url(#g2)"/>
        <rect width="1200" height="630" fill="url(#g3)"/>
      </svg>
    `),
    config: {
      sourceType: 'image' as const,
      fitMode: 'cover' as const,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      overlayColor: '#000000',
      overlayOpacity: 0,
    }
  },
  {
    id: 'sunset-violet',
    name: 'Sunset Sunset & Peach',
    category: 'Vibrant',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4c1d95"/>
            <stop offset="45%" stop-color="#c026d3"/>
            <stop offset="85%" stop-color="#f97316"/>
            <stop offset="100%" stop-color="#facc15"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
      </svg>
    `),
    config: {
      sourceType: 'image' as const,
      fitMode: 'cover' as const,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      overlayColor: '#000000',
      overlayOpacity: 10,
    }
  },
  {
    id: 'tech-grid-dark',
    name: 'Tech Grid Minimal',
    category: 'Patterns',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="1" stroke-opacity="0.35"/>
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1e293b" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#020617" stop-opacity="0.95"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="630" fill="#090d16"/>
        <rect width="1200" height="630" fill="url(#grid)"/>
        <rect width="1200" height="630" fill="url(#vignette)"/>
      </svg>
    `),
    config: {
      sourceType: 'image' as const,
      fitMode: 'cover' as const,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      overlayColor: '#000000',
      overlayOpacity: 0,
    }
  },
  {
    id: 'sleek-neutral-light',
    name: 'Modern Soft Gray',
    category: 'Minimal',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <defs>
          <linearGradient id="soft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#e2e8f0" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#soft)"/>
        <rect width="1200" height="630" fill="url(#glow)"/>
      </svg>
    `),
    config: {
      sourceType: 'image' as const,
      fitMode: 'cover' as const,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      overlayColor: '#000000',
      overlayOpacity: 0,
    }
  }
];

// High-quality Key Visual (KV) Presets with transparency
export const PRESET_KVS = [
  {
    id: '3d-rocket-launch',
    name: '3D Rocket Launch',
    category: 'Startup & Tech',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
          </linearGradient>
          <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ef4444"/>
            <stop offset="100%" stop-color="#991b1b"/>
          </linearGradient>
          <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24"/>
            <stop offset="60%" stop-color="#f97316"/>
            <stop offset="100%" stop-color="#ef4444"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        <!-- Flame -->
        <path d="M185 270 Q200 350 200 370 Q200 350 215 270 Z" fill="url(#flameGrad)" filter="url(#glow)"/>
        <path d="M192 270 Q200 320 200 340 Q200 320 208 270 Z" fill="#ffffff"/>
        <!-- Wings -->
        <path d="M150 220 L110 270 L160 260 Z" fill="url(#wingGrad)"/>
        <path d="M250 220 L290 270 L240 260 Z" fill="url(#wingGrad)"/>
        <!-- Center Fin -->
        <path d="M194 200 L200 130 L206 200 L200 250 Z" fill="#dc2626"/>
        <!-- Rocket Body -->
        <path d="M200 60 C160 120 160 240 170 270 L230 270 C240 240 240 120 200 60 Z" fill="url(#rocketBody)"/>
        <!-- Window -->
        <circle cx="200" cy="140" r="28" fill="#0284c7" stroke="#e2e8f0" stroke-width="6"/>
        <circle cx="192" cy="132" r="8" fill="#ffffff" opacity="0.8"/>
        <!-- Nose cone -->
        <path d="M200 60 C185 85 175 110 173 125 C185 120 215 120 227 125 C225 110 215 85 200 60 Z" fill="url(#wingGrad)"/>
      </svg>
    `),
    scalePercent: 62,
    shadowBlur: 35,
    shadowOffsetY: 18,
    shadowOpacity: 45,
    shadowColor: '#000000',
  },
  {
    id: 'ai-neural-cube',
    name: '3D Neural Hologram Cube',
    category: 'AI & Data',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="topFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#818cf8"/>
            <stop offset="100%" stop-color="#4f46e5"/>
          </linearGradient>
          <linearGradient id="leftFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4338ca"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>
          <linearGradient id="rightFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#312e81"/>
          </linearGradient>
          <filter id="cubeGlow">
            <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#6366f1" flood-opacity="0.5"/>
          </filter>
        </defs>
        <g filter="url(#cubeGlow)">
          <!-- Top face -->
          <polygon points="200,90 290,140 200,190 110,140" fill="url(#topFace)"/>
          <!-- Left face -->
          <polygon points="110,140 200,190 200,290 110,240" fill="url(#leftFace)"/>
          <!-- Right face -->
          <polygon points="200,190 290,140 290,240 200,290" fill="url(#rightFace)"/>
          <!-- Internal neon spark -->
          <circle cx="200" cy="190" r="12" fill="#38bdf8" opacity="0.9"/>
          <!-- Spark rings -->
          <line x1="200" y1="90" x2="200" y2="190" stroke="#a5b4fc" stroke-width="2" stroke-dasharray="4,4"/>
          <line x1="110" y1="140" x2="200" y2="190" stroke="#a5b4fc" stroke-width="2" stroke-dasharray="4,4"/>
          <line x1="290" y1="140" x2="200" y2="190" stroke="#a5b4fc" stroke-width="2" stroke-dasharray="4,4"/>
        </g>
      </svg>
    `),
    scalePercent: 65,
    shadowBlur: 40,
    shadowOffsetY: 20,
    shadowOpacity: 50,
    shadowColor: '#000000',
  },
  {
    id: 'cyber-shield-security',
    name: 'Verified Shield Badge',
    category: 'Badge & Security',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10b981"/>
            <stop offset="50%" stop-color="#059669"/>
            <stop offset="100%" stop-color="#047857"/>
          </linearGradient>
          <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6ee7b7"/>
            <stop offset="100%" stop-color="#065f46"/>
          </linearGradient>
        </defs>
        <path d="M200 70 L300 110 C300 230 200 310 200 330 C200 310 100 230 100 110 Z" fill="url(#shieldGrad)" stroke="url(#shieldBorder)" stroke-width="12" stroke-linejoin="round"/>
        <!-- Checkmark -->
        <polyline points="160,200 190,230 250,160" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `),
    scalePercent: 60,
    shadowBlur: 30,
    shadowOffsetY: 15,
    shadowOpacity: 40,
    shadowColor: '#000000',
  },
  {
    id: 'creator-sparkle-star',
    name: 'Golden Sparkle Star',
    category: 'Creative & Media',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="30%" stop-color="#facc15"/>
            <stop offset="70%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
        </defs>
        <!-- 4-point Sparkle -->
        <path d="M200 40 Q200 200 360 200 Q200 200 200 360 Q200 200 40 200 Q200 200 200 40 Z" fill="url(#gold)"/>
        <!-- Secondary Sparkles -->
        <circle cx="120" cy="100" r="14" fill="#fde047"/>
        <circle cx="290" cy="110" r="10" fill="#fde047"/>
        <circle cx="280" cy="290" r="12" fill="#fde047"/>
      </svg>
    `),
    scalePercent: 62,
    shadowBlur: 35,
    shadowOffsetY: 16,
    shadowOpacity: 40,
    shadowColor: '#000000',
  }
];

export const INITIAL_BG_CONFIG: BgConfig = {
  sourceType: 'image',
  imageUrl: PRESET_BACKGROUNDS[0].previewUrl,
  imageFileName: 'cyber-mesh-bg.svg',
  fitMode: 'cover',
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  overlayColor: '#000000',
  overlayOpacity: 0,
};

export const INITIAL_KV_CONFIG: KvConfig = {
  imageUrl: PRESET_KVS[0].previewUrl,
  imageFileName: 'rocket-kv.svg',
  scalePercent: 60,
  offsetX: 0,
  offsetY: 0,
  alignment: 'center',
  borderRadius: 0,
  isCircle: false,
  shadowEnabled: true,
  shadowColor: '#000000',
  shadowBlur: 35,
  shadowOffsetY: 18,
  shadowOpacity: 45,
  borderWidth: 0,
  borderColor: '#ffffff',
  glowEnabled: false,
  glowColor: '#6366f1',
  glowBlur: 30,
};

export const INITIAL_TEXT_OVERLAY: TextOverlayConfig = {
  enabled: false,
  badgeText: 'NOVO LANÇAMENTO',
  badgeBgColor: '#6366f1',
  badgeTextColor: '#ffffff',
  badgePosition: 'top-center',
  titleText: 'Título do Seu Projeto',
  titleColor: '#ffffff',
  titleFontSize: 44,
  titlePosition: 'below-kv',
  subtitleText: 'A sua solução moderna para a web',
  subtitleColor: '#cbd5e1',
};

// Sample Watermark/Brand SVGs
export const PRESET_WATERMARKS = [
  {
    id: 'seal-verified',
    name: 'Selo Oficial de Autenticidade',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f9e79f"/>
            <stop offset="50%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#996515"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="#0f1115" stroke="url(#gold)" stroke-width="6"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="4,4"/>
        <path d="M100 35 L108 55 L130 55 L112 68 L118 88 L100 76 L82 88 L88 68 L70 55 L92 55 Z" fill="url(#gold)"/>
        <text x="100" y="125" text-anchor="middle" fill="#f9e79f" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" letter-spacing="3">VERIFICADO</text>
        <text x="100" y="145" text-anchor="middle" fill="#d4af37" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="10" letter-spacing="2">100% ORIGINAL</text>
      </svg>
    `)
  },
  {
    id: 'brand-minimal-badge',
    name: 'Logo Minimalista Monocromático',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="240" height="80" viewBox="0 0 240 80">
        <defs>
          <linearGradient id="brandGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f9e79f"/>
            <stop offset="100%" stop-color="#d4af37"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="236" height="76" rx="38" fill="#0f1115" stroke="url(#brandGold)" stroke-width="2"/>
        <circle cx="42" cy="40" r="22" fill="url(#brandGold)"/>
        <polygon points="42,26 48,37 60,37 50,44 54,55 42,48 30,55 34,44 24,37 36,37" fill="#0f1115"/>
        <text x="80" y="47" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="22" letter-spacing="2">STUDIO</text>
      </svg>
    `)
  },
  {
    id: 'tech-cloud-logo',
    name: 'MM Server Cloud Logo',
    previewUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="80" viewBox="0 0 220 80">
        <defs>
          <linearGradient id="cloudG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#f9e79f"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="220" height="80" rx="16" fill="#16181d" stroke="#ffffff15" stroke-width="1.5"/>
        <path d="M35 50 A12 12 0 0 1 35 26 A18 18 0 0 1 65 24 A15 15 0 0 1 75 42 A12 12 0 0 1 70 50 Z" fill="url(#cloudG)"/>
        <text x="90" y="42" fill="#f9e79f" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="18" letter-spacing="1">MMSERVER</text>
        <text x="90" y="58" fill="#a1a1aa" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="10" letter-spacing="2">HOSTING &amp; CLOUD</text>
      </svg>
    `)
  }
];

export const INITIAL_WATERMARK_CONFIG: WatermarkConfig = {
  enabled: false,
  imageUrl: PRESET_WATERMARKS[0].previewUrl,
  imageFileName: 'selo-verificado.svg',
  position: 'top-right',
  scalePercent: 18,
  opacity: 90,
  margin: 40,
  rotation: 0,
  filterMode: 'original',
  backgroundStyle: 'none',
};

export const TEMPLATES: PresetTemplate[] = [
  {
    id: 'startup-rocket',
    name: 'Tech Launch (Escuro & Vibrante)',
    category: 'Tech',
    description: 'Background mesh índigo com foguete 3D centralizado e sombra suave',
    bgConfig: {
      sourceType: 'image',
      imageUrl: PRESET_BACKGROUNDS[0].previewUrl,
      imageFileName: 'cyber-mesh.svg',
      fitMode: 'cover',
      blur: 0,
      brightness: 100,
      contrast: 105,
      saturation: 110,
      overlayColor: '#000000',
      overlayOpacity: 0,
    },
    kvConfig: {
      imageUrl: PRESET_KVS[0].previewUrl,
      imageFileName: 'rocket-3d.svg',
      scalePercent: 62,
      offsetX: 0,
      offsetY: 0,
      alignment: 'center',
      shadowEnabled: true,
      shadowBlur: 35,
      shadowOffsetY: 18,
      shadowOpacity: 50,
      shadowColor: '#000000',
      isCircle: false,
      borderWidth: 0,
    },
    thumbnailBg: 'linear-gradient(135deg, #6366f1 0%, #0f172a 100%)',
    previewKvIcon: 'Rocket',
  },
  {
    id: 'ai-matrix-cube',
    name: 'AI & Data Tech Grid',
    category: 'AI',
    description: 'Fundo grid técnico com cubo neural 3D e efeito glow',
    bgConfig: {
      sourceType: 'image',
      imageUrl: PRESET_BACKGROUNDS[3].previewUrl,
      imageFileName: 'tech-grid.svg',
      fitMode: 'cover',
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      overlayColor: '#000000',
      overlayOpacity: 0,
    },
    kvConfig: {
      imageUrl: PRESET_KVS[1].previewUrl,
      imageFileName: 'neural-cube.svg',
      scalePercent: 65,
      offsetX: 0,
      offsetY: 0,
      alignment: 'center',
      shadowEnabled: true,
      shadowBlur: 45,
      shadowOffsetY: 20,
      shadowOpacity: 55,
      shadowColor: '#000000',
      glowEnabled: true,
      glowColor: '#6366f1',
      glowBlur: 25,
      isCircle: false,
      borderWidth: 0,
    },
    thumbnailBg: 'linear-gradient(135deg, #1e293b 0%, #020617 100%)',
    previewKvIcon: 'Cpu',
  },
  {
    id: 'security-emerald',
    name: 'SaaS Trust & Security',
    category: 'SaaS',
    description: 'Fundo aurora esmeralda com escudo de verificação',
    bgConfig: {
      sourceType: 'image',
      imageUrl: PRESET_BACKGROUNDS[1].previewUrl,
      imageFileName: 'aurora-emerald.svg',
      fitMode: 'cover',
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      overlayColor: '#000000',
      overlayOpacity: 0,
    },
    kvConfig: {
      imageUrl: PRESET_KVS[2].previewUrl,
      imageFileName: 'shield-security.svg',
      scalePercent: 60,
      offsetX: 0,
      offsetY: 0,
      alignment: 'center',
      shadowEnabled: true,
      shadowBlur: 30,
      shadowOffsetY: 15,
      shadowOpacity: 45,
      shadowColor: '#000000',
      isCircle: false,
      borderWidth: 0,
    },
    thumbnailBg: 'linear-gradient(135deg, #10b981 0%, #022c22 100%)',
    previewKvIcon: 'ShieldCheck',
  },
  {
    id: 'golden-star-creator',
    name: 'Creator & Podcast Spotlight',
    category: 'Media',
    description: 'Fundo vibrante roxo e laranja com estrela dourada',
    bgConfig: {
      sourceType: 'image',
      imageUrl: PRESET_BACKGROUNDS[2].previewUrl,
      imageFileName: 'sunset-violet.svg',
      fitMode: 'cover',
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      overlayColor: '#000000',
      overlayOpacity: 10,
    },
    kvConfig: {
      imageUrl: PRESET_KVS[3].previewUrl,
      imageFileName: 'golden-star.svg',
      scalePercent: 62,
      offsetX: 0,
      offsetY: 0,
      alignment: 'center',
      shadowEnabled: true,
      shadowBlur: 35,
      shadowOffsetY: 18,
      shadowOpacity: 40,
      shadowColor: '#000000',
      isCircle: false,
      borderWidth: 0,
    },
    thumbnailBg: 'linear-gradient(135deg, #c026d3 0%, #f97316 100%)',
    previewKvIcon: 'Sparkles',
  }
];
