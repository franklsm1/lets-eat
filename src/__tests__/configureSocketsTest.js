import MockedSocket from 'socket.io-mock';
import configureSockets from "../configureSockets";

describe('Configure Sockets', function () {
    it('should call connect', function () {
        const serverSocket = new MockedSocket();
        const newConnectionSocket = new MockedSocket();
        newConnectionSocket.request = { headers: {"x-client-ip": "127.0.0.1"}};
        newConnectionSocket.emit = jest.fn();
        serverSocket.on = jest.fn().mockImplementationOnce((eventType, createSocketCallback) => {
            if (eventType === 'connection') {
                createSocketCallback(newConnectionSocket);
            }
        });

        configureSockets(serverSocket)
        expect(serverSocket.on).toHaveBeenCalledTimes(1);
        expect(newConnectionSocket.emit).toHaveBeenCalledTimes(1);
        expect(newConnectionSocket.emit).toHaveBeenCalledWith('network-clients', 1);
    });
});