function signup() {
    var email = document.getElementById("email").value
    var pswd  = document.getElementById("pswd").value
    var cpswd = document.getElementById("cpswd").value
    //some sort of logic like hashing and posting
    console.log(email,pswd,cpswd)

    window.location.replace("successfullsignup.html")
}
