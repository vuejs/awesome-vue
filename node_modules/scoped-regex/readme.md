# scoped-regex [![Build Status](https://travis-ci.org/sindresorhus/scoped-regex.svg?branch=master)](https://travis-ci.org/sindresorhus/scoped-regex)

> Regular expression for matching [scoped npm package names](https://docs.npmjs.com/misc/scope)


## Install

```
$ npm install --save scoped-regex
```


## Usage

```js
const scopedRegex = require('scoped-regex');

scopedRegex({exact: true}).test('@sindresorhus/df');
//=> true

'foo @sindresorhus/df bar'.match(scopedRegex());
//=> ['@sindresorhus/df']
```


## API

### scopedRegex([options])

Returns a `RegExp` for matching scoped package names.

#### options.exact

Type: `boolean`<br>
Default: `false` *(Matches any scoped package names in a string)*

Only match an exact string. Useful with `RegExp#test()` to check if a string is a scoped package name.


## Related

- [is-scoped](https://github.com/sindresorhus/is-scoped) - Check if a string is a scoped npm package name


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
