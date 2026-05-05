import { io } from "socket.io-client";
import environment from "../../environment";

const SOCKET_SERVER_URL = environment.api.replace(/\/+$/, "");

const socket = io(SOCKET_SERVER_URL,{
    transports: ["websocket"],
});

export default socket;
