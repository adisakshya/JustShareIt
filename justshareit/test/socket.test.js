const assert = require('node:assert/strict');
const test = require('node:test');

function createServer() {
    const socketioJwtPath = require.resolve('socketio-jwt');
    const socketPath = require.resolve('../lib/socket');
    const socketioJwt = require(socketioJwtPath);
    const originalAuthorize = socketioJwt.authorize;
    const handlers = {};

    socketioJwt.authorize = () => ({});
    delete require.cache[socketPath];
    require('../lib/socket').start({
        sockets: {
            on(event, handler) {
                handlers[event] = handler;
                return this;
            }
        }
    });
    socketioJwt.authorize = originalAuthorize;

    const emitted = [];
    const broadcasts = [];
    const socketHandlers = {};
    const socket = {
        broadcast: {
            emit(event, data) {
                broadcasts.push({event, data});
            }
        },
        emit(event, ...args) {
            emitted.push({event, args});
        },
        on(event, handler) {
            socketHandlers[event] = handler;
        }
    };

    handlers.authenticated(socket);

    return {broadcasts, emitted, socketHandlers};
}

test('stops requesting slices after forwarding the final slice', () => {
    const {broadcasts, emitted, socketHandlers} = createServer();

    socketHandlers.slice({
        name: 'report.pdf',
        size: 10,
        currentSize: 10,
        offset: 10
    });

    assert.equal(broadcasts.length, 1);
    assert.deepEqual(emitted, []);

    socketHandlers['get files']();
    assert.deepEqual(emitted, [{
        event: 'shared files',
        args: [{"report.pdf": 10}]
    }]);
});

test('allows an interrupted transfer to restart but blocks a completed duplicate', () => {
    const {broadcasts, emitted, socketHandlers} = createServer();
    const firstSlice = {
        name: 'report.pdf',
        size: 10,
        currentSize: 4,
        offset: 4
    };

    socketHandlers.slice(firstSlice);
    socketHandlers.slice(firstSlice);

    assert.equal(broadcasts.length, 2);
    assert.deepEqual(emitted.map(({event}) => event), ['request slice', 'request slice']);

    socketHandlers.slice({...firstSlice, currentSize: 6, offset: 10});
    socketHandlers.slice(firstSlice);

    assert.equal(broadcasts.length, 3);
    assert.deepEqual(emitted.map(({event}) => event), [
        'request slice',
        'request slice',
        'already transfered'
    ]);
});
