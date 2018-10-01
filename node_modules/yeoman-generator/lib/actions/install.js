'use strict';
const assert = require('assert');
const _ = require('lodash');
const dargs = require('dargs');
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
 * run loop.
 *
 * @param {String} installer Which package manager to use
 * @param {String|Array} [paths] Packages to install. Use an empty string for `npm install`
 * @param {Object} [options] Options to pass to `dargs` as arguments
 * @param {Object} [spawnOptions] Options to pass `child_process.spawn`. ref
 *                                https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 */

install.scheduleInstallTask = function(installer, paths, options, spawnOptions) {
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
  if (this.options.skipInstall || this.options['skip-install']) {
    this.log(
      'Skipping install command: ' + chalk.yellow(installer + ' ' + args.join(' '))
    );
    return;
  }

  this.env.runLoop.add(
    'install',
    done => {
      this.emit(`${installer}Install`, paths);
      this.spawnCommand(installer, args, spawnOptions)
        .on('error', error => {
          this.log(
            chalk.red('Could not finish installation. \n') +
              'Please install ' +
              installer +
              ' with ' +
              chalk.yellow('npm install -g ' + installer) +
              ' and try again. \n' +
              'If ' +
              installer +
              ' is already installed, try running the following command manually: ' +
              chalk.yellow(installer + ' ' + args.join(' '))
          );
          if (this.options.forceInstall || this.options['force-install']) {
            this.emit('error', error);
          }
          done();
        })
        .on('exit', (code, signal) => {
          this.emit(`${installer}Install:end`, paths);
          if (
            (code || signal) &&
            (this.options.forceInstall || this.options['force-install'])
          ) {
            this.emit(
              'error',
              new Error(`Installation of ${installer} failed with code ${code || signal}`)
            );
          }
          done();
        });
    },
    {
      once: installer + ' ' + args.join(' '),
      run: false
    }
  );
};

/**
 * Runs `npm` and `bower`, in sequence, in the generated directory and prints a
 * message to let the user know.
 *
 * @example
 * this.installDependencies({
 *   bower: true,
 *   npm: true
 * });
 *
 * @example
 * this.installDependencies({
 *   yarn: {force: true},
 *   npm: false
 * });
 *
 * @param {Object} [options]
 * @param {Boolean|Object} [options.npm=true] - whether to run `npm install` or can be options to pass to `dargs` as arguments
 * @param {Boolean|Object} [options.bower=true] - whether to run `bower install` or can be options to pass to `dargs` as arguments
 * @param {Boolean|Object} [options.yarn=false] - whether to run `yarn install` or can be options to pass to `dargs` as arguments
 * @param {Boolean} [options.skipMessage=false] - whether to log the used commands
 */
install.installDependencies = function(options) {
  options = options || {};
  const msg = {
    commands: [],
    template: _.template(
      "\n\nI'm all done. " +
        '<%= skipInstall ? "Just run" : "Running" %> <%= commands %> ' +
        '<%= skipInstall ? "" : "for you " %>to install the required dependencies.' +
        '<% if (!skipInstall) { %> If this fails, try running the command yourself.<% } %>\n\n'
    )
  };

  const getOptions = options => {
    return typeof options === 'object' ? options : null;
  };

  if (options.npm !== false) {
    msg.commands.push('npm install');
    this.npmInstall(null, getOptions(options.npm));
  }

  if (options.yarn) {
    msg.commands.push('yarn install');
    this.yarnInstall(null, getOptions(options.yarn));
  }

  if (options.bower !== false) {
    msg.commands.push('bower install');
    this.bowerInstall(null, getOptions(options.bower));
  }

  assert(
    msg.commands.length,
    'installDependencies needs at least one of `npm`, `bower` or `yarn` to run.'
  );

  if (!options.skipMessage) {
    const tplValues = _.extend(
      {
        skipInstall: false
      },
      this.options,
      {
        commands: chalk.yellow.bold(msg.commands.join(' && '))
      }
    );
    this.log(msg.template(tplValues));
  }
};

/**
 * Receives a list of `components` and an `options` object to install through bower.
 *
 * The installation will automatically run during the run loop `install` phase.
 *
 * @param {String|Array} [cmpnt] Components to install
 * @param {Object} [options] Options to pass to `dargs` as arguments
 * @param {Object} [spawnOptions] Options to pass `child_process.spawn`.
 */
install.bowerInstall = function(cmpnt, options, spawnOptions) {
  this.scheduleInstallTask('bower', cmpnt, options, spawnOptions);
};

/**
 * Receives a list of `packages` and an `options` object to install through npm.
 *
 * The installation will automatically run during the run loop `install` phase.
 *
 * @param {String|Array} [pkgs] Packages to install
 * @param {Object} [options] Options to pass to `dargs` as arguments
 * @param {Object} [spawnOptions] Options to pass `child_process.spawn`.
 */
install.npmInstall = function(pkgs, options, spawnOptions) {
  this.scheduleInstallTask('npm', pkgs, options, spawnOptions);
};

/**
 * Receives a list of `packages` and an `options` object to install through yarn.
 *
 * The installation will automatically run during the run loop `install` phase.
 *
 * @param {String|Array} [pkgs] Packages to install
 * @param {Object} [options] Options to pass to `dargs` as arguments
 * @param {Object} [spawnOptions] Options to pass `child_process.spawn`.
 */
install.yarnInstall = function(pkgs, options, spawnOptions) {
  this.scheduleInstallTask('yarn', pkgs, options, spawnOptions);
};
