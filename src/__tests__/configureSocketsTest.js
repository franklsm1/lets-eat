import MockedSocket from 'socket.io-mock';
import configureSockets from "../configureSockets";
import waitForExpect from 'wait-for-expect';

const randomLondonIpInfo = {
    ip: '25.115.184.94',
    latLong: [51.4964, -0.1224],
};

describe('Configure Sockets', () => {
    it('should emit new-connection event with latLong, connection count, and list of restaurants when new connection occurs', async () => {
        const serverSocket = new MockedSocket();
        const newConnectionSocket = new MockedSocket();
        newConnectionSocket.request = { headers: {"x-client-ip": randomLondonIpInfo.ip}};
        newConnectionSocket.emit = jest.fn();
        serverSocket.on = jest.fn().mockImplementationOnce(async (eventType, createSocketCallback) => {
            if (eventType === 'connection') {
                await createSocketCallback(newConnectionSocket);
            }
        });

        configureSockets(serverSocket)
        expect(serverSocket.on).toHaveBeenCalledTimes(1);
        await waitForExpect(() => expect(newConnectionSocket.emit).toHaveBeenCalledTimes(1));
        expect(newConnectionSocket.emit).toHaveBeenCalledWith('new-connection', {
            socketCount: 1,
            latLong: randomLondonIpInfo.latLong,
            places: expect.any(Array)
        });
    });
});