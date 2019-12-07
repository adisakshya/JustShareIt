// Handle User Request to enable sharing
$("#request_form").on("submit", function () {
    
  alert("Are you sure you want to send request for sharing?");
  let data = $('#request_form').serialize();
  var settings = {
    "async": false,
    "crossDomain": true,
    "method": "POST",
    "data" : data,
    "url": "/JustShareIt/user/register",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache"
    }
  }

  $.ajax(settings).done(function (response) {
      // Store username in cookie
      let username = jQuery('input[name="username"]').val();
      setCookie("JustShareItUsername", username, 1);
  });

});

// Replace content of page
function ReplaceContent(new_content) {

  document.open();
  document.write(new_content);
  document.close();

}

// Refresh Page Contents
function refresh () {
  
  let username = getCookie("JustShareItUsername");
  if(!username) {
    return;
  }

  let data = {
    "username" : username
  }
  
  var settings = {
    "async": false,
    "crossDomain": true,
    "method": "POST",
    "data" : data,
    "url": "/JustShareIt",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache"
    }
  }

  $.ajax(settings).done(function (response) {
      ReplaceContent(response);
  });

}

// Check for admin approval in every 10 seconds
setTimeout(refresh,10000);