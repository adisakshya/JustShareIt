var socket = io().connect();

$(function () {
    
    socket.emit('create');
    
});