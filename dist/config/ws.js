import { WebSocketServer } from "ws";
const PORT = process.env.WS_PORT || 8090;
console.log("====================================");
console.log(`websocket port ${PORT}`);
console.log("====================================");
const wss = new WebSocketServer({ port: PORT });
export default wss;
//# sourceMappingURL=ws.js.map