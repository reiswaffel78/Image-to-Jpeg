export type CollisionStrategy = 'rename' | 'overwrite' | 'skip';
export interface ConvertOptions {
    quality: number;
    background: string;
    keepExif: boolean;
    keepIcc: boolean;
    removeGps: boolean;
    toSrgb: boolean;
    collision: CollisionStrategy;
    outputDir: string;
    rawMode?: 'fast' | 'precise';
}
