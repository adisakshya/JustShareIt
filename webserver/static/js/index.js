function deleteFile(filename) {
    
    alert("Are you sure you want to delete " + filename + " ?");
    var settings = {
      "async": false,
      "crossDomain": true,
      "method": "DELETE",
      "url": "/JustShareIt/admin/delete/file?filename="+filename,
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      }
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
      return false;
    });
}
