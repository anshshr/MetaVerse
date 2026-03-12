import { json } from "express";
import wss from "./config/ws.js";
const rooms = [];
wss.on("connection", (socket) => {
    socket.on("message", (data) => {
        const value = String(data);
        const message = JSON.parse(value);
        // cretae a room
        if (message.type == "create") {
            const user = [socket];
            const newRoom = {
                roomId: message.roomId,
                users: user,
            };
            rooms.push(newRoom);
            // join a room
        }
        else if (message.type == "join") {
            rooms.map((e) => {
                if (e.roomId == message.roomId) {
                    e.users.push(socket);
                }
            });
        }
        // send a message to a prticular room
        else {
            for (let index = 0; index < rooms.length; index++) {
                if (rooms[index]?.roomId == message.roomId) {
                    rooms[index]?.users.forEach((e) => {
                        if (e != socket) {
                            e.send(message.data, (err) => {
                                console.log(err);
                            });
                        }
                    });
                }
            }
        }
    });
});
//# sourceMappingURL=chat.js.map