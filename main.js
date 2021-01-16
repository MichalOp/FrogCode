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
  res.render("index", { ok: "nie ok" });
});

// app.post('/u', upload.single('file'), (req, res) => {
//     console.log(req.file);
//     res.render('index', { ok:"ok" });
// });

app.post("/codesubmit", (req, res) => {
  //console.log(req.body.code);
  username = req.body.code;

  userdirs = fs.readdirSync("./" + username);
  res.render("index", { ok: userdirs });
});

http.createServer(app).listen(3000);
