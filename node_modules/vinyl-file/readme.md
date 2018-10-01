# vinyl-file [![Build Status](https://travis-ci.org/sindresorhus/vinyl-file.svg?branch=master)](https://travis-ci.org/sindresorhus/vinyl-file)

> Create a [vinyl file](https://github.com/wearefractal/vinyl) from an actual file


## Install

```
$ npm install --save vinyl-file
```


## Usage

```js
const vinylFile = require('vinyl-file');

vinylFile.read('index.js').then(file => {
    console.log(file.path);
    //=> '/Users/sindresorhus/dev/vinyl-file/index.js'

    console.log(file.cwd);
    //=> '/Users/sindresorhus/dev/vinyl-file'
});

const file = vinylFile.readSync('index.js');

console.log(file.path);
//=> '/Users/sindresorhus/dev/vinyl-file/index.js'

console.log(file.cwd);
//=> '/Users/sindresorhus/dev/vinyl-file'
```


## API

### read(path, [options])

Returns a promise for a vinyl file.

### readSync(path, [options])

Create a vinyl file synchronously and return it.

#### options

##### base

Type: `string`  
Default: `process.cwd()`

Override the `base` of the vinyl file.

##### cwd

Type: `string`  
Default: `process.cwd()`

Override the `cwd` (current working directory) of the vinyl file.

##### buffer

Type: `boolean`  
Default: `true`

Setting this to `false` will return `file.contents` as a stream. This is useful when working with large files. **Note:** Plugins might not implement support for streams.

##### read

Type: `boolean`  
Default: `true`

Setting this to `false` will return `file.contents` as null and not read the file at all.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
