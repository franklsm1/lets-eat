import MockedSocket from 'socket.io-mock';
import configureSockets from "../configureSockets";

const randomLondonIpInfo = {
    ip: '25.115.184.94',
    latLong: [51.4964, -0.1224],
};

describe('Configure Sockets', function () {
    it('should emit network-clients event with zip and connection count when new connection occurs', () => {
        const serverSocket = new MockedSocket();
        const newConnectionSocket = new MockedSocket();
        newConnectionSocket.request = { headers: {"x-client-ip": randomLondonIpInfo.ip}};
        newConnectionSocket.emit = jest.fn();
        serverSocket.on = jest.fn().mockImplementationOnce((eventType, createSocketCallback) => {
            if (eventType === 'connection') {
                createSocketCallback(newConnectionSocket);
            }
        });

        configureSockets(serverSocket)
        expect(serverSocket.on).toHaveBeenCalledTimes(1);
        expect(newConnectionSocket.emit).toHaveBeenCalledTimes(1);
        expect(newConnectionSocket.emit).toHaveBeenCalledWith('network-clients', {
            socketCount: 1,
            latLong: randomLondonIpInfo.latLong,
        });
    });
});