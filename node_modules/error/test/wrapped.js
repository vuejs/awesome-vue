'use strict';

var test = require('tape');
var net = require('net');

var WrappedError = require('../wrapped.js');

test('can create a wrapped error', function t(assert) {
    var ServerListenError = WrappedError({
        message: 'server: {causeMessage}',
        type: 'server.listen-failed',
        requestedPort: null,
        host: null
    });

    var err = new Error('listen EADDRINUSE');
    err.code = 'EADDRINUSE';

    var err2 = ServerListenError(err, {
        requestedPort: 3426,
        host: 'localhost'
    });

    assert.equal(ServerListenError.type, 'server.listen-failed');

    assert.equal(err2.message, 'server: listen EADDRINUSE');
    assert.equal(err2.requestedPort, 3426);
    assert.equal(err2.host, 'localhost');
    assert.equal(err2.code, 'EADDRINUSE');

    assert.equal(err2.cause, err);

    assert.equal(err2.toString(),
        'ServerListenFailedError: server: listen EADDRINUSE');

    assert.equal(JSON.stringify(err2), JSON.stringify({
        type: 'server.listen-failed',
        message: 'server: listen EADDRINUSE',
        requestedPort: 3426,
        host: 'localhost',
        name: 'ServerListenFailedError',
        causeMessage: 'listen EADDRINUSE',
        origMessage: 'listen EADDRINUSE',
        code: 'EADDRINUSE',
        fullType: 'server.listen-failed~!~error.wrapped-unknown'
    }));

    assert.end();
});

test('can create wrapped error with syscall', function t(assert) {
    var SysCallError = WrappedError({
        'message': 'tchannel socket error ({code} from ' +
            '{syscall}): {origMessage}',
        type: 'syscall.error'
    });

    var err = new Error('listen EADDRINUSE');
    err.code = 'EADDRINUSE';
    err.syscall = 'listen';

    var err2 = SysCallError(err);

    assert.equal(err2.message, 'tchannel socket error ' +
        '(EADDRINUSE from listen): listen EADDRINUSE');
    assert.equal(err2.syscall, 'listen');
    assert.equal(err2.code, 'EADDRINUSE');
    assert.equal(err2.type, 'syscall.error');

    assert.end();
});

test('wrapping twice', function t(assert) {
    var ReadError = WrappedError({
        type: 'my.read-error',
        message: 'read: {causeMessage}'
    });

    var DatabaseError = WrappedError({
        type: 'my.database-error',
        message: 'db: {causeMessage}'
    });

    var BusinessError = WrappedError({
        type: 'my.business-error',
        message: 'business: {causeMessage}'
    });

    var err = BusinessError(
        DatabaseError(
            ReadError(
                new Error('oops')
            )
        )
    );
    assert.ok(err);

    assert.equal(err.message, 'business: db: read: oops');
    assert.equal(err.type, 'my.business-error');
    assert.equal(err.fullType, 'my.business-error~!~' +
        'my.database-error~!~' +
        'my.read-error~!~' +
        'error.wrapped-unknown');

    assert.end();
});

test('handles bad recursive strings', function t(assert) {
    var ReadError = WrappedError({
        type: 'wat.wat',
        message: 'read: {causeMessage}'
    });

    var err2 = ReadError(new Error('hi {causeMessage}'));

    assert.ok(err2);
    assert.equal(err2.message,
        'read: hi $INVALID_CAUSE_MESSAGE_LITERAL');

    assert.end();
});

test('can wrap real IO errors', function t(assert) {
    var ServerListenError = WrappedError({
        message: 'server: {causeMessage}',
        type: 'server.listen-failed',
        requestedPort: null,
        host: null
    });

    var otherServer = net.createServer();
    otherServer.once('listening', onPortAllocated);
    otherServer.listen(0);

    function onPortAllocated() {
        var port = otherServer.address().port;

        var server = net.createServer();
        server.on('error', onError);

        server.listen(port);

        function onError(cause) {
            var err = ServerListenError(cause, {
                host: 'localhost',
                requestedPort: port
            });

            otherServer.close();
            assertOnError(err, cause, port);
        }
    }

    function assertOnError(err, cause, port) {
        assert.equal(err.message, 'server: listen EADDRINUSE');
        assert.equal(err.requestedPort, port);
        assert.equal(err.host, 'localhost');
        assert.equal(err.code, 'EADDRINUSE');

        assert.equal(err.cause, cause);

        assert.equal(err.toString(),
            'ServerListenFailedError: server: listen EADDRINUSE');

        assert.equal(JSON.stringify(err), JSON.stringify({
            type: 'server.listen-failed',
            message: 'server: listen EADDRINUSE',
            requestedPort: port,
            host: 'localhost',
            name: 'ServerListenFailedError',
            causeMessage: 'listen EADDRINUSE',
            origMessage: 'listen EADDRINUSE',
            code: 'EADDRINUSE',
            errno: 'EADDRINUSE',
            syscall: 'listen',
            fullType: 'server.listen-failed~!~' +
                'error.wrapped-io.listen.EADDRINUSE'
        }));

        assert.end();
    }
});
