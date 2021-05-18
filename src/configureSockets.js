import requestIp from 'request-ip';
import geoIp from 'geoip-lite';
import { getNearbyRestaurants } from "./googleMapsApi.js";

const networks = {};
const defaultLatLong = [35.5836, -80.8533] // Mooresville Costco :)

export default function (server) {
    server.on('connection', async socket => {
        const clientIp = requestIp.getClientIp(socket.request);
        console.log('New connection from ' + clientIp);
        const connectionInfo = await getConnectionInfoByClientIp(clientIp);
        const connectedSockets = connectionInfo.sockets;
        connectedSockets.push(socket);
        sendConnectedSocketsAnUpdate(connectionInfo);

        socket.on('disconnect', () => {
            console.log('Disconnected ' + clientIp);

            connectedSockets.splice(connectedSockets.indexOf(socket), 1);
            if (connectedSockets.length === 0) {
                delete networks[clientIp];
            }
            sendConnectedSocketsAnUpdate(connectedSockets);
        });
    });
}

const getConnectionInfoByClientIp = async clientIp => {
    if (networks[clientIp] === undefined) {
        const latLong = geoIp.lookup(clientIp)?.ll || defaultLatLong;
        const places = await getNearbyRestaurants(latLong);
        networks[clientIp] = {
            sockets: [],
            latLong,
            places,
        };
    }
    return networks[clientIp];
};

const sendConnectedSocketsAnUpdate = connectionInfo => {
    const {sockets = [], latLong, places} = connectionInfo;
    for (let socket of sockets) {
        socket.emit('new-connection', {
            socketCount: sockets.length,
            latLong,
            places
        });
    }
};