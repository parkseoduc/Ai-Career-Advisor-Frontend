import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext'; // 1. Import Context

// Import các components
import LoginPage from './components/auth/LoginPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ChatPage from './components/pages/ChatPage';
import CVPage from './components/pages/CVPage';
import JobSearchPage from './components/pages/JobSearchPage';

// --- COMPONENT BẢO VỆ ROUTE ---
// "Bác bảo vệ": Kiểm tra xem có vé (user) không? Có thì cho vào, không thì đá về Login
const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // Nếu đang tải thông tin từ LocalStorage (khi F5) thì chưa làm gì cả (tránh đá oan)
    if (loading) return null; // Hoặc return <div className="loading">Loading...</div>

    // Nếu không có user -> Đá về Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có user -> Render DashboardLayout (Layout này sẽ chứa Outlet để hiện các trang con)
    return <DashboardLayout />;
};

function App() {
    return (
        
            <Routes>
                {/* 1. Route Đăng nhập (Công khai) */}
                <Route path="/login" element={<LoginPage />} />

                {/* 2. Các Route cần bảo vệ (Phải đăng nhập mới vào được) */}
                {/* Khi vào /dashboard, nó sẽ chạy qua ProtectedRoute trước */}
                <Route path="/dashboard" element={<ProtectedRoute />}>
                    
                    {/* Route mặc định: Vào /dashboard tự nhảy sang /dashboard/chat */}
                    <Route index element={<Navigate to="chat" replace />} />
                    
                    {/* Các trang con */}
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="cv" element={<CVPage />} />
                    <Route path="jobs" element={<JobSearchPage />} />
                </Route>

                {/* 3. Route 404 hoặc Redirect */}
                {/* Nếu người dùng nhập linh tinh, tự động đá về dashboard (nếu đã login) hoặc login */}
                <Route path="*" element={<Navigate to="/dashboard/chat" replace />} />
            </Routes>
        
    );
}

export default App;