import { io, Socket } from 'socket.io-client';
import { getToken } from './auth';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(WS_URL, {
      autoConnect: false,
      auth: {
        token: getToken(),
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.auth = { token: getToken() };
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function onSocketEvent(event: string, callback: (...args: unknown[]) => void): void {
  const s = getSocket();
  s.on(event, callback);
}

export function offSocketEvent(event: string, callback?: (...args: unknown[]) => void): void {
  const s = getSocket();
  if (callback) {
    s.off(event, callback);
  } else {
    s.off(event);
  }
}

export function emitSocketEvent(event: string, ...args: unknown[]): void {
  const s = getSocket();
  s.emit(event, ...args);
}

export default { getSocket, connectSocket, disconnectSocket, onSocketEvent, offSocketEvent, emitSocketEvent };
