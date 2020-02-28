( function () {
    
    /* Extract username from session */
    var username = sessionStorage.getItem("SessionName");
    if(username) {
        $("#welcome").text("Welcome " + username + "!");
    } else {
        alert("No username detected.");
        /* Redirect to login page */
        window.location.href = '/';
    }
    
    /* Connect using socket */
    var socket = io().connect();
    socket.on('connect', () => {
        socket
            /**
             * Authenticate Connection Request
             */
            .emit('authenticate', { token: sessionStorage.getItem("SessionToken") })
            /**
             * If connection is authenticated then start event-based communication
             */
            .on('authenticated', () => {
                /* Emit create */
                socket.emit('create');

                /* Define file structure */
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

                    /* Update file description on dashboard */
                    var temp = document.getElementById(data.name.replace(/ /g,''));
                    if(!temp) {
                        var template = `
                        <div class="col-md-6 mb-4" style="min-width:100%;>
                            <div class="card border-left-primary py-2">
                                <div class="card-body">
                                    <div class="row align-items-center no-gutters">
                                        <div class="col mr-2">
                                            <div class="text-dark font-weight-bold h5 mb-0">
                                                <span>` + files[data.name].name + `</span>
                                            </div>
                                        </div>
                                        <div class="col mr-2" style="text-align:right">
                                            <div class="text-dark font-weight-bold h5 mb-0">
                                                <span>` + (files[data.name].size / (1024 * 1024)).toFixed(2) + `&nbsp MB </span>
                                            </div>
                                        </div>
                                    </div>
                                    <label id="` + data.name.replace(/ /g,'') + `-label" for=` + data.name.replace(/ /g,'') + `>` + progress + `%</label>
                                    <progress style="width:100%" id="` + data.name.replace(/ /g,'') + `" value="` + progress + `" max="100"></progress>
                                </div>
                            </div>
                        </div>`;
                        $('#file-zone').append(template);
                    } else {
                        document.getElementById(data.name.replace(/ /g,'')).value = progress;
                        document.getElementById(data.name.replace(/ /g,'')+'-label').innerHTML = progress.toString() + '%';
                    }
                    
                    /* complete file received from server */
                    if (files[data.name].currentSize == files[data.name].size) {

                        /* initialize buffer */
                        var buffer = [files[data.name].data[0].data];
                        
                        /* concatenate all file slices */
                        for(var i=1; i<files[data.name].slice; i++) {
                            buffer = Array.prototype.concat(buffer, files[data.name].data[i].data);
                        }
                        
                        /* create file object */
                        var file = new File(buffer, files[data.name].name);
                        
                        /* Increment received files & data */
                        var received = parseFloat(document.getElementById("received").innerHTML) + parseFloat((file.size / (1024 * 1024)).toFixed(2));
                        document.getElementById("received").innerHTML = received;

                        document.getElementById("files").innerHTML = parseInt(document.getElementById("files").innerHTML)+1;
                        
                        if(files[data.name].size >= 1000000000) {
                            alert("File size to big to handle by your browser!");
                            return;
                        }

                        /* Download File */
                        var link=document.createElement('a');
                        link.href=window.URL.createObjectURL(file);
                        link.download=files[data.name].name;
                        link.click();        
                        delete files[data.name];
                    }
                });
            })
            /**
             * If connection is unauthorized then redirect to client login
             */
            .on('unauthorized', (msg) => {
                sessionStorage.removeItem("SessionName")
                sessionStorage.removeItem("SessionToken")
                window.location.href = '/';
            })
    });
})();