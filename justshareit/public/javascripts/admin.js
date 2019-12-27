var socket = io().connect();

socket.emit('create');

function handleFile() {               
    
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }   

    input = document.getElementById('fileinput');
    
    if (!input) {
      alert("Couldn't find the fileinput element.");
    } else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");               
    } else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsDataURL(file);
    }

}

function receivedText() {
    document.getElementById('editor').appendChild(document.createTextNode(fr.result));
    $("#image").attr("src", fr.result);
    socket.emit('file', fr.result);
}   