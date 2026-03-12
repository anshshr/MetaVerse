import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './utils/localStorage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SpacePage from './pages/SpacePage';
const ProtectedRoute = ({ children }) => {
    const token = getToken();
    if (!token) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(LandingPage, {}) }) }), _jsx(Route, { path: "/space/:spaceId", element: _jsx(ProtectedRoute, { children: _jsx(SpacePage, {}) }) })] }) }));
}
export default App;
//# sourceMappingURL=App.js.map