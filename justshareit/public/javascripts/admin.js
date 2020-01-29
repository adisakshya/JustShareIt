/**
 * Drag & Drop Pen by Ushinro
 * https://codepen.io/Ushinro/pen/NPQzOx
 */

const socket = io().connect();

/* connect to socket server */
socket.emit('create');

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
		var file = e.target.files[0];

		// Cancel event and hover styling
		fileDragHover(e);

	// Process all File objects
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

	function output(msg) {
		var m = document.getElementById('messages');
		m.innerHTML = msg;
	}

	function parseOutput(file) {
		output(
			'<ul>'
			+	'<li>Name: <strong>' + file.name + '</strong></li>'
			+	'<li>Type: <strong>' + file.type + '</strong></li>'
			+	'<li>Size: <strong>' + (file.size / (1024 * 1024)).toFixed(2) + ' MB</strong></li>'
			+ '</ul>'
		);
	}

	// function uploadFile(file) {
            
	// 	/* create file-reader object */
	// 	let fileReader = new FileReader();

	// 	/* define slice */
	// 	let slice = file.slice(0, 100000); 

	// 	/* read file in slices asarray-buffer */
	// 	fileReader.readAsArrayBuffer(slice); 
	// 	fileReader.onload = () => {
	// 		let arrayBuffer = fileReader.result;
	// 		console.log("File: ", file);
			// /* send slice to socket server */
			// socket.emit('slice', {
			// 	name: file.name,
			// 	type: file.type, 
			// 	size: file.size, 
			// 	data: arrayBuffer,
			// 	currentSize: event.target.result.byteLength
			// });
	// 	}

	// 	/* on slice request from server */
	// 	socket.on('request slice', (data) => { 
			
	// 		if(data.currentSlice * 100000 >= file.size) {
	// 			return;
	// 		};

	// 		let place = data.currentSlice * 100000, 
	// 			slice = file.slice(place, place + Math.min(100000, file.size - place)); 

	// 		fileReader.readAsArrayBuffer(slice); 
	// 	});

	// 	socket.on('upload complete', (filename) => {
	// 		console.log(filename, " transfered!");
	// 	});
  
	// }
    
    // Check for the various File API support.
    if (window.File && window.FileList && window.FileReader) {
        Init();
    } else {
        document.getElementById('file-drag').style.display = 'none';
    }

})();