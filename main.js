var http = require('http');
var express = require('express');
const session = require('express-session');
const spawn = require('node-pty').spawn;

var app = express();
server = http.createServer(app)
const io = require('socket.io')(server);

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

io.use((socket, next) => {
    sessionParser(socket.request, {}, next);
});

app.get('/', (req, res) => {
    res.render('index', { ok: "nie ok", current_code: "" });
});

app.get('/term', (req, res) => {
    res.render('term');
});

app.post('/login', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.pwd);
    if(!req.body.pwd){
        res.json({success:false});
        return;
    }
    console.log(`Updating session for user ${req.body.name}`);
    req.session.userId = req.body.name;
    req.session.save();
    res.redirect("/");
});


io.on('connection', function (client) {

    console.log("received");
    const sess = client.request.session;
    if (!sess || !sess.userId) {
        console.log('Session is incorrect');
        return;
    } else {
        console.log(`user: ${sess.userId}`)
    }

    const sh = spawn('docker', ['run', '-it', '--rm',
        '--mount', `src=${__dirname}/data/${sess.userId},target=/root/${sess.userId},type=bind`,
        '-w', `/root/${sess.userId}`,
        'python:3.7',
        'bash'], {
        name: 'xterm-color',
        cols: 80,
        rows: 30
    });

    sh.on('data', function (data) {
        client.send(data);
    });

    sh.on('exit', function (code) {
        console.log("shutdown");
        client.emit('exit', '** the container died **');
    });

    client.on('message', function (data) {
        sh.write(data);
    });

    client.on('disconnect', function (data) {
        sh.kill();
        console.log("disconnected");
    });
});

server.listen(8099);