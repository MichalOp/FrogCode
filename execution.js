module.exports = function(server, sessionParser){
    const spawn = require('node-pty').spawn;
    const io = require('socket.io')(server);

    io.use((socket, next) => {
        sessionParser(socket.request, {}, next);
    });

    io.on('connection', function (client) {
        console.log("received");
        const sess = client.request.session;
        if (!sess || !sess.userId) {
            console.log('Session is incorrect!');
            return;
        } else {
            console.log(`user: ${sess.userId}`)
        }
        project = null;
        if(!client.handshake.query || !client.handshake.query.project){
            console.log('No project id provided!');
            return
        }else{
            project = client.handshake.query.project;
        }

        console.log(`project: ${project}`);
    
        const sh = spawn('docker', ['run', '-it', '--rm',
            '--mount', `src=${__dirname}/projects/${sess.userId}/${project},target=/root/${project},type=bind`,
            '-w', `/root/${project}`,
            'python:3.7',
            'bash'], {
            name: 'xterm-color',
            cols: 80, rows: 30
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
}
