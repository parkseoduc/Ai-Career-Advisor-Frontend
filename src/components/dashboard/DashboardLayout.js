import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function DashboardLayout({ onLogout }) {
    return (
        <div id="dashboard-page">
            <Header onLogout={onLogout} />
            <Sidebar />
            <main className="dashboard-main">
                {/* Outlet là nơi các trang con (Chat, CV, Jobs) sẽ được hiển thị */}
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;