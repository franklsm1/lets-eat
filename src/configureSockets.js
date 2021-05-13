import requestIp from 'request-ip';
import { Server } from 'socket.io';

export default function (server) {
    const io = new Server(server);

    let networks = {};

    io.on('connection', (socket) => {
        let clientIP = requestIp.getClientIp(socket.request);
        console.log('New connection from ' + clientIP);

        if (networks[clientIP] === undefined) {
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

    const updateNetwork = (network) => {
        for (let socket of network) {
            socket.emit('network-clients', network.length);
        }
    };
}