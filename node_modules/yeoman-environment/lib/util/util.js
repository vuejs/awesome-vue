/** @module env/util */
'use strict';
const GroupedQueue = require('grouped-queue');

/**
 * Create a "sloppy" copy of an initial Environment object. The focus of this method is on
 * performance rather than correctly deep copying every property or recreating a correct
 * instance. Use carefully and don't rely on `hasOwnProperty` of the copied environment.
 *
 * Every property are shared except the runLoop which is regenerated.
 *
 * @param {Environment} initialEnv - an Environment instance
 * @return {Environment} sloppy copy of the initial Environment
 */
exports.duplicateEnv = initialEnv => {
  const queues = require('../environment').queues;
  // Hack: Create a clone of the environment with a new instance of `runLoop`
  const env = Object.create(initialEnv);
  env.runLoop = new GroupedQueue(queues);
  return env;
};

/**
 * Log utility
 * @see {@link env/log}
 */
exports.log = require('./log');
