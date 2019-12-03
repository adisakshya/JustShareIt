$("#request_form").on("submit", function () {
    
  alert("Are you sure you want to send request for sharing?");
  let data = $('#request_form').serialize();
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
      // Store username in cookie
      let username = jQuery('input[name="username"]').val();
      setCookie("JustShareItUsername", username, 1);
  });

});

function refresh () {
  
  let username = getCookie("JustShareItUsername");
  if(!username) {
    return;
  }

  // alert("Welcome Back " + username);
  // alert("If you are approved by admin, then you will be directed to the dashboard!");
  var url = window.location.href;
  if (url.indexOf('?') > -1){
    url = url.slice(0, url.indexOf('?')+1);
    url += 'username=' + username;
  } else{
    url += '?username=' + username;
  }
  window.location.href = url;

}

// Check for admin approval in every 10 seconds
setTimeout(refresh,10000);