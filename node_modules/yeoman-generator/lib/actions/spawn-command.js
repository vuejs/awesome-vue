'use strict';
const _ = require('lodash');
const spawn = require('cross-spawn');

/**
 * @mixin
 * @alias actions/spawn-command
 */
const spawnCommand = module.exports;

/**
 * Normalize a command across OS and spawn it (asynchronously).
 *
 * @param {String} command program to execute
 * @param {Array} args list of arguments to pass to the program
 * @param {object} [opt] any cross-spawn options
 * @return {String} spawned process reference
 */
spawnCommand.spawnCommand = (command, args, opt) => {
  opt = opt || {};
  return spawn(command, args, _.defaults(opt, { stdio: 'inherit' }));
};

/**
 * Normalize a command across OS and spawn it (synchronously).
 *
 * @param {String} command program to execute
 * @param {Array} args list of arguments to pass to the program
 * @param {object} [opt] any cross-spawn options
 * @return {String} spawn.sync result
 */
spawnCommand.spawnCommandSync = (command, args, opt) => {
  opt = opt || {};
  return spawn.sync(command, args, _.defaults(opt, { stdio: 'inherit' }));
};
