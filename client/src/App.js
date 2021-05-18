import {useState} from 'react';
import {io} from 'socket.io-client';
import logo from './logo.svg';
import './App.css';
import Map from "./components/Map";

const socket = io(window.location.origin);

const App = () => {
    const [connectionInfo, setConnectionInfo] = useState(null);
    socket.on('new-connection', (data) => {
        setConnectionInfo(data);
    });
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
            </header>
            {getContent(connectionInfo)}
        </div>
    );
};

const getContent = (connectionInfo) => {
    if (connectionInfo === null) {
        return (
            <p>loading...</p>
        );
    } else {
        return (
            <>
                <p>
                    Users connected on the same network: <span id="numberOfUsers">{connectionInfo.socketCount}</span>
                </p>
                <p> Your location: </p>
                <Map
                    userLat={connectionInfo.latLong[0]}
                    userLong={connectionInfo.latLong[1]}
                    places={connectionInfo.places}
                />
            </>
        );
    }
};

export default App;
