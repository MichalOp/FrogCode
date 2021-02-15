var ptable = document.getElementById("projectTable");

function RefreshTable() {
    PostAPI({}, "/getProjects", RenderTable);
}

function RenderTable(resp) {
    ptable.innerHTML = "";
    resp.projects.forEach( (pname) => {
        var row = ptable.insertRow(-1);
        var cell1 = row.insertCell(0);
        cell1.appendChild(CreateProjectButton(pname));
        var cell2 = row.insertCell(1);
        cell2.appendChild(CreateProjectDeleteButton(pname));
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

function CreateProjectDeleteButton(projectName) {
    var button = document.createElement("button");
    button.type = "button";
    button.innerHTML = "kosz";
    button.onclick = () => {
        var data = {project: projectName};
        PostAPI(data, "/deleteProject", () => RefreshTable());
    }
    return button;
}

function ProjectSelected(projectName) {
    window.location.assign(`/editor.html?projectname=${projectName}`)
}
