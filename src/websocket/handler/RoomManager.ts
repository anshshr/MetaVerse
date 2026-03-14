import jwt, { type JwtPayload } from "jsonwebtoken";

import type WebSocket from "ws";
import type { joinSpace, leave, move } from "../types/client.types.js";
import { prisma } from "../../config/prisma.js";
import type { spaceJoined } from "../types/server.types.js";

export class RoomManager {
  // common industry practice
  // create a room for the spaceId -> Set<websockets>
  // create a room for the websockets -> Set<rooms>
  
  static instance: RoomManager;
  private constructor(
    private rooms: Map<string, Set<WebSocket>>,
    private socketManager: Map<WebSocket, Set<string>>,
  ) {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomManager(new Map(), new Map());
    }
    return this.instance;
  }

  // add a user
  addUser(spaceId: string, ws: WebSocket) {
    if (!this.rooms.has(spaceId)) {
      this.rooms.set(spaceId, new Set());
    }

    this.rooms.get(spaceId)?.add(ws);

    if (!this.socketManager.has(ws)) {
      this.socketManager.set(ws, new Set());
    }

    this.socketManager.get(ws)?.add(spaceId);
  }

  // broadcast the data
  broadcast(spaceId: string, ws: WebSocket, data: any) {
    if (!this.rooms.has(spaceId)) {
      return;
    }
    this.rooms.get(spaceId)?.forEach((s) => {
      if (s != ws) {
        s.send(data, (err) => {
          console.log(`Error broadcasting the data ${err?.message}`);
        });
      }
    });
  }

  // remove a user
  removeUser(spaceId: string, ws: WebSocket) {
    this.rooms.get(spaceId)?.delete(ws);
    return;
  }

  // send a message
  sendMessage(ws: WebSocket, data: any) {
    ws.send(data, (err) => {
      console.log(`Error Occured ${err?.message}`);
    });
  }
}
