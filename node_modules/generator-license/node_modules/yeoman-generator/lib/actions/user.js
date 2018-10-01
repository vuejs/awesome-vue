'use strict';
const shell = require('shelljs');
const githubUsername = require('github-username');

const nameCache = new Map();
const emailCache = new Map();

/**
 * @mixin
 * @alias actions/user
 */
const user = module.exports;

user.git = {};
user.github = {};

/**
 * Retrieves user's name from Git in the global scope or the project scope
 * (it'll take what Git will use in the current context)
 * @return {String} configured git name or undefined
 */
user.git.name = () => {
  let name = nameCache.get(process.cwd());

  if (name) {
    return name;
  }

  if (shell.which('git')) {
    name = shell.exec('git config --get user.name', {silent: true}).stdout.trim();
    nameCache.set(process.cwd(), name);
  }

  return name;
};

/**
 * Retrieves user's email from Git in the global scope or the project scope
 * (it'll take what Git will use in the current context)
 * @return {String} configured git email or undefined
 */
user.git.email = () => {
  let email = emailCache.get(process.cwd());

  if (email) {
    return email;
  }

  if (shell.which('git')) {
    email = shell.exec('git config --get user.email', {silent: true}).stdout.trim();
    emailCache.set(process.cwd(), email);
  }

  return email;
};

/**
 * Retrieves GitHub's username from the GitHub API
 * @return {Promise} Resolved with the GitHub username or rejected if unable to
 *                   get the information
 */
user.github.username = () => githubUsername(user.git.email());
