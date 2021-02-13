var ptable = document.getElementById("projectTable");

function refreshTable() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "ajax_test.txt", true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            putIntoTable(this.responseText);
        }
    }
    xhttp.send();
}

function putIntoTable() {

}
