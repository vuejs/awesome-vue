'use strict';
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const table = require('text-table');

/**
 * @mixin
 * @alias actions/help
 */
const help = module.exports;

/**
 * Tries to get the description from a USAGE file one folder above the
 * source root otherwise uses a default description
 */
help.help = function () {
  const filepath = path.resolve(this.sourceRoot(), '../USAGE');
  const exists = fs.existsSync(filepath);

  let out = [
    'Usage:',
    '  ' + this.usage(),
    ''
  ];

  // Build options
  if (Object.keys(this._options).length > 0) {
    out = out.concat([
      'Options:',
      this.optionsHelp(),
      ''
    ]);
  }

  // Build arguments
  if (this._arguments.length > 0) {
    out = out.concat([
      'Arguments:',
      this.argumentsHelp(),
      ''
    ]);
  }

  // Append USAGE file is any
  if (exists) {
    out.push(fs.readFileSync(filepath, 'utf8'));
  }

  return out.join('\n');
};

function formatArg(config) {
  let arg = `<${config.name}>`;

  if (!config.required) {
    arg = `[${arg}]`;
  }

  return arg;
}

/**
 * Output usage information for this given generator, depending on its arguments
 * or options
 */
help.usage = function () {
  const options = Object.keys(this._options).length ? '[options]' : '';
  let name = this.options.namespace;
  let args = '';

  if (this._arguments.length > 0) {
    args = this._arguments.map(formatArg).join(' ') + ' ';
  }

  name = name.replace(/^yeoman:/, '');
  let out = `yo ${name} ${args}${options}`;

  if (this.description) {
    out += '\n\n' + this.description;
  }

  return out;
};

/**
 * Simple setter for custom `description` to append on help output.
 *
 * @param {String} description
 */

help.desc = function (description) {
  this.description = description || '';
  return this;
};

/**
 * Get help text for arguments
 * @returns {String} Text of options in formatted table
 */
help.argumentsHelp = function () {
  const rows = this._arguments.map(config => {
    return [
      '',
      config.name ? config.name : '',
      config.description ? `# ${config.description}` : '',
      config.type ? `Type: ${config.type.name}` : '',
      `Required: ${config.required}`
    ];
  });

  return table(rows);
};

/**
 * Get help text for options
 * @returns {String} Text of options in formatted table
 */
help.optionsHelp = function () {
  const options = _.reject(this._options, x => x.hide);

  const rows = options.map(opt => {
    return [
      '',
      opt.alias ? `-${opt.alias}, ` : '',
      `--${opt.name}`,
      opt.description ? `# ${opt.description}` : '',
      (opt.default !== undefined && opt.default !== '') ? 'Default: ' + opt.default : ''
    ];
  });

  return table(rows);
};
