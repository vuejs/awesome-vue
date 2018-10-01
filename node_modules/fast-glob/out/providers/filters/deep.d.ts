/// <reference types="micromatch" />
import micromatch = require('micromatch');
import { IOptions } from '../../managers/options';
import { FilterFunction } from '@mrmlnc/readdir-enhanced';
import { Pattern } from '../../types/patterns';
export default class DeepFilter {
    private readonly options;
    private readonly micromatchOptions;
    constructor(options: IOptions, micromatchOptions: micromatch.Options);
    /**
     * Returns filter for directories.
     */
    getFilter(positive: Pattern[], negative: Pattern[]): FilterFunction;
    /**
     * Returns max depth of the provided patterns.
     */
    private getMaxPatternDepth(patterns);
    /**
     * Returns RegExp's for patterns that can affect the depth of reading.
     */
    private getNegativePatternsRe(patterns);
    /**
     * Returns «true» for directory that should be readed.
     */
    private filter(entry, negativeRe, maxPatternDepth);
    /**
     * Returns «true» when the directory can be skipped by nesting level.
     */
    private isSkippedByNestingLevel(entryDepth, maxPatternDepth);
    /**
     * Returns «true» when the «deep» option is disabled or number and depth of the entry is greater that the option value.
     */
    private isSkippedByDeepOption(entryDepth);
    /**
     * Returns «true» when depth parameter is not an Infinity and entry depth greater that the parameter value.
     */
    private isSkippedByMaxPatternDepth(entryDepth, maxPatternDepth);
    /**
     * Returns «true» for symlinked directory if the «followSymlinkedDirectories» option is disabled.
     */
    private isSkippedSymlinkedDirectory(entry);
    /**
     * Returns «true» for a directory whose name starts with a period if «dot» option is disabled.
     */
    private isSkippedDotDirectory(entry);
    /**
     * Returns «true» for a directory whose path math to any negative pattern.
     */
    private isSkippedByNegativePatterns(entry, negativeRe);
}
