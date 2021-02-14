var http = require('http');
var express = require('express');
const session = require('express-session');

var app = express();
server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use("/node_modules", express.static('./node_modules'));
app.use(express.urlencoded({ extended: true }));

const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false
});

app.use(sessionParser);

executor = require("./execution.js");
pseudo_login = require("./pseudologin.js");

executor(server, sessionParser);
pseudo_login(app);

server.listen(8099);