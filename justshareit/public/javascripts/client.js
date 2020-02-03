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
      currentSize: 0,
};

/* slice received from server */
socket.on('send slice', function (data) {
    
    console.log("received slice", data);
    
    /* if file not already received */
    if (!files[data.name]) { 
        files[data.name] = Object.assign({}, struct, data); 
        files[data.name].data = []; 
        files[data.name].currentSize = 0;
    }
    
    /* save data and increment number of slices */
    files[data.name].data.push(data); 
    files[data.name].slice++;
    files[data.name].currentSize += data.currentSize;
    
    /* Progress */
    var progress = parseInt(100*(files[data.name].currentSize/files[data.name].size));
    console.log("Progress: ", progress);
    
    /* complete file received from server */
    if (files[data.name].currentSize == files[data.name].size) { 
        console.log("receive complete");

        /* initialize buffer */
        var buffer = [files[data.name].data[0].data];
        
        /* concatenate all file slices */
        for(var i=1; i<files[data.name].slice; i++) {
            buffer = Array.prototype.concat(buffer, files[data.name].data[i].data);
        }
        
        /* create file object */
        var file = new File(buffer, files[data.name].name);
        
        /* download file */
        var template = `
        <div class="col-md-6 col-xl-3 mb-4">
            <div class="card shadow border-left-primary py-2">
                <div class="card-body">
                    <div class="row align-items-center no-gutters">
                        <div class="col mr-2">
                            <div class="text-dark font-weight-bold h5 mb-0">
                                <span>` + files[data.name].name + `</span>
                                <br/>
                                <span>` + (file.size / (1024 * 1024)).toFixed(2) + `&nbsp MB </span>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        $('#file-zone').append(template);
        
        var link=document.createElement('a');
        link.href=window.URL.createObjectURL(file);
        link.download=files[data.name].name;
        link.click();        
    }
});