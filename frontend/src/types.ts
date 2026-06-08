export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export interface Avatar {
  id: string;
  imageUrl: string | null;
  name: string | null;
}

export interface ElementEntity {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
}

export interface Space {
  id: string;
  name: string;
  width: number;
  height: number | null;
  mapId: string | null;
  creatorId: string;
  thumbnail: string | null;
}

export interface SpaceElement {
  id: string;
  elementId: string;
  spaceId: string;
  x: number;
  y: number;
  element: ElementEntity;
}

export interface SpaceDetails {
  id: string;
  name: string;
  width: number;
  height: number | null;
  mapId: string | null;
  creatorId: string;
  thumbnail: string | null;
  spaceElements: SpaceElement[];
}

export interface MapDefaultElement {
  elementId: string;
  x: number;
  y: number;
}

export type WsServerEvent =
  | {
      type: 'space-joined';
      payload: { spawn: { x: number; y: number } };
      users: Array<{ id: number }>;
    }
  | {
      type: 'movement-rejected';
      payload: { x: number; y: number };
    }
  | {
      type: 'movement';
      payload: { x: number; y: number; userId: string };
    }
  | {
      type: 'user-left';
      payload: { userId: string };
    }
  | {
      type: 'user-join';
      payload: { userId: number; x: number; y: number };
    };
