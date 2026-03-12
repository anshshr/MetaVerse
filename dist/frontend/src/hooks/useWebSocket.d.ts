export interface User {
    userId: string;
    username: string;
    x: number;
    y: number;
}
export interface WebSocketMessage {
    type: string;
    [key: string]: any;
}
export declare const useWebSocket: (token: string | null, spaceId: string | null) => {
    isConnected: boolean;
    users: User[];
    error: string | null;
    joinSpace: (spaceId: string) => void;
    leaveSpace: () => void;
    move: (x: number, y: number) => void;
};
//# sourceMappingURL=useWebSocket.d.ts.map