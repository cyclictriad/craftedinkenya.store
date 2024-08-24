import { io } from 'socket.io-client';
import router from '../routes'
class SocketioService {
    constructor() { }
    setupSocketConnection() {
        let config = {};
        if (localStorage.getItem('accessToken')) {
            config.extraHeaders = {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        const currentRoute = router.currentRoute.value.fullPath
        if(!currentRoute.startsWith('/admin') && !currentRoute.startsWith('/seller')){
            config.query = {
                client:true
            }
        }       

        this.socket = io('https://craftedinkenya-store-backend.onrender.com', config);
        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
    on(event, data) {
        this.socket.on(event, data)
    }
    emit(event, data) {
        this.socket.emit(event, data)
    }
}

export default new SocketioService();