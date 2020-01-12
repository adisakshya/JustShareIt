var socket = io().connect();

socket.emit('create');

$('#fileinput').on('change', function () {

  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
    return;
  }   

  var input = document.getElementById('fileinput');
  
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
    
  file = input.files[0];
  var fileReader = new FileReader(), 
  slice = file.slice(0, 100000); 
  fileReader.readAsArrayBuffer(slice); 
  fileReader.onload = (event) => {
    var arrayBuffer = fileReader.result;
    socket.emit('slice', {
      name: file.name,
      type: file.type, 
      size: file.size, 
      data: arrayBuffer 
    });
    console.log({
      name: file.name,
      type: file.type, 
      size: file.size, 
      data: arrayBuffer 
    });
  }

  socket.on('request slice', (data) => { 
    var place = data.currentSlice * 100000, 
        slice = file.slice(place, place + Math.min(100000, file.size - place)); 
    
    fileReader.readAsArrayBuffer(slice); 
  });

});