# string-template

[![build status][1]][2] [![dependency status][3]][4] [![coverage report][9]][10] [![stability index][15]][16]

[![npm stats][13]][14]

[![browser support][5]][6]

  A simple string template function based on named or indexed arguments

## Example

```js
var format = require("string-template")
var greeting

// Format using an object hash with keys matching [0-9a-zA-Z]+

greeting = format("Hello {name}, you have {count} unread messages", {
    name: "Robert",
    count: 12
})
// greeting -> "Hello Robert, you have 12 unread messages"


// Format using a number indexed array

greeting = format("Hello {0}, you have {1} unread messages", ["Robert", 12])
// greeting -> "Hello Robert, you have 12 unread messages"


// Format using optional arguments

greeting = format("Hello {0}, you have {1} unread messages",
     "Robert",
     12)
// greeting -> "Hello Robert, you have 12 unread messages"


// Escape {} pairs by using double {{}}

var text = format("{{0}}")
// text -> "{0}"

```

## Compiling templates

`string-template` exposes two template compiling options for when you need the
additional performance. Arguments passed to the compiled template are of the
same structure as the main `string-template` function, so either a single
object/array or a list of arguments.

```js
var compile = require("string-template/compile")

var greetingTemplate = compile("Hello {0}, you have {1} unread messages")

var greeting = greetingTemplate("Robert", 12)
// -> "Hello Robert, you have 12 unread messages"
```

Passing a truthy second argument to `compile` will opt into using `new Function`
to generate a function. The function returned contains a literal string
concatenation statement, interleaving the correct arguments you have passed in.

```js
var compile = require("string-template/compile")

var greetingTemplate = compile("Hello {0}, you have {1} unread messages", true)
// -> greetingTemplate generated using new Function

var greeting = greetingTemplate(["Robert", 12])
// -> "Hello Robert, you have 12 unread messages"
```

## Installation

`npm install string-template`

## Contributors

 - Matt-Esch

## MIT Licenced

  [1]: https://secure.travis-ci.org/Matt-Esch/string-template.png
  [2]: https://travis-ci.org/Matt-Esch/string-template
  [3]: https://david-dm.org/Matt-Esch/string-template.png
  [4]: https://david-dm.org/Matt-Esch/string-template
  [5]: https://ci.testling.com/Matt-Esch/string-template.png
  [6]: https://ci.testling.com/Matt-Esch/string-template
  [9]: https://coveralls.io/repos/Matt-Esch/string-template/badge.png
  [10]: https://coveralls.io/r/Matt-Esch/string-template
  [13]: https://nodei.co/npm/string-template.png?downloads=true&stars=true
  [14]: https://nodei.co/npm/string-template
  [15]: http://hughsk.github.io/stability-badges/dist/unstable.svg
  [16]: http://github.com/hughsk/stability-badges

  [7]: https://badge.fury.io/js/string-template.png
  [8]: https://badge.fury.io/js/string-template
  [11]: https://gemnasium.com/Matt-Esch/string-template.png
  [12]: https://gemnasium.com/Matt-Esch/string-template
