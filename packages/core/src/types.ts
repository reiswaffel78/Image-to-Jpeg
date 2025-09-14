export type CollisionStrategy = 'rename' | 'overwrite' | 'skip';

export interface ConvertOptions {
  quality: number;               // 1–100
  background: string;            // e.g. "#ffffff"
  keepExif: boolean;
  keepIcc: boolean;
  removeGps: boolean;            // MVP: if true, drop EXIF entirely
  toSrgb: boolean;
  collision: CollisionStrategy;  // default: 'rename'
  outputDir: string;             // default: Downloads
  rawMode?: 'fast' | 'precise';  // RAW strategy
}


