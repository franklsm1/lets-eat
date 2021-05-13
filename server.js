const express = require('express');
const path = require('path');
const helmet = require('helmet');
const socket  = require('socket.io');
const requestIp = require('request-ip');

const PORT = process.env.PORT || 9000;
const PATH = 'client/build';
const app = express();

// app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, `./${PATH}`)));
// app.use(helmet());
const server = app.listen(PORT, '0.0.0.0');

console.log('Express server listening on port %d in %s mode', PORT, app.settings.env); // eslint-disable-line no-console

app.get('*', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, `./${PATH}/index.html`));
});

const io = socket(server);

let networks = {};

io.on('connection', function (socket) {
    let clientIP = requestIp.getClientIp(socket.request);
    console.log('New connection from ' + clientIP);

    if ( networks[clientIP] === undefined ){
        networks[clientIP] = [];
    }
    let network = networks[clientIP];

    network.push(socket);
    updateNetwork(network);

    socket.on('disconnect', function () {
        console.log('Disconnected ' + clientIP);

        network.splice(network.indexOf(socket), 1);
        updateNetwork(network);
    });

});

function updateNetwork(network){
    for( let socket of network ){
        socket.emit( 'network-clients', network.length );
    }
}
