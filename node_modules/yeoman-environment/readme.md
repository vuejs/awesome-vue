# Yeoman Environment

[![npm](https://badge.fury.io/js/yeoman-environment.svg)](http://badge.fury.io/js/yeoman-environment) [![Build Status](https://travis-ci.org/yeoman/generator.svg?branch=master)](https://travis-ci.org/yeoman/environment) [![Coverage Status](https://coveralls.io/repos/github/yeoman/environment/badge.svg?branch=master)](https://coveralls.io/github/yeoman/environment?branch=master) [![Gitter](https://img.shields.io/badge/Gitter-Join_the_Yeoman_chat_%E2%86%92-00d06f.svg)](https://gitter.im/yeoman/yeoman)

> Handles the lifecycle and bootstrapping of generators in a specific environment

It provides a high-level API to discover, create and run generators, as well as further tuning of where and how a generator is resolved.


## Install

```
$ npm install yeoman-environment
```


## Usage

Full documentation available [here](http://yeoman.io/authoring/integrating-yeoman.html).

```js
const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();

// The #lookup() method will search the user computer for installed generators
// The search if done from the current working directory
env.lookup(() => {
  env.run('angular', {'skip-install': true}, err => {
    console.log('done');
  });
});
```

For advance usage, see [our API documentation](http://yeoman.github.io/environment).


## License

BSD-2-Clause © Yeoman
