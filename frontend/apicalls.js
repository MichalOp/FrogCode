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
