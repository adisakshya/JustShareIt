var socket = io().connect();

function add(text) {
    var element = document.createElement("input");
    //Assign attributes to the element. 
    element.type = 'button';
    element.value = 'button';
    element.name = 'button';
    element.onclick = function() {
        var filename = "hello.pdf";
        download(filename, text);
    };
  
    var downloadFields = document.getElementById("downloadFields");
    //Append the element in page (in span).  
    downloadFields.appendChild(element);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', text);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

socket.on('image_src', function (result) {

    // 1. Create Download Button
    add(result);

});