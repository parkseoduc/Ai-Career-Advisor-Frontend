import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // 1. Nếu đang tải thông tin từ localStorage thì chưa làm gì cả (tránh đá oan)
    if (loading) return <div>Đang tải...</div>; 

    // 2. Nếu không có user -> Đá về trang Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Nếu có user -> Cho phép đi tiếp vào các trang con (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;