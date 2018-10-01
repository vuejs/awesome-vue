# dargs [![Build Status](https://travis-ci.org/sindresorhus/dargs.svg?branch=master)](https://travis-ci.org/sindresorhus/dargs)

> Reverse [`minimist`](https://github.com/substack/minimist). Convert an object of options into an array of command-line arguments.

Useful when spawning command-line tools.


## Install

```
$ npm install dargs
```


## Usage

```js
const dargs = require('dargs');

const input = {
	_: ['some', 'option'],          // Values in '_' will be appended to the end of the generated argument list
	foo: 'bar',
	hello: true,                    // Results in only the key being used
	cake: false,                    // Prepends `no-` before the key
	camelCase: 5,                   // CamelCase is slugged to `camel-case`
	multiple: ['value', 'value2'],  // Converted to multiple arguments
	pieKind: 'cherry',
	sad: ':('
};

const excludes = ['sad', /.*Kind$/];  // Excludes and includes accept regular expressions
const includes = ['camelCase', 'multiple', 'sad', /^pie.*/];
const aliases = {file: 'f'};

console.log(dargs(input, {excludes}));
/*
[
	'--foo=bar',
	'--hello',
	'--no-cake',
	'--camel-case=5',
	'--multiple=value',
	'--multiple=value2',
	'some',
	'option'
]
*/

console.log(dargs(input, {excludes, includes}));
/*
[
	'--camel-case=5',
	'--multiple=value',
	'--multiple=value2'
]
*/


console.log(dargs(input, {includes}));
/*
[
	'--camel-case=5',
	'--multiple=value',
	'--multiple=value2',
	'--pie-kind=cherry',
	'--sad=:('
]
*/


console.log(dargs({
	foo: 'bar',
	hello: true,
	file: 'baz'
}, {aliases}));
/*
[
	'--foo=bar',
	'--hello',
	'-f', 'baz'
]
*/
```


## API

### dargs(input, [options])

#### input

Type: `Object`

Object to convert to command-line arguments.

#### options

Type: `Object`

##### excludes

Type: `Array`

Keys or regex of keys to exclude. Takes precedence over `includes`.

##### includes

Type: `Array`

Keys or regex of keys to include.

##### aliases

Type: `Object`

Maps keys in `input` to an aliased name. Matching keys are converted to arguments with a single dash (`-`) in front of the aliased key and the value in a separate array item. Keys are still affected by `includes` and `excludes`.

##### useEquals

Type: `boolean`<br>
Default: `true`

Setting this to `false` makes it return the key and value as separate array items instead of using a `=` separator in one item. This can be useful for tools that doesn't support `--foo=bar` style flags.

###### Example

```js
console.log(dargs({foo: 'bar'}, {useEquals: false}));
/*
[
	'--foo', 'bar'
]
*/
```

##### ignoreFalse

Type: `boolean`<br>
Default: `false`

Exclude `false` values. Can be useful when dealing with strict argument parsers that throw on unknown arguments like `--no-foo`.

##### allowCamelCase

Type: `boolean`<br>
Default: `false`

By default, camelCased keys will be hyphenated. Enabling this will bypass the conversion process.

###### Example

```js
console.log(dargs({fooBar: 'baz'}));
//=> ['--foo-bar', 'baz']

console.log(dargs({fooBar: 'baz'}, {allowCamelCase: true}));
//=> ['--fooBar', 'baz']
```


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
