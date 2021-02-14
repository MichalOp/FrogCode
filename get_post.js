var dbjs = require("./db.js");
var fsjs = require("./fs.js");

module.exports = function (app) {
  app.get("/", (req, res) => {
    res.render("index", { ok: "nie ok", current_code: "" });
  });

  app.get("/term", (req, res) => {
    res.render("term");
  });

  app.post("/authenticateUser", (req, res) => {
    console.log(req.body.username);
    console.log(req.body.pwdhash);

    dbjs
      .authenticateUser(req.body.username, req.body.pwdhash)
      .then((success) => {
        if (success) {
          req.session.userId = req.body.username;
          req.session.save();
        }
        res.json({ success: success });
      });
  });

  app.post("/createUser", (req, res) => {
    dbjs
      .createUser(req.body.displayname, req.body.username, req.body.pwdhash)
      .then((dbsuccess) => {
        var fssuccess = fsjs.createHomeDir(username);
        var success = dbsuccess && fssuccess;
        res.json({ success: success });
      });
  });

  app.post("/changePwd", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    dbjs.changePwd(username, req.body.newpwdhash).then((success) => {
      res.json({ success: success });
    });
  });

  app.post("/getObject", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    var obj = fsjs.getObject(username, req.body.project, req.body.path);
    res.json(obj);
  });

  app.post("/getProjects", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    projects = fsjs.getProjects(req.body.username);
    res.json({ projects: projects });
  });

  app.post("/writeFile", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    var success = fsjs.writeFile(
      username,
      req.body.project,
      req.body.path,
      req.body.text
    );
    res.json({ success: success });
  });

  app.post("/createProject", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    var success = fsjs.createProject(username, req.body.project);
    res.json({ success: success });
  });

  app.post("/createFile", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    var success = fsjs.createFile(username, req.body.project, req.body.path);
    res.json({ success: success });
  });

  app.post("/createDir", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    var success = fsjs.createDir(username, req.body.project, req.body.path);
    res.json({ success: success });
  });

  app.post("/renameFile", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    var success = fsjs.renameFile(
      username,
      req.body.project,
      req.body.path,
      req.body.newpath
    );
    res.json({ success: success });
  });

  app.post("/deleteFile", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    var success = fsjs.deleteFile(username, req.body.project, req.body.path);

    res.json({ success: success });
  });
};
