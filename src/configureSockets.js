import requestIp from 'request-ip';
import geoIp from 'geoip-lite';

const networks = {};
const defaultLatLong = [35.5836, -80.8533] // Mooresville Costco :)

export default function (server) {
    server.on('connection', socket => {
        const clientIp = requestIp.getClientIp(socket.request);
        console.log('New connection from ' + clientIp);
        const connectionInfo = getConnectionInfoByClientIp(clientIp);
        const connectedSockets = connectionInfo.sockets;
        connectedSockets.push(socket);
        sendConnectedSocketsAnUpdate(connectionInfo);

        socket.on('disconnect', () => {
            console.log('Disconnected ' + clientIp);

            connectedSockets.splice(connectedSockets.indexOf(socket), 1);
            sendConnectedSocketsAnUpdate(connectedSockets);
        });
    });
}

const getConnectionInfoByClientIp = clientIp => {
    if (networks[clientIp] === undefined) {
        networks[clientIp] = {
            sockets: [],
            latLong: geoIp.lookup(clientIp)?.ll || defaultLatLong
        };
    }
    return networks[clientIp];
};

const sendConnectedSocketsAnUpdate = connectionInfo => {
    const {sockets = [], latLong} = connectionInfo;
    for (let socket of sockets) {
        socket.emit('network-clients', {
            socketCount: sockets.length,
            latLong
        });
    }
};