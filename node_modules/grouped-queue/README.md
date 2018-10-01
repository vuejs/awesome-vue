Grouped Queue [![Build Status](https://travis-ci.org/SBoudrias/grouped-queue.svg?branch=master)](https://travis-ci.org/SBoudrias/grouped-queue)
==============

In memory queue system prioritizing tasks.


Documentation
=============

Installation
-------------

``` bash
$ npm install --save grouped-queue
```

Methods
------------

### Constructor

The constructor takes an optional array of task groups. The first `String` name will be the first queue to be emptied, the second string will be the second group emptied, etc.

By default, the constructor will always add a `default` queue in the last position. You can overwrite the position of the `default` group if you specify it explicitly.

``` javascript
var Queue = require('grouped-queue');

var queue = new Queue([ 'first', 'second', 'third' ]);
```

### Queue#add `add( [group], task, [options] )`

Add a task into a group queue. If no group name is specified, `default` will be used.

Implicitly, each time you add a task, the queue will start emptying (if not already running).

Each task function is passed a callback function. This callback must be called when the task is complete.

``` javascript
queue.add(function( cb ) {
  DB.fetch().then( cb );
});
```

#### Option: `once`

You can register tasks in queues that will be dropped if they're already planned. This is done with the `once` option. You pass a String (basically a name) to the `once` option.

``` javascript
// This one will eventually run
queue.add( method, { once: "readDB" });

// This one will be dropped as `method` is currently in the queue
queue.add( method3, { once: "readDB" });
```

#### Option: `run`

You can register a task without launching the run loop by passing the argument `run: false`.

```javascript
queue.add( method, { run: false });
```

### Pro tip

Bind your tasks with context and arguments!

``` javascript
var task = function( models, cb ) {
  /* you get `models` data here! */
};
queue.add( task.bind(null, models) );
```

### That's all?

Yes!

Events
-------------

### `end`

This event is called **each time** the queue emptied itself.


Contributing
=====================

**Style Guide**: Please base yourself on [Idiomatic.js](https://github.com/rwldrn/idiomatic.js) style guide with two space indent  
**Unit test**: Unit tests are written in Mocha. Please add a unit test for every new feature
or bug fix. `npm test` to run the test suite.  
**Documentation**: Add documentation for every API change. Feel free to send corrections
or better docs!  
**Pull Requests**: Send _fixes_ PR on the `master` branch.


License
=====================

Copyright (c) 2013 Simon Boudrias (twitter: @vaxilart)  
Licensed under the MIT license.
