import requestIp from 'request-ip';

export default function (server) {
    let networks = {};

    server.on('connection', (socket) => {
        let clientIP = requestIp.getClientIp(socket.request);
        console.log('New connection from ' + clientIP);

        if (networks[clientIP] === undefined) {
            networks[clientIP] = [];
        }
        let network = networks[clientIP];

        network.push(socket);
        updateNetwork(network);

        socket.on('disconnect', () => {
            console.log('Disconnected ' + clientIP);

            network.splice(network.indexOf(socket), 1);
            updateNetwork(network);
        });

    });
}

const updateNetwork = (network) => {
    for (let socket of network) {
        socket.emit('network-clients', network.length);
    }
};