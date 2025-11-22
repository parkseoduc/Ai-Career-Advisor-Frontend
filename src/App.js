import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';

// Import các components
import LoginPage from './components/auth/LoginPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ChatPage from './components/pages/ChatPage';
import CVPage from './components/pages/CVPage';
import JobSearchPage from './components/pages/JobSearchPage';

// Component này sẽ bao bọc các trang cần đăng nhập
function ProtectedRoutes() {
    // Tạm thời dùng state để kiểm tra đăng nhập. Sau này sẽ thay bằng logic thật.
    const [isLoggedIn, setIsLoggedIn] = React.useState(true); // Đặt là true để test

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return <DashboardLayout onLogout={handleLogout} />;
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <Routes>
                {/* Route cho trang đăng nhập */}
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                {/* Route bao bọc cho các trang cần đăng nhập */}
                <Route path="/" element={<ProtectedRoutes />}>
                    {/* Các trang con sẽ được render vào <Outlet /> của DashboardLayout */}
                    <Route path="dashboard/chat" element={<ChatPage />} />
                    <Route path="dashboard/cv" element={<CVPage />} />
                    <Route path="dashboard/jobs" element={<JobSearchPage />} />
                    
                    {/* Mặc định chuyển đến trang chat khi vào /dashboard */}
                    <Route path="dashboard" element={<Navigate to="dashboard/chat" />} />
                </Route>

                {/* Chuyển hướng về trang login nếu chưa đăng nhập */}
                <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard/chat" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;