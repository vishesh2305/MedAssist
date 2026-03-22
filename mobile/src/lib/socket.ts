import { io, Socket } from 'socket.io-client';
import { getAccessToken } from './auth';

const WS_URL = process.env.WS_URL || 'ws://localhost:3000';

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  if (socket?.connected) return socket;

  const token = await getAccessToken();

  socket = io(WS_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 10000,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function emitEvent(event: string, data?: unknown): void {
  if (socket?.connected) {
    socket.emit(event, data);
  }
}

export function onEvent(event: string, callback: (...args: unknown[]) => void): void {
  socket?.on(event, callback);
}

export function offEvent(event: string, callback?: (...args: unknown[]) => void): void {
  if (callback) {
    socket?.off(event, callback);
  } else {
    socket?.off(event);
  }
}
