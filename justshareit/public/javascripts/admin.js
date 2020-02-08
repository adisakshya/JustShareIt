/**
 * Drag & Drop Pen by Ushinro
 * https://codepen.io/Ushinro/pen/NPQzOx
 */

const socket = io().connect();

/* connect to socket server */
socket.emit('create');

socket.on('already transfered', function () {
	console.log("File already transfered!");
});

(function() {
	function Init() {
		var fileSelect = document.getElementById('file-upload'),
			fileDrag = document.getElementById('file-drag'),
			submitButton = document.getElementById('submit-button');

		fileSelect.addEventListener('change', fileSelectHandler, false);

		// File Drop
        fileDrag.addEventListener('dragover', fileDragHover, false);
        fileDrag.addEventListener('dragleave', fileDragHover, false);
        fileDrag.addEventListener('drop', fileSelectHandler, false);
		
	}

function parseFile(file, callback) {
    var fileSize   = file.size;
    var chunkSize  = 64 * 1024; // bytes
    var offset     = 0;
    var self       = this; // we need a reference to the current object
	var chunkReaderBlock = null;
	
    var readEventHandler = function(evt) {
        if (evt.target.error == null && evt.target.result.byteLength) {
            offset += evt.target.result.byteLength;
            callback(evt.target.result, file.name, file.type, file.size); // callback for handling read chunk
        } else {
            console.log("Read error: " + evt.target.error);
            return;
        }
        if (offset >= fileSize) {
            console.log("Done reading file");
            return;
        }

        // of to the next chunk
        chunkReaderBlock(offset, chunkSize, file);
    }

    chunkReaderBlock = function(_offset, length, _file) {
        let r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = readEventHandler;
        r.readAsArrayBuffer(blob);
    }

    // now let's start the read with the first block
    chunkReaderBlock(offset, chunkSize, file);
}

function fileDragHover(e) {
		var fileDrag = document.getElementById('file-drag');

		e.stopPropagation();
		e.preventDefault();
		
		fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
	}

	async function fileSelectHandler(e) {
		// Fetch FileList object
		var file = e.target.files;

		// Cancel event and hover styling
		fileDragHover(e);
		
		// Process all File objects
		for(let i=0; i<e.target.files.length; i++) {
			let file = e.target.files[i];
			parseFile(file, function (data, filename, filetype, filesize) {
		
				/* send slice to socket server */
				socket.emit('slice', {
					name: filename,
					type: filetype, 
					size: filesize, 
					data: data,
					currentSize: data.byteLength
				});
			
			});
		
			parseOutput(file);
		}
		
	}

	function parseOutput(file) {
		var html = `
        <div class="col-md-6 mb-4" style="min-width:100%;">
            <div class="card border-left-primary py-2">
                <div class="card-body">
                    <div class="row align-items-center no-gutters">
                        <div class="col mr-2">
                            <div class="text-dark font-weight-bold h5 mb-0">
                                <span>` + file.name + `</span>
                            </div>
                        </div>
                        <div class="col mr-2" style="text-align:right">
                            <div class="text-dark font-weight-bold h5 mb-0">
                                <span>` + (file.size / (1024 * 1024)).toFixed(2) + `&nbsp MB </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
		// var html =  '<div style="border:1px solid black; width:fit-content; padding:5px;"><strong>' + file.name + '</strong><p>' + (file.size / (1024 * 1024)).toFixed(2) + '&nbsp MB</p></div>';
		html = $.parseHTML( html);
		$("#file-zone").append(html);
	}
	    
    // Check for the various File API support.
    if (window.File && window.FileList && window.FileReader) {
        Init();
    } else {
        document.getElementById('file-drag').style.display = 'none';
    }

})();

function approveVisiter(visiterName) {
    
    var settings = {
      "async": false,
      "crossDomain": true,
      "method": "POST",
      "url": "/approve",
      "data": {"username": visiterName},
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      }
    }
  
    $.ajax(settings).done(function (response) {
      alert("User Approved!");
      location.reload();
      return false;
    });

}

function rejectVisiter(visiterName, token) {
    console.log(visiterName);
    var settings = {
      "async": false,
      "crossDomain": true,
      "method": "POST",
      "url": "/reject",
      "data": {"username": visiterName},
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      }
    }
  
    $.ajax(settings).done(function (response) {
      console.log(response);
      alert("User Rejected!");
      return false;
    });

}