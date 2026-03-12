import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Circle, Text } from 'react-konva';
import { useWebSocket } from '../hooks/useWebSocket';
import { getToken } from '../utils/localStorage';
import api from '../utils/api';
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
export const SpacePage = () => {
    const { spaceId } = useParams();
    const navigate = useNavigate();
    const token = getToken();
    const { isConnected, users, error, joinSpace, leaveSpace, move } = useWebSocket(token, spaceId || null);
    const [space, setSpace] = useState(null);
    const [myPosition, setMyPosition] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!spaceId)
            return;
        fetchSpace();
    }, [spaceId]);
    useEffect(() => {
        if (!isConnected || !spaceId)
            return;
        joinSpace(spaceId);
    }, [isConnected, spaceId, joinSpace]);
    const fetchSpace = async () => {
        try {
            const response = await api.get(`/spaces/${spaceId}`);
            setSpace(response.data);
        }
        catch (err) {
            console.error(err);
            navigate('/');
        }
        finally {
            setLoading(false);
        }
    };
    const handleCanvasClick = (e) => {
        const stage = e.target.getStage();
        const pointerPos = stage.getPointerPosition();
        // Clamp position within canvas bounds
        const x = Math.max(30, Math.min(CANVAS_WIDTH - 30, pointerPos.x));
        const y = Math.max(30, Math.min(CANVAS_HEIGHT - 30, pointerPos.y));
        setMyPosition({ x, y });
        move(x, y);
    };
    const handleLeave = () => {
        leaveSpace();
        navigate('/');
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("div", { className: "text-xl", children: "Loading space..." }) }));
    }
    if (!space) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("div", { className: "text-xl text-red-600", children: "Space not found" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-100 flex flex-col", children: [_jsx("nav", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-blue-600", children: space.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Users in space: ", users.length] })] }), _jsx("button", { onClick: handleLeave, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: "Leave Space" })] }) }), _jsxs("div", { className: "flex-1 flex items-center justify-center p-4", children: [!isConnected && (_jsx("div", { className: "absolute top-20 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded", children: "Connecting to real-time server..." })), error && (_jsx("div", { className: "absolute top-20 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded", children: error })), _jsx("div", { className: "bg-white rounded-lg shadow-lg", children: _jsx(Stage, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, onClick: handleCanvasClick, style: { cursor: 'crosshair' }, children: _jsxs(Layer, { children: [_jsx(Circle, { x: 0, y: 0, radius: 1, fill: "white" }), users.map((user) => (_jsxs("g", { children: [_jsx(Circle, { x: user.x, y: user.y, radius: 20, fill: "#3b82f6", stroke: "#1e40af", strokeWidth: 2 }), _jsx(Text, { x: user.x - 30, y: user.y + 25, text: user.username, fontSize: 12, width: 60, align: "center" })] }, user.userId))), _jsx(Circle, { x: myPosition.x, y: myPosition.y, radius: 20, fill: "#10b981", stroke: "#065f46", strokeWidth: 2 }), _jsx(Text, { x: myPosition.x - 30, y: myPosition.y + 25, text: "You", fontSize: 12, width: 60, align: "center" })] }) }) })] }), _jsx("div", { className: "bg-white border-t border-gray-200 p-4", children: _jsx("p", { className: "text-center text-gray-600 text-sm", children: "Click anywhere on the canvas to move your avatar" }) })] }));
};
export default SpacePage;
//# sourceMappingURL=SpacePage.js.map