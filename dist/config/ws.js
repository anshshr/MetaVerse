import { WebSocketServer } from "ws";
const PORT = parseInt(process.env.WS_PORT);
const wss = new WebSocketServer({ port: PORT });
export default wss;
//# sourceMappingURL=ws.js.map