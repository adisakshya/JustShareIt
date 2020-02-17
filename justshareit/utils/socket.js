/* Define file structure */
var files = {};

module.exports = {
    /**
     * Real-time, bidirectional and event-based communication
     * @param {object} io 
     */
    start: function(io) {
        /* On Connection */
        io.on('connection', function (socket) {
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
