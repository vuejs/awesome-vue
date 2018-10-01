# generator-license

[![Build Status](https://img.shields.io/travis/jozefizso/generator-license.svg)](https://travis-ci.org/jozefizso/generator-license)
[![NPM version](https://img.shields.io/npm/v/generator-license.svg)](https://www.npmjs.org/package/generator-license)
[![Coverage Status](https://coveralls.io/repos/github/jozefizso/generator-license/badge.svg)](https://coveralls.io/github/jozefizso/generator-license)
[![David Dependencies](https://img.shields.io/david/jozefizso/generator-license.svg)](https://david-dm.org/jozefizso/generator-license)
[![David Dev Dependencies](https://img.shields.io/david/dev/jozefizso/generator-license.svg)](https://david-dm.org/jozefizso/generator-license#info=devDependencies)

> Generate LICENSE file for your project using Yeoman.

```
yo license
```


## Getting started
- Make sure you have [yo](https://github.com/yeoman/yo) installed:
    `npm install -g yo`
- Install the generator: `npm install -g generator-license`
- Run: `yo license`, enter your full name and choose a license

The generator will generate the `LICENSE` file and fill the `license` field of the `package.json`.

### Compose with generator license in your own generator

`generator-license` can be easily embedded into your own generator using [Yeoman composability](http://yeoman.io/authoring/composability.html).

First, install `generator-license` as a dependency of your own generator.

```
npm install --save generator-license
```

Then call it from your generator.

```js
this.composeWith(require.resolve('generator-license'), {
  name: 'John Doe', // (optional) Owner's name
  email: 'john.doe@example.com', // (optional) Owner's email
  website: 'https://example.com', // (optional) Owner's website
  year: '1945', // (optional) License year (defaults to current year)
  licensePrompt: 'Which license do you want to use?' // (optional) customize license prompt text
  defaultLicense: 'MIT', // (optional) Select a default license
  license: 'MIT', // (optional) Select a license, so no license prompt will happen, in case you want to handle it outside of this generator
});
```

All the options are optional; the generator will prompt for answers when information is not provided.

### Supported licenses

- [Apache 2 License][10]
- [MIT License][20]
- [Mozilla Public License 2.0][30]
- [BSD 2-Clause (FreeBSD) License][40]
- [BSD 3-Clause (NewBSD) License][50]
- [Internet Systems Consortium (ISC) License][60]
- [GNU AGPL 3.0 License][70]
- [GNU GPL 3.0 License][80]
- [Unlicense][90]
- [No License][100]

For [Creative Commons Licenses][200] (useful for media files, documentation and
other creative works) you can use [generator-license-cc][201].

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[10]: http://choosealicense.com/licenses/apache/
[20]: http://choosealicense.com/licenses/mit/
[30]: http://choosealicense.com/licenses/mpl-2.0/
[40]: http://choosealicense.com/licenses/bsd/
[50]: http://choosealicense.com/licenses/bsd-3-clause/
[60]: http://en.wikipedia.org/wiki/ISC_license
[70]: http://choosealicense.com/licenses/agpl-3.0/
[80]: http://choosealicense.com/licenses/gpl-3.0/
[90]: http://unlicense.org/
[100]: http://choosealicense.com/licenses/no-license/
[200]: https://creativecommons.org/licenses/
[201]: https://github.com/ek9/generator-license-cc
