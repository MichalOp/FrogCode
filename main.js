var http = require("http");
var express = require("express");
//var multer = require('multer');
//var upload = multer({ dest: './data' })
var app = express();
var fs = require("fs");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { ok: "Type in your name (for example ../../..)" });
});

// app.post('/u', upload.single('file'), (req, res) => {
//     console.log(req.file);
//     res.render('index', { ok:"ok" });
// });

username = "nouser"; //brilliant

app.post("/codesubmit", (req, res) => {
  //console.log(req.body.code);
  username = req.body.code;

  userdirs = fs.readdirSync("./" + username, { withFileTypes: true });
  console.log("Read dir: " + userdirs);
  res.render("index", { ok: userdirs });
});

app.get("/file/:name", function (req, res) {
  var fileName = req.params.name;
  console.log("Read file: " + fileName);
  res.sendFile(__dirname + "/" + fileName);
});

app.get("/dir/:name", function (req, res) {
  userdirs = fs.readdirSync("./" + req.params.name, { withFileTypes: true });
  console.log("Read dir: " + userdirs);
  res.render("index", { ok: userdirs });
});

http.createServer(app).listen(3000);
