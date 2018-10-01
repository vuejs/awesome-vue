'use strict';

module.exports = IOError;

function IOError(cause, prefix) {
    var err = new Error(prefix + ': ' + cause.message);

    Object.defineProperty(err, 'type', {
        value: 'error.IOError',
        configurable: true,
        enumerable: true
    });
    err.name = 'WrappedIOError';
    err.statusCode = 500;
    Object.defineProperty(err, 'cause', {
        value: cause,
        configurable: true,
        enumerable: false
    });
    return err;
}
