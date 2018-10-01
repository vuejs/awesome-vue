"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var globParent = require("glob-parent");
var isGlob = require("is-glob");
var micromatch = require("micromatch");
var GLOBSTAR = '**';
/**
 * Return true for static pattern.
 */
function isStaticPattern(pattern) {
    return !isDynamicPattern(pattern);
}
exports.isStaticPattern = isStaticPattern;
/**
 * Return true for pattern that looks like glob.
 */
function isDynamicPattern(pattern) {
    return isGlob(pattern);
}
exports.isDynamicPattern = isDynamicPattern;
/**
 * Convert a windows «path» to a unix-style «path».
 */
function unixifyPattern(pattern) {
    return pattern.replace(/\\/g, '/');
}
exports.unixifyPattern = unixifyPattern;
/**
 * Returns negative pattern as positive pattern.
 */
function convertToPositivePattern(pattern) {
    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
}
exports.convertToPositivePattern = convertToPositivePattern;
/**
 * Returns positive pattern as negative pattern.
 */
function convertToNegativePattern(pattern) {
    return '!' + pattern;
}
exports.convertToNegativePattern = convertToNegativePattern;
/**
 * Return true if provided pattern is negative pattern.
 */
function isNegativePattern(pattern) {
    return pattern.startsWith('!') && pattern[1] !== '(';
}
exports.isNegativePattern = isNegativePattern;
/**
 * Return true if provided pattern is positive pattern.
 */
function isPositivePattern(pattern) {
    return !isNegativePattern(pattern);
}
exports.isPositivePattern = isPositivePattern;
/**
 * Extracts negative patterns from array of patterns.
 */
function getNegativePatterns(patterns) {
    return patterns.filter(isNegativePattern);
}
exports.getNegativePatterns = getNegativePatterns;
/**
 * Extracts positive patterns from array of patterns.
 */
function getPositivePatterns(patterns) {
    return patterns.filter(isPositivePattern);
}
exports.getPositivePatterns = getPositivePatterns;
/**
 * Extract base directory from provided pattern.
 */
function getBaseDirectory(pattern) {
    return globParent(pattern);
}
exports.getBaseDirectory = getBaseDirectory;
/**
 * Return true if provided pattern has globstar.
 */
function hasGlobStar(pattern) {
    return pattern.indexOf(GLOBSTAR) !== -1;
}
exports.hasGlobStar = hasGlobStar;
/**
 * Return true if provided pattern ends with slash and globstar.
 */
function endsWithSlashGlobStar(pattern) {
    return pattern.endsWith('/' + GLOBSTAR);
}
exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
/**
 * Returns «true» when pattern ends with a slash and globstar or the last partial of the pattern is static pattern.
 */
function isAffectDepthOfReadingPattern(pattern) {
    var basename = path.basename(pattern);
    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
}
exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
/**
 * Return naive depth of provided pattern.
 */
function getDepth(pattern) {
    return pattern.split('/').length;
}
exports.getDepth = getDepth;
/**
 * Make RegExp for provided pattern.
 */
function makeRe(pattern, options) {
    return micromatch.makeRe(pattern, options);
}
exports.makeRe = makeRe;
/**
 * Convert patterns to regexps.
 */
function convertPatternsToRe(patterns, options) {
    return patterns.map(function (pattern) { return makeRe(pattern, options); });
}
exports.convertPatternsToRe = convertPatternsToRe;
/**
 * Returns true if the entry match any of the given RegExp's.
 */
function matchAny(entry, patternsRe) {
    try {
        for (var patternsRe_1 = __values(patternsRe), patternsRe_1_1 = patternsRe_1.next(); !patternsRe_1_1.done; patternsRe_1_1 = patternsRe_1.next()) {
            var regexp = patternsRe_1_1.value;
            if (regexp.test(entry)) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (patternsRe_1_1 && !patternsRe_1_1.done && (_a = patternsRe_1.return)) _a.call(patternsRe_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
    var e_1, _a;
}
exports.matchAny = matchAny;
