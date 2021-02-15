function changePassword() {
    var oldpass = document.getElementById("pswd").value;
    var newpass = document.getElementById("npswd").value;
    var cnewpass = document.getElementById("cnpswd").value;
    if(newpass != cnewpass) {
        document.getElementById("error").innerHTML = "Passwords don't match"
    }
    console.log(oldpass);
    console.log(newpass);
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
