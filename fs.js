var fs = require("fs");
var pathmodule = require("path");
var sanitize = require("sanitize-filename");

function fishyPath(pathProject, path) {
  if (path == ".") return false;
  if (path == "") return true;
  if (path.length >= 2 && path[0] == "." && path[1] == "/")
    return fishyPath(pathProject, path.slice(2));

  var fullPath = pathProject + "/" + path;

  var fpls = fullPath.split("/");
  var areSymlinks = false;
  var partPath = "";
  var broken = false;
  fpls.forEach((name) => {
    if (broken || areSymlinks) return;
    partPath += name;
    try {
      var stats = fs.lstatSync(partPath);
      if (stats.isSymbolicLink()) {
        areSymlinks = true;
        return;
      }
    } catch (error) {
      broken = true;
    }
    partPath += "/";
  });

  var areDots =
    pathmodule.resolve(pathProject) + "/" + path !=
    pathmodule.resolve(pathProject, path);

  return areDots || areSymlinks;
}

function fishyProject(project) {
  return project == "" || project != sanitize(project);
}

function convertObject(obj, name, path) {
  var result = {};
  result.name = name;
  result.type = obj.type;
  result.path = path;
  if (result.type != "dir") result.children = [];
  else result.children = obj.data;
  return result;
}

function getTreeAux(username, project, pathProject, name, path) {
  var nodeRaw = getObject(username, project, path);
  var node = convertObject(nodeRaw, name, path);
  var nodeRes = {};
  nodeRes.name = node.name;
  nodeRes.type = node.type;
  nodeRes.path = node.path;
  nodeRes.children = [];
  if (nodeRes.type != "dir") return nodeRes;
  node.children.forEach((child) => {
    nodeRes.children.push(
      getTreeAux(
        username,
        project,
        pathProject,
        child.name + "",
        path + "/" + child.name
      )
    );
  });
  return nodeRes;
}

function getTree(username, project) {
  if (fishyProject(project)) return { success: false, tree: "" };
  var pathProject = "./projects/" + username + "/" + project;
  var tree = getTreeAux(username, project, pathProject, ".", ".");
  return { success: true, tree: tree };
}

function getObject(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  if (fishyProject(project) || fishyPath(pathProject, path))
    return { type: "error", data: "fishy project/path" };
  var pathFull = pathProject + "/" + path;
  var stats;
  try {
    stats = fs.statSync(pathFull);
  } catch (error) {
    return { type: "error", data: "does not exist" };
  }
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
  if (fishyProject(project) || fishyPath(pathProject, path)) return false;
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
  if (fishyProject(project)) return false;
  var pathProject = "./projects/" + username + "/" + project;
  try {
    fs.statSync(pathProject);
    return false;
  } catch (error) {
    fs.mkdirSync(pathProject);
    return true;
  }
}

function createHomeDir(username) {
  var path = "./projects/" + username;
  try {
    fs.statSync(path);
    return false;
  } catch (error) {
    fs.mkdirSync(path);
    return true;
  }
}

function createFile(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  var pathFull = pathProject + "/" + path;
  if (fishyProject(project) || fishyPath(pathProject, path)) return false;
  try {
    fs.statSync(pathProject);
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

function createDir(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  var pathFull = pathProject + "/" + path;
  if (fishyProject(project) || fishyPath(pathProject, path)) return false;
  try {
    fs.statSync(pathProject);
  } catch (error) {
    console.log(error);
    return false;
  }
  try {
    fs.statSync(pathFull);
    return false;
  } catch (error) {
    fs.mkdirSync(pathFull);
    return true;
  }
}

function renameObject(username, project, path, newpath) {
  var pathProject = "./projects/" + username + "/" + project;
  if (
    fishyProject(project) ||
    fishyPath(pathProject, path) ||
    fishyPath(pathProject, newpath)
  )
    return false;
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

function deleteObject(username, project, path) {
  var pathProject = "./projects/" + username + "/" + project;
  if (fishyProject(project) || fishyPath(pathProject, path)) return false;
  var pathFull = pathProject + "/" + path;
  try {
    var stats = fs.statSync(pathFull);
    if (stats.isFile()) {
      deleteFile(pathFull);
      return true;
    } else if (stats.isDirectory()) {
      deleteDir(pathFull);
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function deleteFile(path) {
  fs.unlinkSync(path);
}

function deleteDir(path) {
  try {
    fs.statSync(path);
    fs.rmdirSync(path, { recursive: true });
    return true;
  } catch (error) {
    return false;
  }
}

function deleteUser(username) {
  return deleteDir("./projects/" + username);
}

function deleteProject(username, project) {
  if (fishyProject(project)) return false;
  return deleteDir("./projects/" + username + "/" + project);
}

module.exports = {
  fishyProject,
  fishyPath,
  getObject,
  getProjects,
  writeFile,
  createProject,
  createFile,
  renameObject,
  createDir,
  createHomeDir,
  deleteObject,
  deleteUser,
  deleteProject,
  getTree,
};
