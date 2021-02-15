function signup() {
    var displayname = document.getElementById("displayname").value
    var username = document.getElementById("username").value
    var pswd  = document.getElementById("pswd").value
    var cpswd = document.getElementById("cpswd").value
    //some sort of logic like hashing and posting
    postdir = {username: username, displayname: displayname,
               pwdhash: pswd};
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
