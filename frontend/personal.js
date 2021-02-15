function changePassword() {
    var oldpass = document.getElementById("pswd");
    var newpass = document.getElementById("npswd");
    var cnewpass = document.getElementById("cnpswd");
    if(newpass != cnewpass) {
        document.getElementByID("error").innerHTML = "Passwords don't match"
    }
    //data = {..}
    PostAPI({}, "\changePwd", console.log);
}

function deleteAccount() {
    PostAPI({}, "/deleteUser", console.log);
}
