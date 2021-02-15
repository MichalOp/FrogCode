var ptable = document.getElementById("projectTable");

function RefreshTable() {
    PostAPI({}, "/getProjects", RenderTable);
}

function RenderTable(resp) {
    ptable.innerHTML = "";
    resp.projects.forEach( (pname) => {
        var row = ptable.insertRow(-1);
        var cell1 = row.insertCell(0);
        var button = CreateProjectButton(pname);
        cell1.appendChild(button);
    });
}

function AddNewProject() {
    var data = {project: document.getElementById("pname").value}
    document.getElementById("pname").value = "";
    PostAPI(data, "createProject", console.log);
    RefreshTable();
}

function CreateProjectButton(projectName) {
    var button = document.createElement("button");
    button.type = "button";
    button.classList.add("projectButton");
    button.innerHTML = projectName;
    button.onclick = () => ProjectSelected(projectName);
    return button;
}

function ProjectSelected(projectName) {
    window.location.assign(`/editor.html?projectname=${projectName}`)
}
