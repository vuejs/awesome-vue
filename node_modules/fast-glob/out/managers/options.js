"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function prepare(options) {
    var opts = Object.assign({
        cwd: process.cwd(),
        deep: true,
        ignore: [],
        dot: false,
        stats: false,
        onlyFiles: true,
        onlyDirectories: false,
        followSymlinkedDirectories: true,
        unique: true,
        markDirectories: false,
        absolute: false,
        nobrace: false,
        brace: true,
        noglobstar: false,
        globstar: true,
        noext: false,
        extension: true,
        nocase: false,
        case: true,
        matchBase: false,
        transform: null
    }, options);
    if (opts.onlyDirectories) {
        opts.onlyFiles = false;
    }
    opts.brace = !opts.nobrace;
    opts.globstar = !opts.noglobstar;
    opts.extension = !opts.noext;
    opts.case = !opts.nocase;
    if (options) {
        opts.brace = ('brace' in options ? options.brace : opts.brace);
        opts.globstar = ('globstar' in options ? options.globstar : opts.globstar);
        opts.extension = ('extension' in options ? options.extension : opts.extension);
        opts.case = ('case' in options ? options.case : opts.case);
    }
    return opts;
}
exports.prepare = prepare;
