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
    for (let key in plist) {
        let value = plist[key];
        if(value === null) { //file
            var file = document.createElement("li");
            file.innerHTML = key;
            file.addEventListener("dblclick", OnDblClick);
            children.appendChild(file);
        } else { //dictionary
            children.appendChild(ProcessProjectList(value, key));
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

function RenderFileTree(plist) {
    var treeview = document.createElement("ul");
    treeview.id = "myUL";
    treeview.appendChild(ProcessProjectList({"file1": null, "dir1": {"file2": null, "file3": null}, "dir2": {"file4": null, "file5": null}, "file6": null}, projectName));
    document.getElementById("filetree").appendChild(treeview);
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
    console.log("hello?");
    var socket = io(location.hostname+':8099',{query:{project:"testProject"}})
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
