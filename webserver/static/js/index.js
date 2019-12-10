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

function change_password() {

  let old_password = $("#old_password").val();
  let new_password = $("#new_password").val();
  let confirm_password = $("#confirm_password").val();

  let data = {
    "old_password" : old_password,
    "new_password" : new_password,
    "confirm_password" : confirm_password
  }

  var settings = {
    "async": false,
    "crossDomain": true,
    "method": "POST",
    "data" : data,
    "url": "/JustShareIt/admin/change/password",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache"
    }
  }

  $.ajax(settings).done(function (response) {
    alert("If the password is successfully changed then you will redirected to the login page!");
  });
}

$("#password_form").on("submit", function () {

  let new_password = $("#new_password").val();
  let confirm_password = $("#confirm_password").val();

  if(new_password != confirm_password) {
    alert("Confirmed Password Mismatch!");
    return false;
  }

})

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