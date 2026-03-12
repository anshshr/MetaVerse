import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
export const LandingPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [spaces, setSpaces] = useState([]);
    const [newSpaceName, setNewSpaceName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchSpaces();
    }, []);
    const fetchSpaces = async () => {
        try {
            const response = await api.get('/spaces');
            setSpaces(response.data);
        }
        catch (err) {
            console.error(err);
            setError('Failed to load spaces');
        }
    };
    const handleCreateSpace = async (e) => {
        e.preventDefault();
        if (!newSpaceName.trim())
            return;
        setLoading(true);
        try {
            const response = await api.post('/spaces', {
                name: newSpaceName,
            });
            setNewSpaceName('');
            setSpaces([...spaces, response.data]);
        }
        catch (err) {
            console.error(err);
            setError('Failed to create space');
        }
        finally {
            setLoading(false);
        }
    };
    const handleJoinSpace = (spaceId) => {
        navigate(`/space/${spaceId}`);
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("nav", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold text-blue-600", children: "MetaVerse 2D" }), _jsx("button", { onClick: handleLogout, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: "Logout" })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Create New Space" }), _jsxs("form", { onSubmit: handleCreateSpace, className: "flex gap-4", children: [_jsx("input", { type: "text", value: newSpaceName, onChange: (e) => setNewSpaceName(e.target.value), placeholder: "Enter space name...", className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", required: true }), _jsx("button", { type: "submit", disabled: loading, className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50", children: loading ? 'Creating...' : 'Create' })] }), error && (_jsx("div", { className: "mt-2 text-red-600", children: error }))] }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Available Spaces" }), spaces.length === 0 ? (_jsx("div", { className: "bg-white rounded-lg shadow-md p-8 text-center text-gray-500", children: "No spaces yet. Create one to get started!" })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: spaces.map((space) => (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: space.name }), _jsxs("p", { className: "text-gray-600 text-sm mb-2", children: ["Created by: ", space.creator.username] }), _jsxs("p", { className: "text-gray-600 text-sm mb-4", children: ["Users: ", space.userCount, "/", space.maxUsers] }), _jsx("button", { onClick: () => handleJoinSpace(space.id), className: "w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", children: "Join Space" })] }, space.id))) }))] })] })] }));
};
export default LandingPage;
//# sourceMappingURL=LandingPage.js.map