var fs = require("fs");
var sanitize = require("sanitize-filename");

function fishyPath(pathProject, path) {
  var areDotsOrSymlinks =
    fs.realpathSync(pathProject) + "/" + path !=
    fs.realpathSync(pathProject + "/" + path);

  return areDotsOrSymlinks;
  /* we should add here checking for weird characters */
}

function getObject(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  if (fishyPath(pathProject, path)) return "";
  var pathFull = pathProject + "/" + path;
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
  var pathProject = "./projects/" + username + "/" + project;
  if (fishyPath(pathProject, path)) return false;
  var pathFull = pathProject + "/" + path;
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
  if (fishyPath(pathProject, path)) return false;
  if (!fs.statSync(pathProject)) {
    fs.mkdirSync(pathProject);
    return true;
  }
  return false;
}

function createFile(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  if (fishyPath(pathProject, path)) return false;
  var pathFull = pathProject + "/" + path;
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
  if (fishyPath(pathProject, path)) return false;
  var pathFull = pathProject + "/" + path;
  if (fs.statSync(pathFull)) {
    fs.rename(pathFull, pathProject + "/" + newpath);
    return true;
  }
  return false;
}

function deleteFile(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  if (fishyPath(pathProject, path)) return false;
  var pathFull = pathProject + "/" + path;
  if (fs.statSync(pathFull)) {
    fs.unlink(pathFull);
    return true;
  }
  return false;
}
