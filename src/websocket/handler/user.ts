// client side part

import WebSocket from "ws";
import { RoomManager } from "./RoomManager.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import type {
  leave,
  movement,
  movementRejected,
  spaceJoined,
} from "../types/server.types.js";

export class User {
  public userId?: string;
  private spaceId?: string;
  private x: number;
  private y: number;
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
    ((this.x = 0), (this.y = 0));
    this.handlefunc();
  }
  handlefunc() {
    this.ws.on("message", async (data) => {
      const value = JSON.parse(data.toString());

      switch (value.type) {
        // join a space
        case "join":
          const token = value.payload.token;
          const spaceId = value.payload.spaceId;
          const decoded = jwt.verify(
            token,
            process.env.USER_JWT_SECRET!,
          ) as JwtPayload;

          if (!decoded) {
            this.ws.close();
            return;
          }

          const space = await prisma.space.findUnique({
            where: {
              id: spaceId,
            },
          });

          if (!space) {
            this.ws.close();
            return;
          }

          this.spaceId = spaceId;

          this.x = Math.floor(Math.random() * space.width!);
          this.y = Math.floor(Math.random() * space.height!);
          RoomManager.instance.addUser(spaceId, this.ws);
          const response: spaceJoined = {
            type: "space-joined",
            payload: {
              spawn: {
                x: this.x,
                y: this.y,
              },
            },
            users: [],
          };

          this.ws.send(JSON.stringify(response), (err) => {
            console.log(`Error Ocuured ${err}`);
          });

          //   broadcast to all the people in the room
          RoomManager.instance.broadcast(
            spaceId,
            this.ws,
            JSON.stringify(response),
          );

          break;

        // move
        // export interface move {
        //   type: "move";
        //   payload: {
        //     x: number;
        //     y: number;
        //   };
        // }

        // make a movement(accepted or rejected)
        case "move":
          const payload = value.payload;

          const userSpace = await prisma.space.findUnique({
            where: {
              id: this.spaceId!,
            },
          });
          const newX = this.x + payload.x;
          const newY = this.y + payload.y;
          if (newX >= userSpace?.width! || newY >= userSpace?.height!) {
            // send a rejection message
            const rejectMovement: movementRejected = {
              type: "movement-rejected",
              payload: {
                x: this.x,
                y: this.y,
              },
            };
            RoomManager.instance.sendMessage(
              this.ws,
              JSON.stringify(rejectMovement),
            );
          } else {
            ((this.x = newX), (this.y = newY));
            const accepted: movement = {
              type: "movement",
              payload: {
                userId: this.userId!,
                x: newX,
                y: newY,
              },
            };

            RoomManager.instance.broadcast(
              this.spaceId!,
              this.ws,
              JSON.stringify(accepted),
            );
          }

          break;
        // leave a space
        case "leave-space":
          const UserspaceId = value.payload.spaceId;
          RoomManager.instance.removeUser(UserspaceId, this.ws);
          const leftMessage: leave = {
            type: "user-left",
            payload: {
              userId: this.userId!,
            },
          };

          RoomManager.instance.broadcast(
            UserspaceId,
            this.ws,
            JSON.stringify(leftMessage),
          );

          break;
      }
    });
  }
}
