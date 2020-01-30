$("#request_form").on("submit", function () {
    
    event.preventDefault();
    
    let data = $('#request_form').serialize();
    $.ajax({
        url: "/request",
        async: true,
        crossDomain: true,
        cors: true,
        method: "POST",
        data : data,
        dataType: 'json',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache"
        },
        success: function(response) {
            if(response.success && response.error === false) {
                var html = '<a class="btn btn-info btn-lg" role="button" data-toggle="modal" href="#" id="access_granted">Access Requested</a><p>You will be redirected to dashboard, once admin approves your request!</p>';
                html = $.parseHTML(html);
                $("#request-section").html(html);
                $("#login").modal("hide");
                sessionStorage.SessionName = response.message.username;
            } else {
                alert(response.message);
            }
        }
    });

});

(function verify() {
    var username = sessionStorage.getItem("SessionName");
    if(username) {
        $.ajax({
            url: "/verify",
            async: false,
            crossDomain: true,
            cors: true,
            method: "POST",
            data : {"username": sessionStorage.getItem("SessionName")},
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache"
            },
            success: async function(response) {
                if(response.success && !response.error && !response.message.verified) {
                }
                if (!response.success && response.error) {
                    sessionStorage.removeItem("SessionName");
                }
                if(response.success && !response.error && response.message.verified && response.message.token) {
                    var html = '<form action="/client" method="post"><input type="text" name="token" value="' + response.message.token + '" hidden /><input id="index-form" type="submit" class="btn btn-success" value="Request Approved"></form>'
                    html = $.parseHTML(html);
                    $("#request-section").html(html);
                    $("#index-form").trigger("click");
                    return;
                }
                setTimeout(verify, 5000);
            }
        })
    } else {
        setTimeout(verify, 5000);
    }
})();