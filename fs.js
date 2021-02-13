var fs = require("fs");

function getObject(username, project, path) {
  var pathFull = "./projects/" + username + "/" + project + "/" + path;
  var stats = fs.statSync(pathFull);
  if (stats.isFile()) return readFile(pathFull);
  else if (stats.isDirectory()) return readDir(pathFull);
}

function readFile(pathFull) {
  return fs.readFileSync(pathFull);
}

function readDir(pathFull) {
  return fs.readdirSync(pathFull, { withFileTypes: true });
}

function getProjects(username) {
  return fs.readdirSync("./projects/" + username + "/");
}

function writeFile(username, project, path, text) {
  var pathFull = "./projects/" + username + "/" + project + "/" + path;
  if (fs.statSync(pathFull)) {
    fs.writeFileSync(pathFull, text, {
      encoding: "utf8",
      flag: "w",
    });
    return true;
  }
  return false;
}

function createProject(username, project) {
  var pathProject = "./projects/" + username + "/" + project;
  if (!fs.statSync(pathProject)) {
    fs.mkdirSync(pathProject);
    return true;
  }
  return false;
}

function createFile(username, project, path) {
  var pathFull = "./projects/" + username + "/" + project + "/" + path;
  if (!fs.statSync(pathFull)) {
    fs.writeFileSync(pathFull, "", text, {
      encoding: "utf8",
      flag: "w",
    });
    return true;
  }
  return false;
}

function renameFile(username, project, path, newpath) {
  var pathProject = "./projects/" + username + "/" + project;
  var pathFull = "./projects/" + username + "/" + project + "/" + path;
  if (fs.statSync(pathFull)) {
    fs.rename(pathFull, pathProject + "/" + newpath);
    return true;
  }
  return false;
}

function deleteFile(username, project, path) {
  var pathFull = "./projects/" + username + "/" + project + "/" + path;
  if (fs.statSync(pathFull)) {
    fs.unlink(pathFull);
    return true;
  }
  return false;
}
