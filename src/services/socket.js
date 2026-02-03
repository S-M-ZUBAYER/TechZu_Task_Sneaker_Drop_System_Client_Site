import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://techzutasksneakerdropsystemserversite-production.up.railway.app';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect() {
        if (this.socket?.connected) {
            console.log('✅ Socket already connected:', this.socket.id);
            return this.socket;
        }

        console.log('🔌 Connecting to socket...');

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 10,
            timeout: 20000,
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
            // Auto-reconnect is handled by socket.io
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message);
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('🔌 Socket disconnected manually');
        }
    }

    // Listen to stock updates
    onStockUpdate(callback) {
        if (!this.socket) return;
        this.socket.on('stockUpdate', callback);
        this.listeners.set('stockUpdate', callback);
    }

    // Listen to reservation created
    onReservationCreated(callback) {
        if (!this.socket) return;
        this.socket.on('reservationCreated', callback);
        this.listeners.set('reservationCreated', callback);
    }

    // Listen to reservation expired
    onReservationExpired(callback) {
        if (!this.socket) return;
        this.socket.on('reservationExpired', callback);
        this.listeners.set('reservationExpired', callback);
    }

    // Listen to purchase completed
    onPurchaseCompleted(callback) {
        if (!this.socket) return;
        this.socket.on('purchaseCompleted', callback);
        this.listeners.set('purchaseCompleted', callback);
    }

    // Listen to new drop
    onNewDrop(callback) {
        if (!this.socket) return;
        this.socket.on('newDrop', callback);
        this.listeners.set('newDrop', callback);
    }

    // Remove specific listener
    off(eventName) {
        if (this.socket && this.listeners.has(eventName)) {
            const callback = this.listeners.get(eventName);
            this.socket.off(eventName, callback);
            this.listeners.delete(eventName);
        }
    }

    // Remove all listeners
    removeAllListeners() {
        if (this.socket) {
            this.listeners.forEach((callback, eventName) => {
                this.socket.off(eventName, callback);
            });
            this.listeners.clear();
        }
    }

    // Join a drop room
    joinDrop(dropId) {
        if (this.socket?.connected) {
            this.socket.emit('joinDrop', dropId);
        }
    }

    // Leave a drop room
    leaveDrop(dropId) {
        if (this.socket?.connected) {
            this.socket.emit('leaveDrop', dropId);
        }
    }

    // Request current stock for a drop
    requestStock(dropId) {
        if (this.socket?.connected) {
            this.socket.emit('requestStock', dropId);
        }
    }

    // Check if socket is connected
    isConnected() {
        return this.socket?.connected || false;
    }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;