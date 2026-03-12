import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (socket) => {
    socket.on("message", (data) => {
        console.log(String(data));
        if (String(data) == "ping") {
            socket.send("pong", (err) => {
                console.log(err);
            });
        }
    });
});
console.log("server connected succesfully");
//# sourceMappingURL=index.js.map