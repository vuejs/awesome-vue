'use strict';
const assert = require('assert');
const _ = require('lodash');

/**
 * Storage instances handle a json file where Generator authors can store data.
 *
 * The `Generator` class instantiate the storage named `config` by default.
 *
 * @constructor
 * @param {String} name       The name of the new storage (this is a namespace)
 * @param {mem-fs-editor} fs  A mem-fs editor instance
 * @param {String} configPath The filepath used as a storage.
 *
 * @example
 * class extend Generator {
 *   writing: function() {
 *     this.config.set('coffeescript', false);
 *   }
 * }
 */
class Storage {
  constructor(name, fs, configPath) {
    assert(name, 'A name parameter is required to create a storage');
    assert(configPath, 'A config filepath is required to create a storage');

    this.path = configPath;
    this.name = name;
    this.fs = fs;
    this.existed = Object.keys(this._store).length > 0;
  }

  /**
   * Return the current store as JSON object
   * @return {Object} the store content
   * @private
   */
  get _store() {
    return this.fs.readJSON(this.path, {})[this.name] || {};
  }

  /**
   * Persist a configuration to disk
   * @param {Object} val - current configuration values
   * @private
   */
  _persist(val) {
    const fullStore = this.fs.readJSON(this.path, {});
    fullStore[this.name] = val;
    this.fs.write(this.path, JSON.stringify(fullStore, null, '  '));
  }

  /**
   * Save a new object of values
   * @return {null}
   */
  save() {
    this._persist(this._store);
  }

  /**
   * Get a stored value
   * @param  {String} key  The key under which the value is stored.
   * @return {*}           The stored value. Any JSON valid type could be returned
   */
  get(key) {
    return this._store[key];
  }

  /**
   * Get all the stored values
   * @return {Object}  key-value object
   */
  getAll() {
    return _.cloneDeep(this._store);
  }

  /**
   * Assign a key to a value and schedule a save.
   * @param {String} key  The key under which the value is stored
   * @param {*} val  Any valid JSON type value (String, Number, Array, Object).
   * @return {*} val  Whatever was passed in as val.
   */
  set(key, val) {
    assert(!_.isFunction(val), 'Storage value can\'t be a function');

    const store = this._store;

    if (_.isObject(key)) {
      val = _.extend(store, key);
    } else {
      store[key] = val;
    }

    this._persist(store);
    return val;
  }

  /**
   * Delete a key from the store and schedule a save.
   * @param  {String} key  The key under which the value is stored.
   * @return {null}
   */
  delete(key) {
    const store = this._store;
    delete store[key];
    this._persist(store);
  }

  /**
   * Setup the store with defaults value and schedule a save.
   * If keys already exist, the initial value is kept.
   * @param  {Object} defaults  Key-value object to store.
   * @return {*} val  Returns the merged options.
   */
  defaults(defaults) {
    assert(_.isObject(defaults), 'Storage `defaults` method only accept objects');
    const val = _.defaults(this.getAll(), defaults);
    this.set(val);
    return val;
  }
}

module.exports = Storage;
