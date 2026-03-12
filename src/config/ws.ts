import { WebSocketServer } from "ws";
const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

export default wss;
