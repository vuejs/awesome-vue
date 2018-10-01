'use strict';

var test = require('tape');

var TypedError = require('../typed.js');

test('a server error', function t(assert) {
    var ServerError = TypedError({
        type: 'server.5xx.error',
        message: '{title} server error, status={statusCode}'
    });

    var error = ServerError({
        title: 'some title',
        statusCode: 500
    });

    assert.equal(ServerError.type, 'server.5xx.error');

    assert.equal(error.type, 'server.5xx.error');
    assert.equal(error.fullType, 'server.5xx.error');
    assert.equal(error.statusCode, 500);
    assert.equal(error.message, 'some title server error, status=500');

    assert.end();
});

test('a client error', function t(assert) {
    var ClientError = TypedError({
        type: 'client.4xx.error',
        message: '{title} client error, status={statusCode}'
    });

    var error2 = ClientError({
        title: 'some title',
        statusCode: 404
    });

    assert.equal(error2.type, 'client.4xx.error');
    assert.equal(error2.fullType, 'client.4xx.error');
    assert.equal(error2.statusCode, 404);
    assert.equal(error2.message, 'some title client error, status=404');

    assert.end();
});
