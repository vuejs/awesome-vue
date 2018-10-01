# error

<!--
    [![build status][1]][2]
    [![NPM version][3]][4]
    [![Coverage Status][5]][6]
    [![gemnasium Dependency Status][7]][8]
    [![Davis Dependency status][9]][10]
-->

<!-- [![browser support][11]][12] -->

Custom errors

## Typed Error

```js
var TypedError = require("error/typed")

var ServerError = TypedError({
    type: 'server.5xx',
    message: '{title} server error, status={statusCode}',
    title: null,
    statusCode: null
});
var ClientError = TypedError({
    type: 'client.4xx',
    message: '{title} client error, status={statusCode}',
    title: null,
    statusCode: null
});

var error = ServerError({
    title:'some title',
    statusCode: 500
});
var error2 = ClientError({
    title: 'some title',
    statusCode: 404
});
```

## Wrapped Errors

```js
var net = require('net');
var WrappedError = require('error/wrapped');

var ServerListenError = WrappedError({
    message: 'server: {origMessage}',
    type: 'server.listen-failed',
    requestedPort: null,
    host: null
});

var server = net.createServer();

server.on('error', function onError(err) {
    if (err.code === 'EADDRINUSE') {
        throw ServerListenError(err, {
            requestedPort: 3000,
            host: null
        });
    } else {
        throw err;
    }
});

server.listen(3000);
```

## Installation

`npm install error`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/error.png
  [2]: https://travis-ci.org/Raynos/error
  [3]: https://badge.fury.io/js/error.png
  [4]: https://badge.fury.io/js/error
  [5]: https://coveralls.io/repos/Raynos/error/badge.png
  [6]: https://coveralls.io/r/Raynos/error
  [7]: https://gemnasium.com/Raynos/error.png
  [8]: https://gemnasium.com/Raynos/error
  [9]: https://david-dm.org/Raynos/error.png
  [10]: https://david-dm.org/Raynos/error
  [11]: https://ci.testling.com/Raynos/error.png
  [12]: https://ci.testling.com/Raynos/error
