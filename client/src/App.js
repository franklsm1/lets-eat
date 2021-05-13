import {useState} from 'react';
import {io} from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

const socket = io(window.location.origin);

const App = () => {
    const [userCount, setUserCount] = useState("loading...");
    socket.on('network-clients', (data) => {
        setUserCount(data);
    });
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Users connected on the same network: <span id="network-clients">{userCount}</span>
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
};

export default App;
