'use strict';
const scopedRegex = require('scoped-regex');

module.exports = input => scopedRegex({exact: true}).test(input);
