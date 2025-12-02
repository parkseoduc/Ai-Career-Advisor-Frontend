import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function DashboardLayout() {
    return (
        // Container chính: sử dụng flexbox, chiếm toàn bộ chiều cao màn hình
        <div className="flex h-screen bg-gray-100">
            
            {/* Header và Sidebar sẽ được định vị cố định (fixed position) trong các file của chúng */}
            <Header />
            <Sidebar />
            
            {/* Khu vực nội dung chính */}
            <main className="flex-1 ml-[250px] mt-[60px] p-8 overflow-y-auto">
                {/* Outlet là nơi các trang con (JobSearch, Learning, Chat...) sẽ được hiển thị */}
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;