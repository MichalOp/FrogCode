const params = new URLSearchParams(window.location.search)
const projectName = params.get("projectname")
console.log(projectName)

function ProcessProjectList(plist, pname) {
    var filetree = document.createElement("li");
    var node = document.createElement("span");
    node.classList.add("treenode");
    node.innerHTML = pname;
    filetree.appendChild(node);
    var children = document.createElement("ul");
    children.classList.add("nested");
    for (const value of plist) {
        if(value.type === "file") { //file
            var file = document.createElement("li");
            file.innerHTML = value.name;
            file.addEventListener("click", () => getFile(value.path));
            file.addEventListener("dblclick", OnDblClick);
            children.appendChild(file);
        } else if(value.type === "dir") {
            children.appendChild(ProcessProjectList(value.children, value.name));
        }
    }
    node.addEventListener("click", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("treenode-down");
    });

    node.addEventListener("dblclick", OnDblClick);
    filetree.appendChild(node);
    filetree.appendChild(children);
    return filetree;
}

function GenFileTree() {
    document.getElementById("filetree").innerHTML = "";
    data = {project: projectName};
    PostAPI(data, "/getTree", (res) =>{ console.log(res); RenderFileTree(res.tree)})
}

function RenderFileTree(plist) {
    console.log(plist);
    var treeview = document.createElement("ul");
    treeview.id = "myUL";
    treeview.appendChild(CreateAddFileButton());
    treeview.appendChild(CreateAddDirButton());
    treeview.appendChild(ProcessProjectList(plist.children, projectName));
    document.getElementById("filetree").appendChild(treeview);
}

function CreateAddFileButton() {
    var addButton = document.createElement("div");
    var fullPath = document.createElement("input");
    fullPath.type = "text";
    fullPath.id = "fullpathfile";
    var button = document.createElement("button");
    button.innerHTML = "Add File"
    var error = document.createElement("div");
    error.id = "addfileerror";
    button.addEventListener("click", () => {
        var fp = document.getElementById("fullpathfile");
        input = {project: projectName, path: fp.value};
        PostAPI(input, "/createFile", console.log);
        fp.value = "";
        GenFileTree();
    });
    addButton.appendChild(fullPath);
    addButton.appendChild(button);
    addButton.appendChild(document.createElement("br"));
    addButton.appendChild(error);
    return addButton;
}

function CreateAddDirButton() {
    var addButton = document.createElement("div");
    var fullPath = document.createElement("input");
    fullPath.type = "text";
    fullPath.id = "fullpathdir";
    var button = document.createElement("button");
    button.innerHTML = "Add Dir"
    var error = document.createElement("div");
    error.id = "adddirerror";
    button.addEventListener("click", () => {
        var fp = document.getElementById("fullpathdir");
        input = {project: projectName, path: fp.value};
        PostAPI(input, "/createDir", console.log);
        fp.value = "";
        GenFileTree();
    });
    addButton.appendChild(fullPath);
    addButton.appendChild(button);
    addButton.appendChild(document.createElement("br"));
    addButton.appendChild(error);
    return addButton;
}

function getFile(fullPath) {
    console.log("test");
    data = {project: projectName, path: fullPath};
    PostAPI(data, "/getObject", (res) => UpdateEditor(res, fullPath));
}

function UpdateEditor(value, fullPath) {
    if(value.type != "file") {
        console.log("syf");
        return;
    } else {
        editor = document.getElementById("editor");
        editor.value = value.data;
        document.getElementById("filesave").onclick = () => SaveCurrentFile(fullPath);
        document.getElementById("currentfile").innerHTML = "current file is " + fullPath;
    }
}

function SaveCurrentFile(fullPath) {
    data = {project: projectName, path: fullPath,
            text: document.getElementById("editor").value};
    PostAPI(data, "/writeFile", console.log);
}

function OnDblClick() {
    function ResetName() {
        this.parentNode.innerHTML=val;
    }

    function SetNewNameOnEnter(event) {
        if(event.key == "Enter") {
            event.preventDefault();
            var val=this.value;
            this.removeEventListener("blur", ResetName);
            this.parentNode.innerHTML=val;
        }
    }

    var val = this.innerHTML;
    var input = document.createElement("input");
    input.value = val;
    input.addEventListener("blur", ResetName);
    input.addEventListener("keyup", SetNewNameOnEnter);
    this.innerHTML="";
    this.appendChild(input);
    input.focus();
}

function StartTerminal() {
    var socket = io(location.hostname+':8099',{query:{project:projectName}})
    var term = new Terminal();
    term.open(document.getElementById('terminal'));
    socket.on('connect',function() {
        console.log('Client has connected to the server!');
    });

    socket.on('exit', function(data){
        term.write(data);
    })

    socket.on('message', function(data) {
        term.write(data);
    });

    term.onData(function(data) {
        socket.send(data);
    })
}

function LetTabbeTab() {
    document.getElementById("editor").addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = this.value.substring(0, start) +
                "    " + this.value.substring(end);

            // put caret at right position again
            this.selectionStart =
                this.selectionEnd = start + 4;
        }
    });
}
