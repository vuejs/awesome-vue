/** @module env/log */
'use strict';
const util = require('util');
const EventEmitter = require('events');
const _ = require('lodash');
const table = require('text-table');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

// Padding step
const step = '  ';
let padding = ' ';

function pad(status) {
  const max = 'identical'.length;
  const delta = max - status.length;
  return delta ? ' '.repeat(delta) + status : status;
}

// Borrowed from https://github.com/mikeal/logref/blob/master/main.js#L6-15
function formatter(msg, ctx) {
  while (msg.indexOf('%') !== -1) {
    const start = msg.indexOf('%');
    let end = msg.indexOf(' ', start);

    if (end === -1) {
      end = msg.length;
    }

    msg = msg.slice(0, start) + ctx[msg.slice(start + 1, end)] + msg.slice(end);
  }

  return msg;
}

const getDefaultColors = () => ({
  skip: 'yellow',
  force: 'yellow',
  create: 'green',
  invoke: 'bold',
  conflict: 'red',
  identical: 'cyan',
  info: 'gray'
});

const initParams = params => {
  params = params || {};
  return Object.assign(
    {}, params, {
      colors: Object.assign(getDefaultColors(), params.colors || {})});
};

module.exports = params => {
  // `this.log` is a [logref](https://github.com/mikeal/logref)
  // compatible logger, with an enhanced API.
  //
  // It also has EventEmitter like capabilities, so you can call on / emit
  // on it, namely used to increase or decrease the padding.
  //
  // All logs are done against STDERR, letting you stdout for meaningfull
  // value and redirection, should you need to generate output this way.
  //
  // Log functions take two arguments, a message and a context. For any
  // other kind of paramters, `console.error` is used, so all of the
  // console format string goodies you're used to work fine.
  //
  // - msg      - The message to show up
  // - context  - The optional context to escape the message against
  //
  // @param {Object} params
  // @param {Object} params.colors status mappings
  //
  // Returns the logger
  function log(msg, ctx) {
    msg = msg || '';

    if (typeof ctx === 'object' && !Array.isArray(ctx)) {
      console.error(formatter(msg, ctx));
    } else {
      console.error.apply(console, arguments);
    }

    return log;
  }

  _.extend(log, EventEmitter.prototype);

  params = initParams(params);

  // A simple write method, with formatted message.
  //
  // Returns the logger
  log.write = function () {
    process.stderr.write(util.format.apply(util, arguments));
    return this;
  };

  // Same as `log.write()` but automatically appends a `\n` at the end
  // of the message.
  log.writeln = function () {
    this.write.apply(this, arguments);
    this.write('\n');
    return this;
  };

  // Convenience helper to write sucess status, this simply prepends the
  // message with a gren `✔`.
  log.ok = function () {
    this.write(logSymbols.success + ' ' + util.format.apply(util, arguments) + '\n');
    return this;
  };

  log.error = function () {
    this.write(logSymbols.error + ' ' + util.format.apply(util, arguments) + '\n');
    return this;
  };

  log.on('up', () => {
    padding += step;
  });

  log.on('down', () => {
    padding = padding.replace(step, '');
  });

  /* eslint-disable no-loop-func */
  // TODO: Fix this ESLint warning
  for (const status of Object.keys(params.colors)) {
    // Each predefined status has its logging method utility, handling
    // status color and padding before the usual `.write()`
    //
    // Example
    //
    //    this.log
    //      .write()
    //      .info('Doing something')
    //      .force('Forcing filepath %s, 'some path')
    //      .conflict('on %s' 'model.js')
    //      .write()
    //      .ok('This is ok');
    //
    // The list of default status and mapping colors
    //
    //    skip       yellow
    //    force      yellow
    //    create     green
    //    invoke     bold
    //    conflict   red
    //    identical  cyan
    //    info       grey
    //
    // Returns the logger
    log[status] = function () {
      const color = params.colors[status];
      this.write(chalk[color](pad(status))).write(padding);
      this.write(util.format.apply(util, arguments) + '\n');
      return this;
    };
  }
  /* eslint-enable no-loop-func */

  // A basic wrapper around `cli-table` package, resetting any single
  // char to empty strings, this is used for aligning options and
  // arguments without too much Math on our side.
  //
  // - opts - A list of rows or an Hash of options to pass through cli
  //          table.
  //
  // Returns the table reprensetation
  log.table = opts => {
    const tableData = [];

    opts = Array.isArray(opts) ? {rows: opts} : opts;
    opts.rows = opts.rows || [];

    for (const row of opts.rows) {
      tableData.push(row);
    }

    return table(tableData);
  };

  return log;
};
