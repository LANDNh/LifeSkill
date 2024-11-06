// socket.js
import { io } from 'socket.io-client';

let socket;

if (!socket) {
    socket = io('http://localhost:8000', {
        withCredentials: true,
    });
    console.log("Socket initialized");
}

export default socket;
