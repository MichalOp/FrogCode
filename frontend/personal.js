function changePassword() {
    var oldpass = document.getElementById("pswd");
    var newpass = document.getElementById("npswd");
    var cnewpass = document.getElementById("cnpswd");
    if(newpass != cnewpass) {
        document.getElementByID("error").innerHTML = "Passwords don't match"
    }
    data = {oldpwdhash: getHash(oldpass), newpwdhash: getHash(newpass)}
    PostAPI(data, "/changePwd", console.log);
}

function deleteAccount() {
    PostAPI({}, "/deleteUser", console.log);
}

function getHash(pswd) {
    var dg = new Digest.SHA1();
    var pwdhash = dg.digest(pswd);
    const hashArray = Array.from(new Uint8Array(pwdhash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
