function PostAPI(input, url, processOutput) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            processOutput(json);
        }
    };
    var data = JSON.stringify(input);
    xhr.send(data);
}

function RedirectIfLogged() {
    PostAPI({}, "/getUser", (res) => {
        if(res.success === true) {
            window.location.replace("/dashboard.html");
        }
    })
}

function RedirectToLog() {
    PostAPI({}, "/getUser", (res) => {
        if(res.success === false) {
            window.location.replace("/login.html");
        }
    })
}

function LogOut() {
    PostAPI({},"/logout", console.log)
    window.location.assign("index.html");
}
