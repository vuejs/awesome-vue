# gh-got [![Build Status](https://travis-ci.org/sindresorhus/gh-got.svg?branch=master)](https://travis-ci.org/sindresorhus/gh-got)

> Convenience wrapper for [`got`](https://github.com/sindresorhus/got) to interact with the [GitHub API](https://developer.github.com/v3/)


## Install

```
$ npm install --save gh-got
```


## Usage

Instead of:

```js
const got = require('got');
const token = 'foo';

got('https://api.github.com/users/sindresorhus', {
	json: true,
	headers: {
		'accept': 'application/vnd.github.v3+json',
		'authorization': `token ${token}`
	}
}).then(res => {
	console.log(res.body.login);
	//=> 'sindresorhus'
});
```

You can do:

```js
const ghGot = require('gh-got');

ghGot('users/sindresorhus', {token: 'foo'}).then(res => {
	console.log(res.body.login);
	//=> 'sindresorhus'
});
```

Or:

```js
const ghGot = require('gh-got');

ghGot('https://api.github.com/users/sindresorhus', {token: 'foo'}).then(res => {
	console.log(res.body.login);
	//=> 'sindresorhus'
});
```


## API

Same as [`got`](https://github.com/sindresorhus/got) (including the stream API and aliases), but with some additional options below.

Errors are improved by using the custom GitHub error messages. Doesn't apply to the stream API.

### token

Type: `string`

GitHub [access token](https://github.com/settings/tokens/new).

Can be set globally with the `GITHUB_TOKEN` environment variable.

### endpoint

Type: `string`<br>
Default: `https://api.github.com/`

To support [GitHub Enterprise](https://enterprise.github.com).

Can be set globally with the `GITHUB_ENDPOINT` environment variable.

### body

Type: `Object`

Can be specified as a plain object and will be serialized as JSON with the appropriate headers set.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
