import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import * as bmp from 'bmp-js';
import { ConvertOptions } from './types.js';
export type { ConvertOptions } from './types.js';

const supported = new Set(['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tif', '.tiff', '.gif', '.heic', '.heif', '.avif']);

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function nextAvailablePath(p: string): Promise<string> {
  const ext = path.extname(p);
  const name = path.basename(p, ext);
  let i = 1;
  let candidate = p;
  while (true) {
    try {
      await fs.access(candidate);
      candidate = path.join(path.dirname(p), `${name} (${i})${ext}`);
      i++;
    } catch {
      return candidate;
    }
  }
}

function targetPath(inputPath: string, outputDir: string): string {
  const base = path.basename(inputPath, path.extname(inputPath));
  return path.join(outputDir, `${base}.jpg`);
}

export async function convertFile(inputPath: string, opts: ConvertOptions): Promise<{ input: string; output?: string; skipped?: boolean; reason?: string; }> {
  const ext = path.extname(inputPath).toLowerCase();
  if (!supported.has(ext)) {
    return { input: inputPath, skipped: true, reason: 'unsupported' };
  }

  // Capability check for codecs that may be missing in the local sharp build
  if (ext === '.avif' && !(sharp.format as any).avif?.input?.supported) {
    return { input: inputPath, skipped: true, reason: 'decoder-unavailable: avif' };
  }
  if ((ext === '.heic' || ext === '.heif') && !(sharp.format as any).heif?.input?.supported) {
    return { input: inputPath, skipped: true, reason: 'decoder-unavailable: heif' };
  }
  // Für gängige Formate (WEBP/BMP) verlassen wir uns auf try/catch unten,
  // da manche sharp-Builds die Format-Capabilities nicht vollständig auflisten.

  await ensureDir(opts.outputDir);
  let out = targetPath(inputPath, opts.outputDir);
  if (opts.collision === 'rename') {
    out = await nextAvailablePath(out);
  } else if (opts.collision === 'skip') {
    try {
      await fs.access(out);
      return { input: inputPath, skipped: true, reason: 'exists' };
    } catch { /* not exists */ }
  }

  try {
    // Fallback für BMP: nutze bmp-js, wenn sharp beim Öffnen scheitert
    if (ext === '.bmp') {
      try {
        const buf = await fs.readFile(inputPath);
        const decoded = bmp.decode(buf);
        const raw = Buffer.from(decoded.data.buffer);
        let pipeline = sharp(raw, { raw: { width: decoded.width, height: decoded.height, channels: 4 } });
        if (opts.toSrgb) pipeline = pipeline.toColourspace('srgb');
        pipeline = pipeline.flatten({ background: opts.background });
        await pipeline.jpeg({ quality: opts.quality, mozjpeg: true, progressive: true }).toFile(out);
        return { input: inputPath, output: out };
      } catch {
        // Fallback fehlgeschlagen, versuche regulären Weg
      }
    }

    const pipeline = sharp(inputPath, { limitInputPixels: false });
    if (opts.toSrgb) pipeline.toColourspace('srgb');

    // Transparent formats -> flatten to background color
    pipeline.flatten({ background: opts.background });

    // Metadata handling
    const withMeta = opts.keepExif || opts.keepIcc;
    if (withMeta && !opts.removeGps) {
      pipeline.withMetadata();
    }
    // MVP: if removeGps is true, we omit EXIF entirely

    await pipeline.jpeg({ quality: opts.quality, mozjpeg: true, progressive: true }).toFile(out);
    return { input: inputPath, output: out };
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    if (msg.includes('unsupported image format') || msg.includes('VipsForeignLoad') || msg.includes('Input file has an unsupported format')) {
      return { input: inputPath, skipped: true, reason: `decoder-unavailable: ${ext.replace('.', '')}` };
    }
    return { input: inputPath, skipped: true, reason: msg };
  }
}


