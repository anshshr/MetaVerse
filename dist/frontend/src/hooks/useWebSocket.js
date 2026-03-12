import { useEffect, useRef, useCallback, useState } from 'react';
export const useWebSocket = (token, spaceId) => {
    const ws = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [users, setUsers] = useState(new Map());
    const [error, setError] = useState(null);
    // Connect to WebSocket
    useEffect(() => {
        if (!token)
            return;
        const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
        ws.current = new WebSocket(WS_URL);
        ws.current.onopen = () => {
            console.log('WebSocket connected');
            // Authenticate
            if (ws.current) {
                ws.current.send(JSON.stringify({
                    type: 'authenticate',
                    token,
                }));
            }
        };
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleMessage(message);
        };
        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };
        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('WebSocket connection failed');
        };
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [token]);
    const handleMessage = (message) => {
        switch (message.type) {
            case 'authenticated':
                setIsConnected(true);
                setError(null);
                break;
            case 'space_joined':
                setUsers(new Map(message.users.map((u) => [u.userId, u])));
                break;
            case 'user_joined':
                setUsers((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(message.userId, {
                        userId: message.userId,
                        username: message.username,
                        x: message.x,
                        y: message.y,
                    });
                    return newMap;
                });
                break;
            case 'user_left':
                setUsers((prev) => {
                    const newMap = new Map(prev);
                    newMap.delete(message.userId);
                    return newMap;
                });
                break;
            case 'user_moved':
                setUsers((prev) => {
                    const newMap = new Map(prev);
                    const user = newMap.get(message.userId);
                    if (user) {
                        newMap.set(message.userId, {
                            ...user,
                            x: message.x,
                            y: message.y,
                        });
                    }
                    return newMap;
                });
                break;
            case 'error':
                setError(message.message);
                break;
        }
    };
    const joinSpace = useCallback((spaceId) => {
        if (ws.current && isConnected) {
            ws.current.send(JSON.stringify({
                type: 'join_space',
                spaceId,
            }));
        }
    }, [isConnected]);
    const leaveSpace = useCallback(() => {
        if (ws.current && isConnected) {
            ws.current.send(JSON.stringify({
                type: 'leave_space',
            }));
        }
        setUsers(new Map());
    }, [isConnected]);
    const move = useCallback((x, y) => {
        if (ws.current && isConnected) {
            ws.current.send(JSON.stringify({
                type: 'move',
                x,
                y,
            }));
        }
    }, [isConnected]);
    return {
        isConnected,
        users: Array.from(users.values()),
        error,
        joinSpace,
        leaveSpace,
        move,
    };
};
//# sourceMappingURL=useWebSocket.js.map