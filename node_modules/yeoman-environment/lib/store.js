'use strict';

/**
 * The Generator store
 * This is used to store generator (npm packages) reference and instantiate them when
 * requested.
 * @constructor
 * @private
 */
class Store {
  constructor() {
    this._generators = {};
    this._meta = {};
  }

  /**
   * Store a module under the namespace key
   * @param {String}          namespace  - The key under which the generator can be retrieved
   * @param {String|Function} generator  - A generator module or a module path
   * @param {String}          [resolved] - The file path to the generator (used only if generator is a module)
   */
  add(namespace, generator, resolved) {
    if (typeof generator === 'string') {
      this._storeAsPath(namespace, generator);
      return;
    }

    this._storeAsModule(namespace, generator, resolved);
  }

  _storeAsPath(namespace, path) {
    this._meta[namespace] = {
      resolved: path,
      namespace
    };

    Object.defineProperty(this._generators, namespace, {
      get() {
        const Generator = require(path);
        return Generator;
      },
      enumerable: true,
      configurable: true
    });
  }

  _storeAsModule(namespace, Generator, resolved = 'unknown') {
    this._meta[namespace] = {
      resolved,
      namespace
    };

    this._generators[namespace] = Generator;
  }

  /**
   * Get the module registered under the given namespace
   * @param  {String} namespace
   * @return {Module}
   */
  get(namespace) {
    const Generator = this._generators[namespace];

    if (!Generator) {
      return;
    }

    return Object.assign(Generator, this._meta[namespace]);
  }

  /**
   * Returns the list of registered namespace.
   * @return {Array} Namespaces array
   */
  namespaces() {
    return Object.keys(this._generators);
  }

  /**
   * Get the stored generators meta data
   * @return {Object} Generators metadata
   */
  getGeneratorsMeta() {
    return this._meta;
  }
}

module.exports = Store;
