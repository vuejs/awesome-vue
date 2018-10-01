/// <reference types="micromatch" />
import micromatch = require('micromatch');
import { IOptions } from '../../managers/options';
import { FilterFunction } from '@mrmlnc/readdir-enhanced';
import { Pattern } from '../../types/patterns';
export default class DeepFilter {
    private readonly options;
    private readonly micromatchOptions;
    readonly index: Map<string, undefined>;
    constructor(options: IOptions, micromatchOptions: micromatch.Options);
    /**
     * Returns filter for directories.
     */
    getFilter(positive: Pattern[], negative: Pattern[]): FilterFunction;
    /**
     * Returns true if entry must be added to result.
     */
    private filter(entry, positiveRe, negativeRe);
    /**
     * Return true if the entry already has in the cross reader index.
     */
    private isDuplicateEntry(entry);
    /**
     * Create record in the cross reader index.
     */
    private createIndexRecord(entry);
    /**
     * Returns true for non-files if the «onlyFiles» option is enabled.
     */
    private onlyFileFilter(entry);
    /**
     * Returns true for non-directories if the «onlyDirectories» option is enabled.
     */
    private onlyDirectoryFilter(entry);
    /**
     * Return true when entry match to provided patterns.
     *
     * First, just trying to apply patterns to the path.
     * Second, trying to apply patterns to the path with final slash (need to micromatch to support «directory/**» patterns).
     */
    private isMatchToPatterns(entry, patternsRe);
}
