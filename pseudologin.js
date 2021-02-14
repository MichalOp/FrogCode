module.exports = function(app){
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
}