# generator-npm-init

[![Version][npm-version-shield]][npm]
[![Build Status][travis-ci-shield]][travis-ci]
[![Coverage States][codecov-shield]][codecov]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Greenkeeper][greenkeeper-shield]][greenkeeper]
[![Downloads][npm-stats-shield]][npm-stats]

Yeoman generator implementation of `npm init`. Useful for composition.

```javascript
this.composeWith(require.resolve('generator-npm-init/app')/*, options*/)
```

### Options

```javascript
{
  // skip prompts
  'skip-name': false,
  'skip-description': false,
  'skip-version': false,
  'skip-main': false,
  'skip-test': false,
  'skip-repo': false,
  'skip-keywords': false,
  'skip-author': false,
  'skip-license': false,

  // supply alternative defaults
  name: '<%= destFolderName %>',
  version: '1.0.0',
  description: '',
  main: 'index.js',
  test: 'echo "Error: no test specified" && exit 1',
  repo: '',
  keywords: [],
  author: '',
  license: 'ISC',

  // configure run script defaults
  scripts: {
    start: 'node dist/index.js',
    build: 'webpack -p',
    watch: 'webpack-dev-server'
  }
}
```

[travis-ci]: https://travis-ci.org/caseyWebb/generator-npm-init/
[travis-ci-shield]: https://img.shields.io/travis/caseyWebb/generator-npm-init/master.svg
[codecov]: https://codecov.io/gh/caseyWebb/generator-npm-init
[codecov-shield]: https://img.shields.io/codecov/c/github/caseyWebb/generator-npm-init.svg
[greenkeeper]: https://greenkeeper.io/
[greenkeeper-shield]: https://badges.greenkeeper.io/caseyWebb/generator-npm-init.svg
[david-dm]: https://david-dm.org/caseyWebb/generator-npm-init
[david-dm-shield]: https://david-dm.org/caseyWebb/generator-npm-init/status.svg
[david-dm-peer]: https://david-dm.org/caseyWebb/generator-npm-init&type=peer
[david-dm-peer-shield]: https://david-dm.org/caseyWebb/generator-npm-init/peer-status.svg
[david-dm-dev]: https://david-dm.org/caseyWebb/generator-npm-init&type=dev
[david-dm-dev-shield]: https://david-dm.org/caseyWebb/generator-npm-init/dev-status.svg
[npm]: https://www.npmjs.com/package/generator-npm-init
[npm-version-shield]: https://img.shields.io/npm/v/generator-npm-init.svg
[npm-stats]: http://npm-stat.com/charts.html?package=generator-npm-init&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/generator-npm-init.svg?maxAge=2592000
