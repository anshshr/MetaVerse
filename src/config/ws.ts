import { WebSocketServer } from "ws";
const PORT = 8090;

const wss = new WebSocketServer({ port: PORT });
export default wss;
