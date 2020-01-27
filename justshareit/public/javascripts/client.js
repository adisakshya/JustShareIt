var socket = io().connect();

/* connect to socket server */
socket.emit('create');

var files = {}, 
  struct = { 
      name: null, 
      type: null, 
      size: 0, 
      data: [], 
      slice: 0, 
};

/* slice received from server */
socket.on('send slice', function (data) {
    
    console.log("received slice");
    
    /* if file not already received */
    if (!files[data.name]) { 
        files[data.name] = Object.assign({}, struct, data); 
        files[data.name].data = []; 
    }
    
    /* save data and increment number of slices */
    files[data.name].data.push(data); 
    files[data.name].slice++;
    
    /* complete file received from server */
    if (files[data.name].slice * 100000 >= files[data.name].size) { 
        console.log("receive complete");

        /* initialize buffer */
        var buffer = files[data.name].data[0].data;
        
        /* concatenate all file slices */
        for(var i=1; i<files[data.name].slice; i++) {
            buffer = Array.prototype.concat(buffer, files[data.name].data[i].data);
        }
        
        /* create file object */
        var file = new File(buffer, files[data.name].name);
        
        /* download file */
        var link=document.createElement('a');
        link.href=window.URL.createObjectURL(file);
        link.download=files[data.name].name;
        link.click();        
    }
});