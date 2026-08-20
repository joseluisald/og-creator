import { BgConfig, KvConfig, TextOverlayConfig } from '../types';

export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 630;

// In-memory image element cache to avoid re-decoding images on every single slider tick
const imageElementCache = new Map<string, HTMLImageElement>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageElementCache.has(src)) {
    const cached = imageElementCache.get(src)!;
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementCache.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = src;
  });
}

export async function renderOgImage(
  canvas: HTMLCanvasElement,
  bgConfig: BgConfig,
  kvConfig: KvConfig,
  textOverlay?: TextOverlayConfig,
  options?: { showSafeGuides?: boolean }
): Promise<void> {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Set precise canvas dimensions (1200 x 630)
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 1. RENDER BACKGROUND LAYER
  await renderBackground(ctx, bgConfig);

  // 2. RENDER KEY VISUAL (KV) LAYER
  if (kvConfig.imageUrl) {
    await renderKeyVisual(ctx, kvConfig, textOverlay);
  }

  // 3. RENDER TEXT OVERLAYS (IF ENABLED)
  if (textOverlay?.enabled) {
    renderTextOverlays(ctx, textOverlay, kvConfig);
  }

  // 4. OPTIONAL SAFE GUIDES (FOR EDITING VIEW ONLY)
  if (options?.showSafeGuides) {
    renderSafeGuides(ctx);
  }
}

