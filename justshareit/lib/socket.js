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
                    /* File hasn't been shared yet */
                    if(!files[data.name]) {
                        files[data.name] = data.size;
                    }
                    /* File has completely been transfered */
                    if(data.size < data.offset) {
                        return;
                    }
                    /* Forward slice to client */
                    socket.broadcast.emit('send slice', data);
                    /* Delay of 1 second */
                    setTimeout(function () {}, 1000);
                    /* Request next slice */
                    socket.emit('request slice', data.name, data.offset);
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
