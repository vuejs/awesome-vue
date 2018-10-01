'use strict';
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const globby = require('globby');
const debug = require('debug')('yeoman:environment');
const spawn = require('cross-spawn');

const win32 = process.platform === 'win32';
const nvm = process.env.NVM_HOME;

/**
 * @mixin
 * @alias env/resolver
 */
const resolver = module.exports;

/**
 * Search for generators and their sub generators.
 *
 * A generator is a `:lookup/:name/index.js` file placed inside an npm package.
 *
 * Defaults lookups are:
 *   - ./
 *   - generators/
 *   - lib/generators/
 *
 * So this index file `node_modules/generator-dummy/lib/generators/yo/index.js` would be
 * registered as `dummy:yo` generator.
 *
 * @param {function} cb - Callback called once the lookup is done. Take err as first
 *                        parameter.
 */
resolver.lookup = function (cb) {
  const generatorsModules = this.findGeneratorsIn(this.getNpmPaths().reverse());
  const patterns = [];

  for (const lookup of this.lookups) {
    for (const modulePath of generatorsModules) {
      patterns.push(path.join(modulePath, lookup));
    }
  }

  for (const pattern of patterns) {
    for (const filename of globby.sync('*/index.js', {cwd: pattern, absolute: true, deep: 1})) {
      this._tryRegistering(filename);
    }
  }

  if (typeof cb === 'function') {
    return cb(null);
  }
};

/**
 * Search npm for every available generators.
 * Generators are npm packages who's name start with `generator-` and who're placed in the
 * top level `node_module` path. They can be installed globally or locally.
 *
 * @param {Array}  List of search paths
 * @return {Array} List of the generator modules path
 */
resolver.findGeneratorsIn = function (searchPaths) {
  let modules = [];

  for (const root of searchPaths) {
    if (!root) {
      continue;
    }

    // Some folders might not be readable to the current user. For those, we add a try
    // catch to handle the error gracefully as globby doesn't have an option to skip
    // restricted folders.
    try {
      modules = modules.concat(globby.sync(
        ['generator-*'],
        {cwd: root, onlyFiles: false, absolute: true, deep: 0}
      ));

      // To limit recursive lookups into non-namespace folders within globby,
      // fetch all namespaces in root, then search each namespace separately
      // for generator modules
      const namespaces = globby.sync(
        ['@*'],
        {cwd: root, onlyFiles: false, absolute: true, deep: 0}
      );

      for (const namespace of namespaces) {
        modules = modules.concat(globby.sync(
          ['generator-*'],
          {cwd: namespace, onlyFiles: false, absolute: true, deep: 0}
        ));
      }
    } catch (err) {
      debug('Could not access %s (%s)', root, err);
    }
  }

  return modules;
};

/**
 * Try registering a Generator to this environment.
 * @private
 * @param  {String} generatorReference A generator reference, usually a file path.
 */
resolver._tryRegistering = function (generatorReference) {
  let namespace;
  const realPath = fs.realpathSync(generatorReference);

  try {
    debug('found %s, trying to register', generatorReference);

    if (realPath !== generatorReference) {
      namespace = this.namespace(generatorReference);
    }

    this.register(realPath, namespace);
  } catch (err) {
    console.error('Unable to register %s (Error: %s)', generatorReference, err.message);
  }
};

/**
 * Get the npm lookup directories (`node_modules/`)
 * @return {Array} lookup paths
 */
resolver.getNpmPaths = function () {
  let paths = [];

  // Default paths for each system
  if (nvm) {
    paths.push(path.join(process.env.NVM_HOME, process.version, 'node_modules'));
  } else if (win32) {
    paths.push(path.join(process.env.APPDATA, 'npm/node_modules'));
  } else {
    paths.push('/usr/lib/node_modules');
    paths.push('/usr/local/lib/node_modules');
  }

  // Add NVM prefix directory
  if (process.env.NVM_PATH) {
    paths.push(path.join(path.dirname(process.env.NVM_PATH), 'node_modules'));
  }

  // Adding global npm directories
  // We tried using npm to get the global modules path, but it haven't work out
  // because of bugs in the parseable implementation of `ls` command and mostly
  // performance issues. So, we go with our best bet for now.
  if (process.env.NODE_PATH) {
    paths = _.compact(process.env.NODE_PATH.split(path.delimiter)).concat(paths);
  }

  // global node_modules should be 4 or 2 directory up this one (most of the time)
  paths.push(path.join(__dirname, '../../../..'));
  paths.push(path.join(__dirname, '../..'));

  // Get yarn global directory and infer the module paths from there
  const testYarn = spawn.sync('yarn', ['global', 'dir'], {encoding: 'utf8'});
  if (!testYarn.error) {
    const yarnBase = testYarn.stdout.trim();
    paths.push(path.resolve(yarnBase, 'node_modules'));
    paths.push(path.resolve(yarnBase, '../link/'));
  }

  // Get npm global prefix and infer the module paths from there
  const testNpm = spawn.sync('npm', ['-g', 'prefix'], {encoding: 'utf8'});
  if (!testNpm.error) {
    const npmBase = testNpm.stdout.trim();
    paths.push(path.resolve(npmBase, 'lib/node_modules'));
  }

  // Adds support for generator resolving when yeoman-generator has been linked
  if (process.argv[1]) {
    paths.push(path.join(path.dirname(process.argv[1]), '../..'));
  }

  // Walk up the CWD and add `node_modules/` folder lookup on each level
  process.cwd().split(path.sep).forEach((part, i, parts) => {
    let lookup = path.join(...parts.slice(0, i + 1), 'node_modules');

    if (!win32) {
      lookup = `/${lookup}`;
    }

    paths.push(lookup);
  });

  return _.uniq(paths.reverse());
};

/**
 * Get or create an alias.
 *
 * Alias allows the `get()` and `lookup()` methods to search in alternate
 * filepath for a given namespaces. It's used for example to map `generator-*`
 * npm package to their namespace equivalent (without the generator- prefix),
 * or to default a single namespace like `angular` to `angular:app` or
 * `angular:all`.
 *
 * Given a single argument, this method acts as a getter. When both name and
 * value are provided, acts as a setter and registers that new alias.
 *
 * If multiple alias are defined, then the replacement is recursive, replacing
 * each alias in reverse order.
 *
 * An alias can be a single String or a Regular Expression. The finding is done
 * based on .match().
 *
 * @param {String|RegExp} match
 * @param {String} value
 *
 * @example
 *
 *     env.alias(/^([a-zA-Z0-9:\*]+)$/, 'generator-$1');
 *     env.alias(/^([^:]+)$/, '$1:app');
 *     env.alias(/^([^:]+)$/, '$1:all');
 *     env.alias('foo');
 *     // => generator-foo:all
 */
resolver.alias = function (match, value) {
  if (match && value) {
    this.aliases.push({
      match: match instanceof RegExp ? match : new RegExp(`^${match}$`),
      value
    });
    return this;
  }

  const aliases = this.aliases.slice(0).reverse();

  return aliases.reduce((res, alias) => {
    if (!alias.match.test(res)) {
      return res;
    }

    return res.replace(alias.match, alias.value);
  }, match);
};