async function renderBackground(ctx: CanvasRenderingContext2D, bg: BgConfig): Promise<void> {
  ctx.save();

  // Base background fill (in case image is transparent or fails)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (bg.imageUrl) {
    try {
      const img = await loadImage(bg.imageUrl);
      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;

      // Apply CSS-like filter string for canvas
      const filters: string[] = [];
      if (bg.blur > 0) filters.push(`blur(${bg.blur}px)`);
      if (bg.brightness !== 100) filters.push(`brightness(${bg.brightness}%)`);
      if (bg.contrast !== 100) filters.push(`contrast(${bg.contrast}%)`);
      if (bg.saturation !== 100) filters.push(`saturate(${bg.saturation}%)`);

      ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';

      if (bg.fitMode === 'cover') {
        // Calculate cover scaling
        const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
        const imgRatio = imgW / imgH;

        let drawW: number;
        let drawH: number;

        if (imgRatio > canvasRatio) {
          drawH = CANVAS_HEIGHT * bg.scale;
          drawW = drawH * imgRatio;
        } else {
          drawW = CANVAS_WIDTH * bg.scale;
          drawH = drawW / imgRatio;
        }

        const drawX = (CANVAS_WIDTH - drawW) / 2 + bg.offsetX;
        const drawY = (CANVAS_HEIGHT - drawH) / 2 + bg.offsetY;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else if (bg.fitMode === 'contain') {
        // Calculate contain scaling
        const scaleFactor = Math.min(CANVAS_WIDTH / imgW, CANVAS_HEIGHT / imgH) * bg.scale;
        const drawW = imgW * scaleFactor;
        const drawH = imgH * scaleFactor;
        const drawX = (CANVAS_WIDTH - drawW) / 2 + bg.offsetX;
        const drawY = (CANVAS_HEIGHT - drawH) / 2 + bg.offsetY;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else if (bg.fitMode === 'stretch') {
        ctx.drawImage(img, bg.offsetX, bg.offsetY, CANVAS_WIDTH * bg.scale, CANVAS_HEIGHT * bg.scale);
      } else if (bg.fitMode === 'blur-fill') {
        // Draw heavily blurred backdrop
        ctx.save();
        ctx.filter = `blur(30px) brightness(85%)`;
        ctx.drawImage(img, -50, -50, CANVAS_WIDTH + 100, CANVAS_HEIGHT + 100);
        ctx.restore();

        // Then draw crisp contained foreground
        const scaleFactor = Math.min(CANVAS_WIDTH * 0.9 / imgW, CANVAS_HEIGHT * 0.9 / imgH) * bg.scale;
        const drawW = imgW * scaleFactor;
        const drawH = imgH * scaleFactor;
        const drawX = (CANVAS_WIDTH - drawW) / 2 + bg.offsetX;
        const drawY = (CANVAS_HEIGHT - drawH) / 2 + bg.offsetY;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
    } catch {
      // Fallback if image failed
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }

  ctx.restore();

  // Apply Overlay Tint Layer if opacity > 0
  if (bg.overlayOpacity > 0 && bg.overlayColor) {
    ctx.save();
    ctx.fillStyle = bg.overlayColor;
    ctx.globalAlpha = Math.min(Math.max(bg.overlayOpacity / 100, 0), 1);
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.restore();
  }
}

async function renderKeyVisual(
  ctx: CanvasRenderingContext2D,
  kv: KvConfig,
  textOverlay?: TextOverlayConfig
): Promise<void> {
  if (!kv.imageUrl) return;

  try {
    const img = await loadImage(kv.imageUrl);
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;

    // Determine safe canvas boundaries for the KV
    // Standard bounding box is max 850px wide x 500px high at 100% scale
    const baseTargetDim = 520;
    const targetScale = (kv.scalePercent / 100);

    // Compute aspect-fit dimensions
    let drawW: number;
    let drawH: number;

    const imgAspect = imgW / imgH;
    if (imgAspect >= 1) {
      drawW = (baseTargetDim * 1.5) * targetScale;
      drawH = drawW / imgAspect;
      // Cap height if it exceeds canvas bounds
      if (drawH > CANVAS_HEIGHT * 0.85 * targetScale) {
        drawH = CANVAS_HEIGHT * 0.85 * targetScale;
        drawW = drawH * imgAspect;
      }
    } else {
      drawH = baseTargetDim * targetScale;
      drawW = drawH * imgAspect;
      // Cap width if it exceeds
      if (drawW > CANVAS_WIDTH * 0.85 * targetScale) {
        drawW = CANVAS_WIDTH * 0.85 * targetScale;
        drawH = drawW / imgAspect;
      }
    }

    // Determine X and Y based on Alignment Mode
    let baseX = (CANVAS_WIDTH - drawW) / 2;
    let baseY = (CANVAS_HEIGHT - drawH) / 2;

    // Shift up slightly if text overlay is positioned below KV
    if (textOverlay?.enabled && textOverlay.titlePosition === 'below-kv') {
      baseY -= 50;
    }

    switch (kv.alignment) {
      case 'center-top':
        baseY = 60;
        break;
      case 'center-bottom':
        baseY = CANVAS_HEIGHT - drawH - 60;
        break;
      case 'center-left':
        baseX = 90;
        break;
      case 'center-right':
        baseX = CANVAS_WIDTH - drawW - 90;
        break;
      case 'center':
      default:
        // Already centered
        break;
    }

    const finalX = baseX + kv.offsetX;
    const finalY = baseY + kv.offsetY;

    // 1. Render Glow if enabled
    if (kv.glowEnabled && kv.glowColor) {
      ctx.save();
      ctx.shadowColor = kv.glowColor;
      ctx.shadowBlur = kv.glowBlur || 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = kv.glowColor;
      ctx.globalAlpha = 0.6;
      // Draw a soft glowing shape behind
      drawRoundedRect(ctx, finalX - 4, finalY - 4, drawW + 8, drawH + 8, getCalculatedRadius(kv, drawW, drawH));
      ctx.fill();
      ctx.restore();
    }

    // 2. Render Shadow & KV image
    ctx.save();

    if (kv.shadowEnabled && kv.shadowOpacity > 0) {
      const alphaHex = Math.round((kv.shadowOpacity / 100) * 255).toString(16).padStart(2, '0');
      ctx.shadowColor = kv.shadowColor.startsWith('#')
        ? `${kv.shadowColor}${alphaHex}`
        : kv.shadowColor;
      ctx.shadowBlur = kv.shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = kv.shadowOffsetY;
    }

    const radius = getCalculatedRadius(kv, drawW, drawH);

    if (radius > 0 || kv.isCircle) {
      ctx.beginPath();
      drawRoundedRect(ctx, finalX, finalY, drawW, drawH, radius);
      ctx.closePath();
      ctx.clip();
    }

    // Draw KV Image
    ctx.drawImage(img, finalX, finalY, drawW, drawH);

    ctx.restore();

    // 3. Render Border Stroke if specified
    if (kv.borderWidth > 0) {
      ctx.save();
      ctx.strokeStyle = kv.borderColor;
      ctx.lineWidth = kv.borderWidth;
      ctx.beginPath();
      drawRoundedRect(ctx, finalX, finalY, drawW, drawH, radius);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  } catch (err) {
    console.error('Failed to render Key Visual:', err);
  }
}

function getCalculatedRadius(kv: KvConfig, w: number, h: number): number {
  if (kv.isCircle) {
    return Math.min(w, h) / 2;
  }
  return kv.borderRadius || 0;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const radius = Math.min(r, w / 2, h / 2);
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.arcTo(x + w, y, x + w, y + radius, radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
    ctx.lineTo(x + radius, y + h);
    ctx.arcTo(x, y + h, x, y + h - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }
}

function renderTextOverlays(
  ctx: CanvasRenderingContext2D,
  text: TextOverlayConfig,
  kv: KvConfig
): void {
  ctx.save();

  // 1. Badge / Tag Pill
  if (text.badgeText.trim()) {
    ctx.font = '600 18px "Outfit", "Plus Jakarta Sans", sans-serif';
    const paddingX = 20;
    const paddingY = 8;
    const textMetrics = ctx.measureText(text.badgeText.toUpperCase());
    const badgeW = textMetrics.width + paddingX * 2;
    const badgeH = 36;

    let badgeX = (CANVAS_WIDTH - badgeW) / 2;
    let badgeY = 60;

    switch (text.badgePosition) {
      case 'top-left':
        badgeX = 60;
        badgeY = 60;
        break;
      case 'top-right':
        badgeX = CANVAS_WIDTH - badgeW - 60;
        badgeY = 60;
        break;
      case 'bottom-left':
        badgeX = 60;
        badgeY = CANVAS_HEIGHT - badgeH - 60;
        break;
      case 'bottom-right':
        badgeX = CANVAS_WIDTH - badgeW - 60;
        badgeY = CANVAS_HEIGHT - badgeH - 60;
        break;
      case 'bottom-center':
        badgeX = (CANVAS_WIDTH - badgeW) / 2;
        badgeY = CANVAS_HEIGHT - badgeH - 60;
        break;
      case 'top-center':
      default:
        badgeX = (CANVAS_WIDTH - badgeW) / 2;
        badgeY = 55;
        break;
    }

    // Badge Background
    ctx.fillStyle = text.badgeBgColor || '#6366f1';
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 18);
    ctx.fill();

    // Badge Text
    ctx.fillStyle = text.badgeTextColor || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.badgeText.toUpperCase(), badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);
  }

  // 2. Title & Subtitle
  if (text.titleText.trim()) {
    const fontSize = text.titleFontSize || 42;
    ctx.font = `700 ${fontSize}px "Outfit", "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = text.titleColor || '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let titleY = CANVAS_HEIGHT - 100;
    let titleX = CANVAS_WIDTH / 2;

    if (text.titlePosition === 'below-kv') {
      titleY = CANVAS_HEIGHT - 85 + kv.offsetY;
    } else if (text.titlePosition === 'bottom-left') {
      titleX = 80;
      ctx.textAlign = 'left';
    }

    ctx.fillText(text.titleText, titleX, titleY);

    // Subtitle
    if (text.subtitleText.trim()) {
      ctx.font = `500 ${Math.max(fontSize * 0.45, 18)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = text.subtitleColor || '#94a3b8';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      ctx.fillText(text.subtitleText, titleX, titleY + fontSize * 0.7);
    }
  }

  ctx.restore();
}

function renderSafeGuides(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);

  // 1200x630 Outer boundary & Safe Area Margins (60px margin)
  ctx.strokeRect(60, 60, CANVAS_WIDTH - 120, CANVAS_HEIGHT - 120);

  // Center crosshairs
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2, 0);
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
  ctx.moveTo(0, CANVAS_HEIGHT / 2);
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
  ctx.stroke();

  // Safe area label
  ctx.setLineDash([]);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('1200 × 630 px (Safe Zone)', 70, 85);
  ctx.textAlign = 'right';
  ctx.fillText('Center: 600, 315', CANVAS_WIDTH - 70, 85);

  ctx.restore();
}

export async function exportCanvasAsBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create Blob from Canvas'));
      },
      mimeType,
      quality
    );
  });
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await exportCanvasAsBlob(canvas, 'png', 1.0);
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('Clipboard API not supported');
    }
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
