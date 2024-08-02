import { io } from 'socket.io-client';

class SocketioService {
    constructor() {}
    setupSocketConnection() {
        this.socket = io('http://localhost:3004');
        this.socket.on('connect', () => {
            this.socket.emit(`sendMessage`, "Hello from frontend")
        });
        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default new SocketioService();