# isBinaryFile

Detects if a file is binary in Node.js. Similar to [Perl's `-B` switch](http://stackoverflow.com/questions/899206/how-does-perl-know-a-file-is-binary), in that:
- it reads the first few thousand bytes of a file
- checks for a `null` byte; if it's found, it's binary
- flags non-ASCII characters. After a certain number of "weird" characters, the file is flagged as binary

Much of the logic is pretty much ported from [ag](https://github.com/ggreer/the_silver_searcher).

Note: if the file doesn't exist, is a directory, or is empty, the function returns `false`.

## Installation

```
npm install isbinaryfile
```

## Usage

### isBinaryFile(filepath, callback)

* `filepath`, a `string` indicating the path to the file.
* `callback`, a `function` for the callback. It has two arguments:
  - `err`, the typical Node.js error argument
  - `result`, a `boolean` of `true` or `false`, depending on if the file is binary


### isBinaryFile(bytes, size, callback)

* `bytes`, a `Buffer` of the file's contents.
* `size`, an optional `number` indicating the file size.
* `callback`, a `function` for the callback. It has two arguments:
  - `err`, the typical Node.js error argument
  - `result`, a `boolean` of `true` or `false`, depending on if the file is binary


### isBinaryFile.sync(filepath)

* `filepath`, a `string` indicating the path to the file.


### isBinaryFile.sync(bytes, size)

* `bytes`, a `Buffer` of the file's contents.
* `size`, an `number` indicating the file size.


Returns a `boolean` of `true` or `false`, depending on if the file is binary.

### Examples

```javascript
var isBinaryFile = require("isbinaryfile");

fs.readFile("some_file", function(err, data) {
  fs.lstat("some_file", function(err, stat) {
    isBinaryFile(data, stat.size, function (err, result) {
      if (!err) {
        if (result) {
          console.log("It is!")
        }
        else {
          console.log("No.")
        }
      }
    });
  });
});

isBinaryFile.sync("some_file"); // true or false
var bytes = fs.readFileSync(("some_file"));
var size = fs.lstatSync(("some_file").size;
isBinaryFile.sync(bytes, size); // true or false
```

## Testing

Run `npm install` to install `mocha`, then run `npm test`.
