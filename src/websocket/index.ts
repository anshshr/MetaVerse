import wss from "../config/ws.js";
import { User } from "./handler/user.js";

wss.on("connection", (socket) => {
  console.log("user connected");
  let user = new User(socket);

  socket.on("error", (err) => {
    console.log(`Error is ${err}`);
  });

  socket.on("close", () => {
    console.log("Sessiosn closed");
  });
});
