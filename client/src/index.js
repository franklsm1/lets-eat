import React from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from 'socket.io-client'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

let socket = socketIOClient.connect(window.location.origin);

let clientList;
socket.on('network-clients', (data) => {
    clientList = data;
});

ReactDOM.render(
  <React.StrictMode>
    <App clientList />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
