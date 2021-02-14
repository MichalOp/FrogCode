var fs = require("fs");
var sanitize = require("sanitize-filename");
var pathmodule = require("path");

function fishyPath(pathProject, path) {
  var areDotsOrSymlinks =
    pathmodule.resolve(pathProject) + "/" + path !=
    pathmodule.resolve(pathProject, path);

  return areDotsOrSymlinks;
  /* we should add here checking for weird characters */
}

function getObject(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  if (fishyPath(pathProject, path)) return { type: "error", data: "" };
  var pathFull = pathProject + "/" + path;
  var stats = fs.statSync(pathFull);
  if (stats.isFile()) return { type: "file", data: readFile(pathFull) + "" };
  else if (stats.isDirectory()) return { type: "dir", data: readDir(pathFull) };
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
  try {
    fs.statSync(pathFull);
    fs.writeFileSync(pathFull, text, {
      encoding: "utf8",
      flag: "w",
    });
    return true;
  } catch (error) {
    return false;
  }
}

function createProject(username, project) {
  var pathProject = "./projects/" + username + "/" + project;
  try {
    fs.statSync(pathProject);
    return false;
  } catch (error) {
    fs.mkdirSync(pathProject);
    return true;
  }
}

function createFile(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  var pathFull = pathProject + "/" + path;
  try {
    fs.statSync(pathProject);
    if (fishyPath(pathProject, path)) return false;
  } catch (error) {
    console.log(error);
    return false;
  }
  try {
    fs.statSync(pathFull);
    return false;
  } catch (error) {
    fs.writeFileSync(pathFull, "", {
      encoding: "utf8",
      flag: "w",
    });
    return true;
  }
}

function renameFile(username, project, path, newpath) {
  var pathProject = "./projects/" + username + "/" + project;
  if (fishyPath(pathProject, path)) return false;
  var pathFull = pathProject + "/" + path;
  try {
    fs.statSync(pathProject + "/" + newpath);
    return false;
  } catch (error) {}

  try {
    fs.statSync(pathFull);
    fs.renameSync(pathFull, pathProject + "/" + newpath);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function deleteFile(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  if (fishyPath(pathProject, path)) return false;
  var pathFull = pathProject + "/" + path;
  try {
    fs.statSync(pathFull);
    fs.unlinkSync(pathFull);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  getObject,
  getProjects,
  writeFile,
  createProject,
  createFile,
  renameFile,
  deleteFile,
};
