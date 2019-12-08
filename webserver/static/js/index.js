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

function approveVisiter(visiterName) {
    
  alert("Are you sure you want to approve access for " + visiterName + " ?");
  var settings = {
    "async": false,
    "crossDomain": true,
    "method": "PUT",
    "url": "/JustShareIt/admin/approve/user?username="+visiterName,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache"
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    alert("User Approved, refresh page to see updated status!");
    return false;
  });
}

function rejectVisiter(visiterName) {
    
  alert("Are you sure you want to reject request from " + visiterName + " ?");
  var settings = {
    "async": false,
    "crossDomain": true,
    "method": "DELETE",
    "url": "/JustShareIt/admin/reject/user?username="+visiterName,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache"
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    alert("User Rejected, refresh page to see updated status!");
  });
}

function checkFileNotFound() {
  let url_string = window.location.href;
  let url = new URL(url_string);
  let c = url.searchParams.get("file_not_found");
  if(c) {
    alert("File Not Found!");
    let index = url_string.indexOf("?");
    window.location.href = url_string.slice(0, index);
  }
}

checkFileNotFound();