/**
 * Returns «true» if the last partial of the path starting with a period.
 */
export declare function isDotDirectory(filepath: string): boolean;
/**
 * Return naive depth of provided filepath.
 */
export declare function getDepth(filepath: string): number;
/**
 * Return resolved a sequence of paths segments into an absolute path.
 */
export declare function resolve(from: string, to: string): string;
/**
 * Convert a windows-like path to a unix-style path.
 */
export declare function normalize(filepath: string): string;
