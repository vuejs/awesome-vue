# read-chunk [![Build Status](https://travis-ci.org/sindresorhus/read-chunk.svg?branch=master)](https://travis-ci.org/sindresorhus/read-chunk)

> Read a chunk from a file

Because the built-in way requires way too much boilerplate.


## Install

```
$ npm install read-chunk
```


## Usage

```js
const readChunk = require('read-chunk');

// foo.txt => hello

readChunk.sync('foo.txt', 1, 3);
//=> 'ell'
```


## API

### readChunk(filepath, position, length)

Returns a `Promise<Buffer>`.

### readChunk.sync(filepath, position, length)

Returns a `Buffer`.

#### filepath

Type: `string`

#### position

Type: `number`

Position to start reading.

#### length

Type: `number`

Number of bytes to read.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
