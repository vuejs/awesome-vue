'use strict';
const _ = require('lodash');
const chalk = require('chalk');

const deprecate = (message, fn) => {
  return function() {
    deprecate.log(message);
    return fn.apply(this, arguments);
  };
};

deprecate.log = message => {
  console.log(chalk.yellow('(!) ') + message);
};

deprecate.object = (message, object) => {
  const msgTpl = _.template(message);
  const mirror = [];

  for (const name of Object.keys(object)) {
    const func = object[name];

    if (typeof func !== 'function') {
      mirror[name] = func;
      continue;
    }

    mirror[name] = deprecate(msgTpl({ name }), func);
  }

  return mirror;
};

deprecate.property = (message, object, property) => {
  const original = object[property];
  Object.defineProperty(object, property, {
    get() {
      deprecate.log(message);
      return original;
    }
  });
};

module.exports = deprecate;
