const socketioJwt   = require('socketio-jwt');

/* Define file structure */
var files = {};

module.exports = {
    /**
     * Authenticated, real-time, bidirectional and event-based communication
     * @param {object} io 
     */
    start: function(io) {

        io.sockets
            /**
             * Authorize socket on connection
             */
            .on('connection', socketioJwt.authorize({
                secret: 'JUSTSHAREIT_ADMIN_SECRET_KEY',
                timeout: 15000
            }))
            /**
             * If the socket is authenticated then start communication
             */
            .on('authenticated', (socket) => {
                /* a new user connected */
                socket.on("create", function () {
                    console.log("[SOCKET] => a new user connected");
                });
                /* file slice received from admin */
                socket.on('slice', function (data) {
                    /*
                     * `offset` counts the bytes read so far, so on the opening slice of
                     * a file it is equal to that slice's own length.
                     */
                    const isFirstSlice = data.offset === data.currentSize;
                    /*
                     * Re-uploading a file that actually finished sending. `files` only
                     * records completed transfers, so an interrupted one leaves no entry
                     * and can be retried under the same name.
                     */
                    if(isFirstSlice && files[data.name]) {
                        socket.emit('already transfered');
                        return;
                    }
                    /* Forward slice to client */
                    socket.broadcast.emit('send slice', data);
                    /*
                     * File has completely been transfered. Recorded here rather than on
                     * the first slice, and checked after the broadcast rather than
                     * before it: the closing slice still has to reach the client.
                     */
                    if(data.offset >= data.size) {
                        files[data.name] = data.size;
                        return;
                    }
                    /* Delay of 1 second */
                    setTimeout(function () {
                        /* Request next slice */
                        socket.emit('request slice', data.name, data.offset);
                    }, 1000);
                });
                /* Admin request list of files shared */
                socket.on('get files', function () {
                    /* Emit shared files information */
                    socket.emit('shared files', files);
                });
                /* on disconnect */
                socket.on("disconnect", function () {
                    console.log("[SOCKET] => a user disconnected");
                });
            });
    },
}
