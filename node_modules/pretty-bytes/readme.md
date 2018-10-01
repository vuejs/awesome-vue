# pretty-bytes [![Build Status](https://travis-ci.org/sindresorhus/pretty-bytes.svg?branch=master)](https://travis-ci.org/sindresorhus/pretty-bytes)

> Convert bytes to a human readable string: `1337` → `1.34 kB`

Useful for displaying file sizes for humans.

*Note that it uses base-10 (e.g. kilobyte).
[Read about the difference between kilobyte and kibibyte.](https://web.archive.org/web/20150324153922/https://pacoup.com/2009/05/26/kb-kb-kib-whats-up-with-that/)*


## Install

```
$ npm install pretty-bytes
```


## Usage

```js
const prettyBytes = require('pretty-bytes');

prettyBytes(1337);
//=> '1.34 kB'

prettyBytes(100);
//=> '100 B'

// Display file size differences
prettyBytes(42, {signed: true});
//=> '+42 B'

// Localized output using German locale
prettyBytes(1337, {locale: 'de'});
//=> '1,34 kB'
```


## API

### prettyBytes(input, [options])

#### input

Type: `number`

The number to format.

#### options

Type: `Object`

##### signed

Type: `boolean`<br>
Default: `false`

Include plus sign for positive numbers. If the difference is exactly zero a space character will be prepended instead for better alignment.


##### locale

Type: `boolean` `string`<br>
Default: `false` *(No localization)*

- If `true`: Localize the output using the system/browser locale.
- If `string`: Expects a [BCP 47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (For example: `en`, `de`, …)

**Note:** Localization should generally work in browsers. Node.js needs to be [built](https://github.com/nodejs/node/wiki/Intl) with `full-icu` or `system-icu`. Alternatively, the [`full-icu`](https://github.com/unicode-org/full-icu-npm) module can be used to provide support at runtime.


## Related

- [pretty-bytes-cli](https://github.com/sindresorhus/pretty-bytes-cli) - CLI for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
