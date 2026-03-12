import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, error, loading } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                const { register } = useAuth();
                await register(formData.email, formData.password, formData.username);
            }
            else {
                await login(formData.email, formData.password);
            }
            navigate('/');
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-8 text-gray-800", children: "MetaVerse 2D" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [isRegister && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Username" }), _jsx("input", { type: "text", name: "username", value: formData.username, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true })] }), error && (_jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded", children: error })), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50", children: loading ? 'Loading...' : isRegister ? 'Register' : 'Login' })] }), _jsx("div", { className: "mt-4 text-center", children: _jsx("button", { onClick: () => setIsRegister(!isRegister), className: "text-blue-600 hover:text-blue-700 font-medium", children: isRegister ? 'Already have an account? Login' : "Don't have an account? Register" }) })] }) }));
};
export default LoginPage;
//# sourceMappingURL=LoginPage.js.map