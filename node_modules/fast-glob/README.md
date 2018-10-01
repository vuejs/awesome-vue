# :rocket: fast-glob

> Is a faster [`node-glob`](https://github.com/isaacs/node-glob) alternative.

[![Build Status](https://travis-ci.org/mrmlnc/fast-glob.svg?branch=master)](https://travis-ci.org/mrmlnc/fast-glob)
[![Build status](https://ci.appveyor.com/api/projects/status/i4xqijtq26qf6o9d?svg=true)](https://ci.appveyor.com/project/mrmlnc/fast-glob)

## :bulb: Highlights

  * :rocket: Fast by using Streams and Promises. Used [readdir-enhanced](https://github.com/BigstickCarpet/readdir-enhanced) and [micromatch](https://github.com/jonschlinkert/micromatch).
  * :beginner: User-friendly, since it supports multiple and negated patterns (`['*', '!*.md']`).
  * :vertical_traffic_light: Rational, because it doesn't read excluded directories (`!**/node_modules/**`).
  * :gear: Universal, because it supports Synchronous, Promise and Stream API.
  * :money_with_wings: Economy, because it provides `fs.Stats` for matched path if you wanted.

## Donate

If you want to thank me, or promote your Issue.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/mrmlnc)

> Sorry, but I have work and support for packages requires some time after work. I will be glad of your support and PR's.

## Install

```
$ npm install --save fast-glob
```

## Usage

#### Asynchronous

```js
const fg = require('fast-glob');

fg(['src/**/*.js', '!src/**/*.spec.js']).then((entries) => console.log(entries));
fg.async(['src/**/*.js', '!src/**/*.spec.js']).then((entries) => console.log(entries));
```

#### Synchronous

```js
const fg = require('fast-glob');

const entries = fg.sync(['src/**/*.js', '!src/**/*.spec.js']);
console.log(entries);
```

#### Stream

```js
const fg = require('fast-glob');

const stream = fg.stream(['src/**/*.js', '!src/**/*.spec.js']);

const entries = [];

stream.on('data', (entry) => entries.push(entry));
stream.once('error', console.log);
stream.once('end', () => console.log(entries));
```

## API

### fg(patterns, [options])
### fg.async(patterns, [options])

Returns a `Promise<Array>` of matching entries.

#### patterns

  * Type: `string|string[]`

This package does not respect the order of patterns. First, all the negative patterns are applied, and only then the positive patterns.

#### options

  * Type: `Object`

See [options](#options-1) section for more detailed information.

### fg.sync(patterns, [options])

Returns a `Array` of matching entries.

### fg.stream(patterns, [options])

Returns a [`ReadableStream`](https://nodejs.org/api/stream.html#stream_readable_streams).

### fg.generateTasks(patterns, [options])

Return a set of tasks based on provided patterns. All tasks satisfy the `Task` interface:

```ts
interface Task {
  /**
   * Parent directory for all patterns inside this task.
   */
  base: string;
  /**
   * Dynamic or static patterns are in this task.
   */
  dynamic: boolean;
  /**
   * All patterns.
   */
  patterns: string[];
  /**
   * Only positive patterns.
   */
  positive: string[];
  /**
   * Only negative patterns without ! symbol.
   */
  negative: string[];
}
```

## Options

#### cwd

  * Type: `string`
  * Default: `process.cwd()`

The current working directory in which to search.

#### deep

  * Type: `number|boolean`
  * Default: `true`

The deep option can be set to `true` to traverse the entire directory structure, or it can be set to a *number* to only traverse that many levels deep.

#### ignore

  * Type: `string[]`
  * Default: `[]`

An array of glob patterns to exclude matches.

#### dot

  * Type: `boolean`
  * Default: `false`

Allow patterns to match filenames starting with a period (files & directories), even if the pattern does not explicitly have a period in that spot.

#### stats

  * Type: `number|boolean`
  * Default: `false`

Return `fs.Stats` with `path` property instead of file path.

#### onlyFiles

  * Type: `boolean`
  * Default: `true`

Return only files.

#### onlyDirectories

  * Type: `boolean`
  * Default: `false`

Return only directories.

#### followSymlinkedDirectories

  * Type: `boolean`
  * Default: `true`

Follow symlinked directories when expanding `**` patterns.

#### unique

  * Type: `boolean`
  * Default: `true`

Prevent duplicate results.

#### markDirectories

  * Type: `boolean`
  * Default: `false`

Add a `/` character to directory entries.

#### absolute

  * Type: `boolean`
  * Default: `false`

Return absolute paths for matched entries.

#### nobrace

  * Type: `boolean`
  * Default: `false`

Disable expansion of brace patterns (`{a,b}`, `{1..3}`).

#### brace

  * Type: `boolean`
  * Default: `true`

The [`nobrace`](#nobrace) option without double-negation. This option has a higher priority then `nobrace`.

#### noglobstar

  * Type: `boolean`
  * Default: `false`

Disable matching with globstars (`**`).

#### globstar

  * Type: `boolean`
  * Default: `true`

The [`noglobstar`](#noglobstar) option without double-negation. This option has a higher priority then `noglobstar`.

#### noext

  * Type: `boolean`
  * Default: `false`

Disable extglob support (patterns like `+(a|b)`), so that extglobs are regarded as literal characters.

#### extension

  * Type: `boolean`
  * Default: `true`

The [`noext`](#noext) option without double-negation. This option has a higher priority then `noext`.

#### nocase

  * Type: `boolean`
  * Default: `false`

Disable a case-insensitive regex for matching files.

#### case

  * Type: `boolean`
  * Default: `true`

The [`nocase`](#nocase) option without double-negation. This option has a higher priority then `nocase`.

#### matchBase

  * Type: `boolean`
  * Default: `false`

Allow glob patterns without slashes to match a file path based on its basename. For example, `a?b` would match the path `/xyz/123/acb`, but not `/xyz/acb/123`.

#### transform

  * Type: `Function`
  * Default: `null`

Allows you to transform a path or `fs.Stats` object before sending to the array.

```js
const fg = require('fast-glob');

const entries1 = fg.sync(['**/*.scss']);
const entries2 = fg.sync(['**/*.scss'], { transform: (entry) => '_' + entry });

console.log(entries1); // ['a.scss', 'b.scss']
console.log(entries2); // ['_a.scss', '_b.scss']
```

If you are using **TypeScript**, you probably want to specify your own type of the returned array.

```ts
import * as fg from 'fast-glob';

interface IMyOwnEntry {
	path: string;
}

const entries: IMyOwnEntry[] = fg.sync<IMyOwnEntry>(['*.md'], {
	transform: (entry) => typeof entry === 'string' ? { path: entry } : { path: entry.path }
	// Will throw compilation error for non-IMyOwnEntry types (boolean, for example)
});
```

## How to exclude directory from reading?

You can use a negative pattern like this: `!**/node_modules` or `!**/node_modules/**`. Also you can use `ignore` option. Just look at the example below.

```
first/
├── file.md
└── second
    └── file.txt
```

If you don't want to read the `second` directory, you must write the following pattern: `!**/second` or `!**/second/**`.

```js
fg.sync(['**/*.md', '!**/second']); // ['first/file.txt']
fg.sync(['**/*.md'], { ignore: '**/second/**' }); // ['first/file.txt']
```

> :warning: When you write `!**/second/**/*` it means that the directory will be **read**, but all the entries will not be included in the results.

You have to understand that if you write the pattern to exclude directories, then the directory will not be read under any circumstances.

## Compatible with `node-glob`?

Not fully, because `fast-glob` does not implement all options of `node-glob`. See table below.

| node-glob    | fast-glob |
| :----------: | :-------: |
| `cwd`        | [`cwd`](#cwd) |
| `root`       | – |
| `dot`        | [`dot`](#dot) |
| `nomount`    | – |
| `mark`       | [`markDirectories`](#markdirectories) |
| `nosort`     | – |
| `nounique`   | [`unique`](#unique) |
| `nobrace`    | [`nobrace`](#nobrace) or [`brace`](#brace) |
| `noglobstar` | [`noglobstar`](#noglobstar) or [`globstar`](#globstar) |
| `noext`      | [`noext`](#noext) or [`extension`](#extension) |
| `nocase`     | [`nocase`](#nocase) or [`case`](#case) |
| `matchBase`  | [`matchbase`](#matchbase) |
| `nodir`      | [`onlyFiles`](#onlyfiles) |
| `ignore`     | [`ignore`](#ignore) |
| `follow`     | [`followSymlinkedDirectories`](#followsymlinkeddirectories) |
| `realpath`   | – |
| `absolute`   | [`absolute`](#absolute) |

## Benchmarks

**Tech specs:**

Server: [Vultr Bare Metal](https://www.vultr.com/pricing/baremetal)

  * Processor: E3-1270v6 (8 CPU)
  * RAM: 32GB
  * Disk: SSD

You can see results [here](https://gist.github.com/mrmlnc/f06246b197f53c356895fa35355a367c) for latest release.

## Related

  * [readdir-enhanced](https://github.com/BigstickCarpet/readdir-enhanced) – Fast functional replacement for `fs.readdir()`.
  * [globby](https://github.com/sindresorhus/globby) – User-friendly glob matching.
  * [node-glob](https://github.com/isaacs/node-glob) – «Standard» glob functionality for Node.js
  * [bash-glob](https://github.com/micromatch/bash-glob) – Bash-powered globbing for node.js.
  * [glob-stream](https://github.com/gulpjs/glob-stream) – A Readable Stream interface over node-glob that used in the [gulpjs](https://github.com/gulpjs/gulp).

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/fast-glob/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
