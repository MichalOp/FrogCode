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
      .createUser(
        req.body.displayname,
        req.body.username,
        req.body.pwdhash,
        (verbose = true)
      )
      .then((dbsuccess) => {
        var fssuccess = false;
        if (dbsuccess) fssuccess = fsjs.createHomeDir(req.body.username);
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

    projects = fsjs.getProjects(username);
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

  app.post("/deleteObject", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    var success = fsjs.deleteObject(username, req.body.project, req.body.path);

    res.json({ success: success });
  });

  app.post("/deleteProject", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    var success = fsjs.deleteProject(username, req.body.project);

    res.json({ success: success });
  });

  app.post("/deleteUser", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }

    var username = req.session.userId;

    dbjs.deleteUser(username, (verbose = true)).then((dbsuccess) => {
      var fssuccess = false;
      if (dbsuccess) fssuccess = fsjs.deleteUser(username);
      console.log(dbsuccess);
      console.log(fssuccess);
      var success = dbsuccess && fssuccess;
      if (success) req.session.destroy();
      res.json({ success: success });
    });
  });

  app.post("/logout", (req, res) => {
    if (!req.session || !req.session.userId) {
      res.json({ success: false, reason: "bad session id" });
      return;
    }
    req.session.destroy();
    res.json({ success: true });
  });
};
