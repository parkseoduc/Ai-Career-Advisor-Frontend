import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function DashboardLayout() {
    // Không cần nhận prop { onLogout } nữa
    return (
        <div id="dashboard-page">
            {/* Không cần truyền onLogout vào Header nữa */}
            <Header />
            
            <Sidebar />
            
            <main className="dashboard-main">
                {/* Outlet là nơi các trang con (Chat, CV, Jobs) sẽ được hiển thị */}
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;