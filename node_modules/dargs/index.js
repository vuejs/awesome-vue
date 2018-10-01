'use strict';

const match = (array, value) => array.some(x => x instanceof RegExp ? x.test(value) : x === value);

module.exports = (input, opts) => {
	const args = [];
	let extraArgs = [];
	let separatedArgs = [];

	opts = Object.assign({
		useEquals: true
	}, opts);

	const makeArg = (key, val) => {
		key = '--' + (opts.allowCamelCase ? key : key.replace(/[A-Z]/g, '-$&').toLowerCase());

		if (opts.useEquals) {
			args.push(key + (val ? `=${val}` : ''));
		} else {
			args.push(key);

			if (val) {
				args.push(val);
			}
		}
	};

	const makeAliasArg = (key, val) => {
		args.push(`-${key}`);

		if (val) {
			args.push(val);
		}
	};

	// TODO: Use Object.entries() when targeting Node.js 8
	for (let key of Object.keys(input)) {
		const val = input[key];
		let pushArg = makeArg;

		if (Array.isArray(opts.excludes) && match(opts.excludes, key)) {
			continue;
		}

		if (Array.isArray(opts.includes) && !match(opts.includes, key)) {
			continue;
		}

		if (typeof opts.aliases === 'object' && opts.aliases[key]) {
			key = opts.aliases[key];
			pushArg = makeAliasArg;
		}

		if (key === '--') {
			if (!Array.isArray(val)) {
				throw new TypeError(`Expected key \`--\` to be Array, got ${typeof val}`);
			}

			separatedArgs = val;
			continue;
		}

		if (key === '_') {
			if (!Array.isArray(val)) {
				throw new TypeError(`Expected key \`_\` to be Array, got ${typeof val}`);
			}

			extraArgs = val;
			continue;
		}

		if (val === true) {
			pushArg(key, '');
		}

		if (val === false && !opts.ignoreFalse) {
			pushArg(`no-${key}`);
		}

		if (typeof val === 'string') {
			pushArg(key, val);
		}

		if (typeof val === 'number' && !Number.isNaN(val)) {
			pushArg(key, String(val));
		}

		if (Array.isArray(val)) {
			for (const arrayValue of val) {
				pushArg(key, arrayValue);
			}
		}
	}

	for (const x of extraArgs) {
		args.push(String(x));
	}

	if (separatedArgs.length > 0) {
		args.push('--');
	}

	for (const x of separatedArgs) {
		args.push(String(x));
	}

	return args;
};
