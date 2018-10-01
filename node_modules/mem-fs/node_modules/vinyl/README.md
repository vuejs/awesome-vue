# vinyl [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

## Information
<table><tr><td>Package</td><td>vinyl</td></tr><tr><td>Description</td><td>A virtual file format</td></tr><tr><td>Node Version</td><td>>= 0.9</td></tr></table>

## What is this?
Read this for more info about how this plays into the grand scheme of things [https://medium.com/@eschoff/3828e8126466](https://medium.com/@eschoff/3828e8126466)

## File

```javascript
var File = require('vinyl');

var coffeeFile = new File({
  cwd: "/",
  base: "/test/",
  path: "/test/file.coffee",
  contents: new Buffer("test = 123")
});
```

### isVinyl
When checking if an object is a vinyl file, you should not use instanceof. Use the isVinyl function instead.

```js
var File = require('vinyl');

var dummy = new File({stuff});
var notAFile = {};

File.isVinyl(dummy); // true
File.isVinyl(notAFile); // false
```

### isCustomProp
Vinyl checks if a property is not managed internally, such as `sourceMap`. This is than used in `constructor(options)` when setting, and `clone()` when copying properties.

```js
var File = require('vinyl');

File.isCustomProp('sourceMap'); // true
File.isCustomProp('path'); // false -> internal getter/setter
```

Read more in [Extending Vinyl](#extending-vinyl).

### constructor(options)
#### options.cwd
Type: `String`<br><br>Default: `process.cwd()`

#### options.base
Used for relative pathing. Typically where a glob starts.

Type: `String`<br><br>Default: `options.cwd`

#### options.path
Full path to the file.

Type: `String`<br><br>Default: `undefined`

#### options.history
Path history. Has no effect if `options.path` is passed.

Type: `Array`<br><br>Default: `options.path ? [options.path] : []`

#### options.stat
The result of an fs.stat call. See [fs.Stats](http://nodejs.org/api/fs.html#fs_class_fs_stats) for more information.

Type: `fs.Stats`<br><br>Default: `null`

#### options.contents
File contents.

Type: `Buffer, Stream, or null`<br><br>Default: `null`

#### options.{custom}
Any other option properties will just be assigned to the new File object.

```js
var File = require('vinyl');

var file = new File({foo: 'bar'});
file.foo === 'bar'; // true
```

### isBuffer()
Returns true if file.contents is a Buffer.

### isStream()
Returns true if file.contents is a Stream.

### isNull()
Returns true if file.contents is null.

### clone([opt])
Returns a new File object with all attributes cloned.<br>By default custom attributes are deep-cloned.

If opt or opt.deep is false, custom attributes will not be deep-cloned.

If opt.contents is false, it will copy file.contents Buffer's reference.

### pipe(stream[, opt])
If file.contents is a Buffer, it will write it to the stream.

If file.contents is a Stream, it will pipe it to the stream.

If file.contents is null, it will do nothing.

If opt.end is false, the destination stream will not be ended (same as node core).

Returns the stream.

### inspect()
Returns a pretty String interpretation of the File. Useful for console.log.

### contents
The [Stream](https://nodejs.org/api/stream.html#stream_stream) or [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) of the file as it was passed in via options, or as the result of modification.

For example:

```js
if (file.isBuffer()) {
    console.log(file.contents.toString()); // logs out the string of contents
}
```

### path
Absolute pathname string or `undefined`. Setting to a different value pushes the old value to `history`.

### history
Array of `path` values the file object has had, from `history[0]` (original) through `history[history.length - 1]` (current). `history` and its elements should normally be treated as read-only and only altered indirectly by setting `path`.

### relative
Returns path.relative for the file base and file path.

Example:

```javascript
var file = new File({
  cwd: "/",
  base: "/test/",
  path: "/test/file.coffee"
});

console.log(file.relative); // file.coffee
```

### dirname
Gets and sets path.dirname for the file path.

Example:

```javascript
var file = new File({
  cwd: "/",
  base: "/test/",
  path: "/test/file.coffee"
});

console.log(file.dirname); // /test

file.dirname = '/specs';

console.log(file.dirname); // /specs
console.log(file.path); // /specs/file.coffee
```

### basename
Gets and sets path.basename for the file path.

Example:

```javascript
var file = new File({
  cwd: "/",
  base: "/test/",
  path: "/test/file.coffee"
});

console.log(file.basename); // file.coffee

file.basename = 'file.js';

console.log(file.basename); // file.js
console.log(file.path); // /test/file.js
```

### stem
Gets and sets stem (filename without suffix) for the file path.

Example:

```javascript
var file = new File({
  cwd: "/",
  base: "/test/",
  path: "/test/file.coffee"
});

console.log(file.stem); // file

file.stem = 'foo';

console.log(file.stem); // foo
console.log(file.path); // /test/foo.coffee
```

### extname
Gets and sets path.extname for the file path.

Example:

```javascript
var file = new File({
  cwd: "/",
  base: "/test/",
  path: "/test/file.coffee"
});

console.log(file.extname); // .coffee

file.extname = '.js';

console.log(file.extname); // .js
console.log(file.path); // /test/file.js
```

## Extending Vinyl
When extending Vinyl into your own class with extra features, you need to think about a few things.

When you have your own properties that are managed internally, you need to extend the static `isCustomProp` method to return `false` when one of these properties is queried.

```js
const File = require('vinyl');

const builtInProps = ['foo', '_foo'];

class SuperFile extends File {
  constructor(options) {
    super(options);
    this._foo = 'example internal read-only value';
  }

  get foo() {
    return this._foo;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && builtInProps.indexOf(name) === -1;
  }
}
```

This makes properties `foo` and `_foo` ignored when cloning, and when passed in options to `constructor(options)` so they don't get assigned to the new object.

Same goes for `clone()`. If you have your own internal stuff that needs special handling during cloning, you should extend it to do so.

[npm-url]: https://npmjs.org/package/vinyl
[npm-image]: https://badge.fury.io/js/vinyl.svg
[travis-url]: https://travis-ci.org/gulpjs/vinyl
[travis-image]: https://travis-ci.org/gulpjs/vinyl.svg?branch=master
[coveralls-url]: https://coveralls.io/github/gulpjs/vinyl
[coveralls-image]: https://coveralls.io/repos/github/gulpjs/vinyl/badge.svg
[depstat-url]: https://david-dm.org/gulpjs/vinyl
[depstat-image]: https://david-dm.org/gulpjs/vinyl.svg
