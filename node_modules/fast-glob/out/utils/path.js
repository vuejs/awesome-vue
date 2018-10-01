"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
/**
 * Returns «true» if the last partial of the path starting with a period.
 */
function isDotDirectory(filepath) {
    return path.basename(filepath).startsWith('.');
}
exports.isDotDirectory = isDotDirectory;
/**
 * Return naive depth of provided filepath.
 */
function getDepth(filepath) {
    return filepath.split('/').length;
}
exports.getDepth = getDepth;
/**
 * Return resolved a sequence of paths segments into an absolute path.
 */
function resolve(from, to) {
    return path.resolve(from, to);
}
exports.resolve = resolve;
/**
 * Convert a windows-like path to a unix-style path.
 */
function normalize(filepath) {
    return filepath.replace(/\\/g, '/');
}
exports.normalize = normalize;
