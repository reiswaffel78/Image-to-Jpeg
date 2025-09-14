import { ConvertOptions } from './types.js';
export type { ConvertOptions } from './types.js';
export declare function convertFile(inputPath: string, opts: ConvertOptions): Promise<{
    input: string;
    output?: string;
    skipped?: boolean;
    reason?: string;
}>;
