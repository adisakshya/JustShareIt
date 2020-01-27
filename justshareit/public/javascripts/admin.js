var socket = io().connect();

/* connect to socket server */
socket.emit('create');

/* on new file uplaod */
$('#fileinput').on('change', function () {

  /* check if file API is supported */
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
    return;
  }   

  /* select input field */
  var input = document.getElementById('fileinput');
  
  /* validate input fields */
  if (!input) {
    alert("Couldn't find the fileinput element.");
    return;
  } else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
    return;
  } else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");               
    return;
  } 
    
  /* fetch file */
  file = input.files[0];
  
  /* create file-reader object */
  var fileReader = new FileReader(), 
  
  /* define slice */
  slice = file.slice(0, 100000); 
  
  /* read file in slices asarray-buffer */
  fileReader.readAsArrayBuffer(slice); 
  fileReader.onload = (event) => {
    var arrayBuffer = fileReader.result;
    
    /* send slice to socket server */
    socket.emit('slice', {
      name: file.name,
      type: file.type, 
      size: file.size, 
      data: arrayBuffer 
    });
  }

  /* on slice request from server */
  socket.on('request slice', (data) => { 
    var place = data.currentSlice * 100000, 
        slice = file.slice(place, place + Math.min(100000, file.size - place)); 
    
    fileReader.readAsArrayBuffer(slice); 
  });

});