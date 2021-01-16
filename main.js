var http = require('http');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { ok:"nie ok", current_code:"" });
});

app.post('/codesubmit', (req, res) => {
    console.log(req.body.code);
    res.render('index', { ok:"ok", current_code:req.body.code });
});


http.createServer(app).listen(3000);