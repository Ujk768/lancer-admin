import { io, type Socket } from "socket.io-client";
import { tokenStorage } from "./client";

// One shared Socket.IO connection for the admin dashboard. The backend's
// realtime layer (backend/src/realtime/io.ts) authenticates the socket with the
// SAME access token used for REST, and puts admins in the "admins" room. That's
// how these events arrive: validation:submitted, validation:resolved,
// challenge:joined, challenge:participants.

let socket: Socket | null = null;

// The socket server lives at the API origin WITHOUT the "/api" suffix.
function socketOrigin(): string {
  const base = import.meta.env.VITE_API_PATH || "http://localhost:8000/api";
  return base.replace(/\/api\/?$/, "");
}

export function connectSocket(): Socket | null {
  const token = tokenStorage.getAccessToken();
  if (!token) return null;
  if (socket) socket.disconnect();
  socket = io(socketOrigin(), {
    auth: { token },
    transports: ["websocket"],
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}