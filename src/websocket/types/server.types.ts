// server/backend send events

// space joined
export interface spaceJoined {
  type: "space-joined";
  payload: {
    spawn: {
      x: number;
      y: number;
    };
  };
  users: {
    id: number;
  }[];
}

// movement rejected
export interface movementRejected {
  type: "movement-rejected";
  payload: {
    x: number;
    y: number;
  };
}

//movement
export interface movement {
  type: "movement";
  payload: {
    x: number;
    y: number;
    userId: string;
  };
}

// leave

export interface leave {
  type: "user-left";
  payload: {
    userId: string;
  };
}

// join an event
export interface joinEvent {
  type: "user-join";
  payload: {
    userId: number;
    x: number;
    y: number;
  };
}
