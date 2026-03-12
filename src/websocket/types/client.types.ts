// client/User side sent events

// join a space
export interface joinSpace {
  type: "join";
  payload: {
    spaceId: string;
    token: string;
  };
}

// move
export interface move {
  type: "move";
  payload: {
    x: number;
    y: number;
  };
}

