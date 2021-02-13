var ptable = document.getElementById("projectTable");

function RefreshTable() {
    let tableContent = GetTableFromServer();
    RenderTable(tableContent);
}

function GetTableFromServer() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        if(xhttp.status === 200) {
            let response = this.responseText;
            return response;
        }
    }
    xhttp.open("GET", "ajax_test.txt", true);
    xhttp.send();
}

function RenderTable() {
    ptable.innerHTML = "";
    var row = ptable.insertRow(0);
    var cell1 = row.insertCell(0);
    var data = "oldProject";
    var button = CreateProjectButton(data);
    cell1.appendChild(button);
}

function AddNewProject() {
    var data = document.getElementById("pname").value
    document.getElementById("pname").value = "";
    console.log(data)
    var row = ptable.insertRow(1);
    var cell1 = row.insertCell(0);
    cell1.appendChild(CreateProjectButton(data))
    //push data into server
    //RefreshTable();
}

function CreateProjectButton(projectName) {
    var button = document.createElement("button");
    button.type = "button";
    button.innerHTML = projectName;
    button.onclick = () => ProjectSelected(projectName);
    return button;
}

function ProjectSelected(projectName) {
    console.log("I'm here boy")
    console.log(projectName)
}

