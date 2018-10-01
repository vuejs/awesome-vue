'use strict';
var util = require('util');
var events = require('events');
var _ = require('lodash');
var SubQueue = require('./subqueue');

module.exports = Queue;

/**
 * Queue constructor
 * @param {String[]} [subQueue] The order of the sub-queues. First one will be runned first.
 */

function Queue( subQueues ) {
  subQueues = subQueues || [];
  subQueues.push('default');
  subQueues = _.uniq(subQueues);

  this.queueNames = subQueues;
  this.__queues__ = {};

  subQueues.forEach(function( name ) {
    this.__queues__[name] = new SubQueue();
  }.bind(this));
}

util.inherits( Queue, events.EventEmitter );

/**
 * Add a task to a queue.
 * @param {String}   [name='default']  The sub-queue to append the task
 * @param {Function} task
 * @param {Object}   [opt]             Options hash
 * @param {String}   [opt.once]        If a task with the same `once` value is inside the
 *                                     queue, don't add this task.
 * @param {Boolean}  [opt.run]         If `run` is false, don't run the task.
 */

Queue.prototype.add = function( name, task, opt ) {
  if ( typeof name !== 'string' ) {
    opt = task;
    task = name;
    name = 'default';
  }

  this.__queues__[name].push( task, opt );

  // don't run the tasks if `opt.run` is false
  if (opt && opt.run === false) return;
  setImmediate(this.run.bind(this));
};

/**
 * Start emptying the queues
 * Tasks are always run from the higher priority queue down to the lowest. After each
 * task complete, the process is re-runned from the first queue until a task is found.
 *
 * Tasks are passed a `callback` method which should be called once the task is over.
 */

Queue.prototype.run = function() {
  if ( this.running ) return;

  this.running = true;
  this._exec(function() {
    this.running = false;
    if (_(this.__queues__).map('__queue__').flatten().value().length === 0) {
      this.emit('end');
    }
  }.bind(this));
};

Queue.prototype._exec = function( done ) {
  var pointer = -1;
  var names = Object.keys( this.__queues__ );

  var next = function next() {
    pointer++;
    if ( pointer >= names.length ) return done();
    this.__queues__[ names[pointer] ].run( next.bind(this), this._exec.bind(this, done) );
  }.bind(this);

  next();
};
