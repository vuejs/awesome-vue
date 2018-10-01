'use strict';
const assert = require('assert');
const _ = require('lodash');
const dargs = require('dargs');
const async = require('async');
const chalk = require('chalk');

/**
 * @mixin
 * @alias actions/install
 */
const install = module.exports;

/**
 * Combine package manager cmd line arguments and run the `install` command.
 *
 * During the `install` step, every command will be scheduled to run once, on the
 * run loop. This means you can use `Promise.then` to log information, but don't
 * return it or mix it with `this.async` as it'll dead lock the process.
 *
 * @param {String} installer Which package manager to use
 * @param {String|Array} [paths] Packages to install. Use an empty string for `npm install`
 * @param {Object} [options] Options to pass to `dargs` as arguments
 * @param {Object} [spawnOptions] Options to pass `child_process.spawn`. ref
 *                                https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 * @return {Promise} Resolved on installation success, rejected otherwise
 */

install.runInstall = function (installer, paths, options, spawnOptions) {
  return new Promise((resolve, reject) => {
    options = options || {};
    spawnOptions = spawnOptions || {};
    paths = Array.isArray(paths) ? paths : (paths && paths.split(' ')) || [];

    let args = ['install'].concat(paths).concat(dargs(options));

    // Yarn uses the `add` command to specifically add a package to a project
    if (installer === 'yarn' && paths.length > 0) {
      args[0] = 'add';
    }

    // Only for npm, use a minimum cache of one day
    if (installer === 'npm') {
      args = args.concat(['--cache-min', 24 * 60 * 60]);
    }

    // Return early if we're skipping installation
    if (this.options.skipInstall) {
      this.log('Skipping install command: ' + chalk.yellow(installer + ' ' + args.join(' ')));
      return resolve();
    }

    this.env.runLoop.add('install', done => {
      this.emit(`${installer}Install`, paths);
      this.spawnCommand(installer, args, spawnOptions)
        .on('error', err => {
          this.log(chalk.red('Could not finish installation. \n') +
            'Please install ' + installer + ' with ' +
            chalk.yellow('npm install -g ' + installer) + ' and try again. \n' +
            'If ' + installer + ' is already installed, try running the following command manually: ' + chalk.yellow(installer + ' ' + args.join(' '))
          );
          reject(err);
          done();
        })
        .on('exit', () => {
          this.emit(`${installer}Install:end`, paths);
          resolve();
          done();
        });
    }, {
      once: installer + ' ' + args.join(' '),
      run: false
    });
  });
};

/**
 * Runs `npm` and `bower`, in sequence, in the generated directory and prints a
 * message to let the user know.
 *
 * @example
 * this.installDependencies({
 *   bower: true,
 *   npm: true
 * }).then(() => console.log('Everything is ready!'));
 *
 * @example
 * this.installDependencies({
 *   yarn: {force: true},
 *   npm: false
 * }).then(() => console.log('Everything is ready!'));
 *
 * @param {Object} [options]
 * @param {Boolean|Object} [options.npm=true] - whether to run `npm install` or can be options to pass to `dargs` as arguments
 * @param {Boolean|Object} [options.bower=true] - whether to run `bower install` or can be options to pass to `dargs` as arguments
 * @param {Boolean|Object} [options.yarn=false] - whether to run `yarn install` or can be options to pass to `dargs` as arguments
 * @param {Boolean} [options.skipMessage=false] - whether to log the used commands
 * @return {Promise} Resolved once done, rejected if errors
 */
install.installDependencies = function (options) {
  options = options || {};
  const commands = [];
  const msg = {
    commands: [],
    template: _.template('\n\nI\'m all done. ' +
    '<%= skipInstall ? "Just run" : "Running" %> <%= commands %> ' +
    '<%= skipInstall ? "" : "for you " %>to install the required dependencies.' +
    '<% if (!skipInstall) { %> If this fails, try running the command yourself.<% } %>\n\n')
  };

  const getOptions = options => {
    return typeof options === 'object' ? options : null;
  };

  if (options.npm !== false) {
    msg.commands.push('npm install');
    commands.push(cb => {
      this.npmInstall(null, getOptions(options.npm)).then(
        val => cb(null, val),
        cb
      );
    });
  }

  if (options.yarn) {
    msg.commands.push('yarn install');
    commands.push(cb => {
      this.yarnInstall(null, getOptions(options.yarn)).then(
        val => cb(null, val),
        cb
      );
    });
  }

  if (options.bower !== false) {
    msg.commands.push('bower install');
    commands.push(cb => {
      this.bowerInstall(null, getOptions(options.bower)).then(
        val => cb(null, val),
        cb
      );
    });
  }

  assert(msg.commands.length, 'installDependencies needs at least one of `npm`, `bower` or `yarn` to run.');

  if (!options.skipMessage) {
    const tplValues = _.extend({
      skipInstall: false
    }, this.options, {
      commands: chalk.yellow.bold(msg.commands.join(' && '))
    });
    this.log(msg.template(tplValues));
  }

  return new Promise((resolve, reject) => {
    async.parallel(commands, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

/**
 * Receives a list of `components` and an `options` object to install through bower.
 *
 * The installation will automatically run during the run loop `install` phase.
 *
 * @param {String|Array} [cmpnt] Components to install
 * @param {Object} [options] Options to pass to `dargs` as arguments
 * @param {Object} [spawnOptions] Options to pass `child_process.spawn`.
 * @return {Promise} Resolved if install successful, rejected otherwise
 */
install.bowerInstall = function (cmpnt, options, spawnOptions) {
  return this.runInstall('bower', cmpnt, options, spawnOptions);
};

/**
 * Receives a list of `packages` and an `options` object to install through npm.
 *
 * The installation will automatically run during the run loop `install` phase.
 *
 * @param {String|Array} [pkgs] Packages to install
 * @param {Object} [options] Options to pass to `dargs` as arguments
 * @param {Object} [spawnOptions] Options to pass `child_process.spawn`.
 * @return {Promise} Resolved if install successful, rejected otherwise
 */
install.npmInstall = function (pkgs, options, spawnOptions) {
  return this.runInstall('npm', pkgs, options, spawnOptions);
};

/**
 * Receives a list of `packages` and an `options` object to install through yarn.
 *
 * The installation will automatically run during the run loop `install` phase.
 *
 * @param {String|Array} [pkgs] Packages to install
 * @param {Object} [options] Options to pass to `dargs` as arguments
 * @param {Object} [spawnOptions] Options to pass `child_process.spawn`.
 * @return {Promise} Resolved if install successful, rejected otherwise
 */
install.yarnInstall = function (pkgs, options, spawnOptions) {
  return this.runInstall('yarn', pkgs, options, spawnOptions);
};
