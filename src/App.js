import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { useAuth } from './context/AuthContext'; // 1. Import Context

// Import các components
import LoginPage from './components/auth/LoginPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ChatPage from './components/pages/ChatPage';
import CVPage from './components/pages/CVPage';
import JobSearchPage from './components/pages/JobSearchPage';
import MyApplicationsPage from './components/pages/MyApplicationsPage';
import LearningPage from './components/pages/LearningPage';
import AssessmentPage from './components/pages/AssessmentPage';
import AdvisorPage from './components/pages/AdvisorPage';


const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // Nếu đang tải thông tin từ LocalStorage (khi F5) thì chưa làm gì cả (tránh đá oan)
    if (loading) return null; 

    // Nếu không có user -> Đá về Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có user -> Render DashboardLayout
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
                    <Route path="applications" element={<MyApplicationsPage />} />
                    <Route path="learning" element={<LearningPage />} />
                    <Route path="assessments" element={<AssessmentPage />} />
                    <Route path="advisors" element={<AdvisorPage />} />
                </Route>

                {/* 3. Route 404 hoặc Redirect */}
                {/* Nếu người dùng nhập linh tinh, tự động đá về dashboard (nếu đã login) hoặc login */}
                <Route path="*" element={<Navigate to="/dashboard/chat" replace />} />
            </Routes>
        
    );
}

export default App;