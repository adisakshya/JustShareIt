var socket = io().connect();

socket.emit('create');

var files = {}, 
  struct = { 
      name: null, 
      type: null, 
      size: 0, 
      data: [], 
      slice: 0, 
};

socket.on('send slice', function (data) {
    console.log("received slice");
    if (!files[data.name]) { 
        files[data.name] = Object.assign({}, struct, data); 
        files[data.name].data = []; 
    }
    
    //convert the ArrayBuffer to Buffer 
    // data.data = new Uint8Array(data.data); 
    //save the data 
    files[data.name].data.push(data); 
    files[data.name].slice++;
    
    if (files[data.name].slice * 100000 >= files[data.name].size) { 
        console.log("receive complete");
        console.log("Files Data:", files[data.name]);
        var file = new File(files[data.name].data, files[data.name].name);
        console.log("File:", file);
        var link=document.createElement('a');
        link.href=window.URL.createObjectURL(file);
        link.download=files[data.name].name;
        link.click();        
    }
});