function signup() {
    var displayname = document.getElementById("displayname").value
    var username = document.getElementById("username").value
    var pswd  = document.getElementById("pswd").value
    var cpswd = document.getElementById("cpswd").value

    if(pswd != cpswd) {
        var error = document.getElementById("error");
        error.innerHTML = "Passwords don't match";
        return;
    }

    var dg = new Digest.SHA1();
    var pwdhash = dg.digest(pswd);
    const hashArray = Array.from(new Uint8Array(pwdhash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    postdir = {username: username, displayname: displayname,
               pwdhash: hashHex};
    PostAPI(postdir, "/createUser", ProcessServerSignUp)
}

function ProcessServerSignUp(status) {
    if(status.success === true) {
        window.location.assign("./successfullsignup.html");
    } else {
        var error = document.getElementById("error");
        error.innerHTML = "Something XD";
    }
}
