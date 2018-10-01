'use strict';
const regex = '@[a-z0-9][\\w-.]+/[a-z0-9][\\w-.]*';

module.exports = opts => opts && opts.exact ? new RegExp(`^${regex}$`, 'i') : new RegExp(regex, 'gi');
