import { useState, useCallback } from 'react';
import api from '../utils/api';
import { setToken, removeToken, setUser, removeUser, getToken } from '../utils/localStorage';
export const useAuth = () => {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const register = useCallback(async (email, password, username) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/register', {
                email,
                password,
                username,
            });
            setToken(response.data.token);
            setUser(response.data.user);
            setUserState(response.data.user);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.error || 'Registration failed';
            setError(message);
            throw new Error(message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });
            setToken(response.data.token);
            setUser(response.data.user);
            setUserState(response.data.user);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.error || 'Login failed';
            setError(message);
            throw new Error(message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    const logout = useCallback(() => {
        removeToken();
        removeUser();
        setUserState(null);
    }, []);
    return {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!getToken(),
    };
};
//# sourceMappingURL=useAuth.js.map