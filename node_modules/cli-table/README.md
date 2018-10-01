CLI Table [![NPM Version](http://badge.fury.io/js/cli-table.svg)](http://badge.fury.io/js/cli-table) [![Build Status](https://secure.travis-ci.org/Automattic/cli-table.svg)](http://travis-ci.org/Automattic/cli-table)
=========

This utility allows you to render unicode-aided tables on the command line from
your node.js scripts.

![Screenshot](http://i.imgur.com/sYq4T.png)

## Features

- Customizable characters that constitute the table.
- Color/background styling in the header through
  [colors.js](http://github.com/marak/colors.js)
- Column width customization
- Text truncation based on predefined widths
- Text alignment (left, right, center)
- Padding (left, right)
- Easy-to-use API

## Installation

```bash    
npm install cli-table
```

## How to use

### Horizontal Tables
```javascript
var Table = require('cli-table');

// instantiate
var table = new Table({
    head: ['TH 1 label', 'TH 2 label']
  , colWidths: [100, 200]
});

// table is an Array, so you can `push`, `unshift`, `splice` and friends
table.push(
    ['First value', 'Second value']
  , ['First value', 'Second value']
);

console.log(table.toString());
```

### Vertical Tables
```javascript
var Table = require('cli-table');
var table = new Table();

table.push(
    { 'Some key': 'Some value' }
  , { 'Another key': 'Another value' }
);

console.log(table.toString());
```
### Cross Tables
Cross tables are very similar to vertical tables, with two key differences:

1. They require a `head` setting when instantiated that has an empty string as the first header
2. The individual rows take the general form of { "Header": ["Row", "Values"] }

```javascript
var Table = require('cli-table');
var table = new Table({ head: ["", "Top Header 1", "Top Header 2"] });

table.push(
    { 'Left Header 1': ['Value Row 1 Col 1', 'Value Row 1 Col 2'] }
  , { 'Left Header 2': ['Value Row 2 Col 1', 'Value Row 2 Col 2'] }
);

console.log(table.toString());
```

### Custom styles
The ```chars``` property controls how the table is drawn:
```javascript
var table = new Table({
  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});

table.push(
    ['foo', 'bar', 'baz']
  , ['frob', 'bar', 'quuz']
);

console.log(table.toString());
// Outputs:
//
//╔══════╤═════╤══════╗
//║ foo  │ bar │ baz  ║
//╟──────┼─────┼──────╢
//║ frob │ bar │ quuz ║
//╚══════╧═════╧══════╝
```

Empty decoration lines will be skipped, to avoid vertical separator rows just
set the 'mid', 'left-mid', 'mid-mid', 'right-mid' to the empty string:
```javascript
var table = new Table({ chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''} });
table.push(
    ['foo', 'bar', 'baz']
  , ['frobnicate', 'bar', 'quuz']
);

console.log(table.toString());
// Outputs: (note the lack of the horizontal line between rows)
//┌────────────┬─────┬──────┐
//│ foo        │ bar │ baz  │
//│ frobnicate │ bar │ quuz │
//└────────────┴─────┴──────┘
```

By setting all chars to empty with the exception of 'middle' being set to a
single space and by setting padding to zero, it's possible to get the most
compact layout with no decorations:
```javascript
var table = new Table({
  chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
         , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
         , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
         , 'right': '' , 'right-mid': '' , 'middle': ' ' },
  style: { 'padding-left': 0, 'padding-right': 0 }
});

table.push(
    ['foo', 'bar', 'baz']
  , ['frobnicate', 'bar', 'quuz']
);

console.log(table.toString());
// Outputs:
//foo        bar baz
//frobnicate bar quuz
```

## Running tests

Clone the repository with all its submodules and run:

```bash
$ make test
```

## Credits

- Guillermo Rauch &lt;guillermo@learnboost.com&gt; ([Guille](http://github.com/guille))

## License 

(The MIT License)

Copyright (c) 2010 LearnBoost &lt;dev@learnboost.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
