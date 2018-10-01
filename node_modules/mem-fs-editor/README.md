# mem-fs-editor [![Build Status](https://api.travis-ci.org/SBoudrias/mem-fs-editor.svg?branch=master)](https://travis-ci.org/SBoudrias/mem-fs-editor) [![NPM version](https://badge.fury.io/js/mem-fs-editor.svg)](http://badge.fury.io/js/mem-fs-editor) [![Coverage Status](https://coveralls.io/repos/github/SBoudrias/mem-fs-editor/badge.svg)](https://coveralls.io/github/SBoudrias/mem-fs-editor)

File edition helpers working on top of [mem-fs](https://github.com/SBoudrias/mem-fs)

## Usage

```js
var memFs = require("mem-fs");
var editor = require("mem-fs-editor");

var store = memFs.create();
var fs = editor.create(store);

fs.write("somefile.js", "var a = 1;");
```

### `#read(filepath, [options])`

Read a file and return its contents as a string.

You can alternatively get the raw contents buffer if you pass `options.raw = true`.

By default, calling `read()` on a file path that does not exist throws error. You can, however, pass `options.defaults = 'your default content'` to get a default content you pass in, if you prefer to not deal with try/catch.

### `#readJSON(filepath, [defaults])`

Read a file and parse its contents as JSON.

`readJSON()` internally calls `read()` but will not throw an error if the file path you pass in does not exist. If you pass in an optional `defaults`, the `defaults` content will be returned in case of the target file is missing, instead of `undefined`. (Error would still be thrown if `JSON.parse` failed to parse your target file.)

### `#write(filepath, contents)`

Replace the content of a file (existing or new) with a string or a buffer.

### `#writeJSON(filepath, contents[, replacer [, space]])`

Replace the content of a file (existing or new) with an object that is to be converted by calling `JSON.stringify()`.

`contents` should usually be a JSON object, but it can technically be anything that is acceptable by [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

Optionally pass `replacer` and `space` as the last two arguments, as defined by [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). `spacer` is used to format the output string (prettify).

Default value for `space` is `2`, when not specified.

### `#append(filepath, contents, [options])`

Append the new contents to the current file contents.

- `options.trimEnd` (default `true`). Trim trailing whitespace of the current file contents.
- `options.separator` (default `os.EOL`). Separator to insert between current and new contents.

### `#extendJSON(filepath, contents[, replacer [, space]])`

Extend the content of an existing JSON file with the partial objects provided as argument.

Optionally take the same JSON formatting arguments than `#writeJSON()`.

### `#delete(filepath, [options])`

Delete a file or a directory.

`filePath` can also be a `glob`. If `filePath` is glob, you can optionally pass in an `options.globOptions` object to change its pattern matching behavior. The full list of options are being described [here](https://github.com/mrmlnc/fast-glob#options-1). The `sync` flag is forced to be `true` in `globOptions`.

### `#copy(from, to, [options], context[, templateOptions ])`

Copy a file from the `from` path to the `to` path.

Optionally, pass an `options.process` function (`process(contents)`) returning a string or a buffer who'll become the new file content. The process function will take a single contents argument who is the copied file contents as a `Buffer`.

`option.ignoreNoMatch` can be used to silence the error thrown if no files match the `from` pattern.

`from` can be a glob pattern that'll be match against the file system. If that's the case, then `to` must be an output directory. For a globified `from`, you can optionally pass in an `options.globOptions` object to change its pattern matching behavior. The full list of options are being described [here](https://github.com/mrmlnc/fast-glob#options-1). The `nodir` flag is forced to be `true` in `globOptions` to ensure a vinyl object representing each matching directory is marked as `deleted` in the `mem-fs` store.

### `#copyTpl(from, to, context[, templateOptions [, copyOptions]])`

Copy the `from` file and, if it is not a binary file, parse its content as an [ejs](http://ejs.co/) template where `context` is the template context (the variable names available inside the template).

You can optionally pass a `templateOptions` object. `mem-fs-editor` automatically setup the filename option so you can easily use partials.

You can also optionally pass a `copyOptions` object (see [copy() documentation for more details](https://github.com/SBoudrias/mem-fs-editor#copyfrom-to-options)).

Templates syntax looks like this:

```
<%= value %>
<%- include('partial.ejs', { name: 'Simon' }) %>
```

Dir syntax looks like this:

```
/some/path/dir<%= value %>/...
```

Refer to the [ejs documentation](http://ejs.co/) for more details.

### `#move(from, to, [options])`

Move/rename a file from the `from` path to the `to` path.

`#move` internally uses `#copy` and `#delete`, so `from` can be a glob pattern, and you can provide `options.globOptions` with it.

### `#exists(filepath)`

Returns `true` if a file exists. Returns `false` if the file is not found or deleted.

### `#commit([filters,] callback)`

Persist every changes made to files in the mem-fs store to disk.

If provided, `filters` is an array of TransformStream to be applied on a stream of vinyl files (like gulp plugins).

`callback` is called once the files are updated on disk.
