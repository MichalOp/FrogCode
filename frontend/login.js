function login() {
    var username = document.getElementById("username").value
    var pswd  = document.getElementById("pswd").value
    //some sort of logic like hashing and posting
    postdir = {username: username, pwdhash: pswd};
    PostAPI(postdir, "/authenticateUser", ProcessServerLogin);
}

function ProcessServerLogin(status) {
    if(status.success === true) {
        window.location.assign("./dashboard.html");
    } else {
        var error = document.getElementById("error");
        error.innerHTML = "Incorrect username or password";
    }
}
