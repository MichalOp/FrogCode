var http = require("http");
var express = require("express");
const session = require("express-session");
var dbjs = require("./db.js");
var fsjs = require("./fs.js");
var pwdjs = require("./pwd.js");

var app = express();
server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/node_modules", express.static("./node_modules"));
app.use(express.urlencoded({ extended: true }));

const sessionParser = session({
  saveUninitialized: false,
  secret: "$eCuRiTy",
  resave: false,
});

app.use(sessionParser);

app.get("/", (req, res) => {
  res.render("index", { ok: "nie ok", current_code: "" });
});

app.post("/authenticateUser", (req, res) => {
  console.log(req.body.username);
  console.log(req.body.pwdhash);

  dbjs.authenticateUser(req.body.username, req.body.pwdhash).then((success) => {
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
    .then((success) => {
      res.json({ success: success });
    });
});

app.post("/changePwd", (req, res) => {
  if (req.session.userId != req.body.username) {
    res.json({ success: false, reason: "bad session id" });
    return;
  }

  dbjs.changePwd(req.body.username, req.body.pwdhash).then(() => {
    res.json({ success: true });
  });
});

app.post("/getObject", (req, res) => {
  if (req.session.userId != req.body.username) {
    res.json({ success: false, reason: "bad session id" });
    return;
  }

  var obj = fsjs.getObject(req.body.username, req.body.project, req.body.path);
  res.json(obj);
});

app.post("/getProjects", (req, res) => {
  if (req.session.userId != req.body.username) {
    res.json({ success: false, reason: "bad session id" });
    return;
  }

  projects = fsjs.getProjects(req.body.username);
  res.json({ projects: projects });
});

app.post("/writeFile", (req, res) => {
  if (req.session.userId != req.body.username) {
    res.json({ success: false, reason: "bad session id" });
    return;
  }

  var success = fsjs.writeFile(
    req.body.username,
    req.body.project,
    req.body.path,
    req.body.text
  );
  res.json({ success: success });
});

app.post("/createProject", (req, res) => {
  if (req.session.userId != req.body.username) {
    res.json({ success: false, reason: "bad session id" });
    return;
  }

  var success = fsjs.createProject(req.body.username, req.body.project);
  res.json({ success: success });
});

app.post("/createFile", (req, res) => {
  if (req.session.userId != req.body.username) {
    res.json({ success: false, reason: "bad session id" });
    return;
  }

  var success = fsjs.createFile(
    req.body.username,
    req.body.project,
    req.body.path
  );
  res.json({ success: success });
});

app.post("/renameFile", (req, res) => {
  if (req.session.userId != req.body.username) {
    res.json({ success: false, reason: "bad session id" });
    return;
  }

  var success = fsjs.renameFile(
    req.body.username,
    req.body.project,
    req.body.path,
    req.body.newpath
  );
  res.json({ success: success });
});

app.post("/deleteFile", (req, res) => {
  if (req.session.userId != req.body.username) {
    res.json({ success: false, reason: "bad session id" });
    return;
  }

  var success = fsjs.deleteFile(
    req.body.username,
    req.body.project,
    req.body.path
  );

  res.json({ success: success });
});

server.listen(8099);
