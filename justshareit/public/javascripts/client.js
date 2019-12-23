var socket = io().connect();

$(function () {
    
    var imgChunks = [];

    // socket.emit('create');

    socket.on('image', function (chunk) {
        var img = document.getElementById('img-stream2');
        imgChunks.push(chunk);
        img.setAttribute('src', 'data:image/jpeg;base64,' + window.btoa(imgChunks));
    });
    
});