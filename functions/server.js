const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const helmet = require('helmet');
const socket  = require('socket.io');
const requestIp = require('request-ip');

const app = express();

app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, `../'`)));
app.use(helmet());
const server = serverless(app);

app.get('*', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, `../index.html`));
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

module.exports.handler = server;