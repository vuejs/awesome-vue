# is-scoped [![Build Status](https://travis-ci.org/sindresorhus/is-scoped.svg?branch=master)](https://travis-ci.org/sindresorhus/is-scoped)

> Check if a string is a [scoped npm package name](https://docs.npmjs.com/misc/scope)


## Install

```
$ npm install --save is-scoped
```


## Usage

```js
const isScoped = require('is-scoped');

isScoped('@sindresorhus/df');
//=> true

isScoped('cat-names');
//=> false
```


## Related

- [scoped-regex](https://github.com/sindresorhus/scoped-regex) - Regular expression for matching scoped npm package names


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
