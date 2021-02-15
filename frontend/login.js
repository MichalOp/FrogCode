function login() {
    var username = document.getElementById("username").value
    var pswd  = document.getElementById("pswd").value
    var dg = new Digest.SHA1();
    var pwdhash = dg.digest(pswd);
    const hashArray = Array.from(new Uint8Array(pwdhash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    postdir = {username: username, pwdhash: hashHex};
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
