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
            children.appendChild(file);
        } else { //dictionary
            children.appendChild(ProcessProjectList(value, key));
        }
    }
    node.addEventListener("click", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("treenode-down");
    });
    filetree.appendChild(node);
    filetree.appendChild(children);
    return filetree;
}

function RenderFileTree(plist, pname) {
    var treeview = document.createElement("ul");
    treeview.id = "myUL";
    treeview.appendChild(ProcessProjectList({"file1": null, "dir1": {"file2": null, "file3": null}, "dir2": {"file4": null, "file5": null}, "file6": null}, pname));
    document.getElementById("filetree").appendChild(treeview);
}
