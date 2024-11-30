// socket.js
import { io } from 'socket.io-client';

let socket;

const apiUrl = import.meta.env.VITE_API_URL;

if (!socket) {
    socket = io(apiUrl, {
        withCredentials: true,
    });
    console.log("Socket initialized");
}

export default socket;
