import { io } from "socket.io-client";
import environment from "../../environment";

// Replace this URL with your backend server's URL
const SOCKET_SERVER_URL = environment.api || process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:6089';

const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
});

export default socket;
