'use strict';
var path = require('path');
var fs = require('graceful-fs');
var stripBom = require('strip-bom');
var stripBomStream = require('strip-bom-stream');
var File = require('vinyl');
var pify = require('pify');
var Promise = require('pinkie-promise');
var fsP = pify(fs, Promise);

exports.read = function (pth, opts) {
	opts = opts || {};

	var cwd = opts.cwd || process.cwd();
	var base = opts.base || cwd;

	pth = path.resolve(cwd, pth);

	return fsP.stat(pth).then(function (stat) {
		var file = new File({
			cwd: cwd,
			base: base,
			path: pth,
			stat: stat
		});

		if (opts.read === false) {
			return file;
		}

		if (opts.buffer === false) {
			file.contents = fs.createReadStream(pth).pipe(stripBomStream());
			return file;
		}

		return fsP.readFile(pth).then(function (contents) {
			file.contents = stripBom(contents);
			return file;
		});
	});
};

exports.readSync = function (pth, opts) {
	opts = opts || {};

	var cwd = opts.cwd || process.cwd();
	var base = opts.base || cwd;

	pth = path.resolve(cwd, pth);

	var contents;

	if (opts.read !== false) {
		contents = opts.buffer === false ?
			fs.createReadStream(pth).pipe(stripBomStream()) :
			stripBom(fs.readFileSync(pth));
	}

	return new File({
		cwd: cwd,
		base: base,
		path: pth,
		stat: fs.statSync(pth),
		contents: contents
	});
};
