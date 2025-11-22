import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="dashboard-sidebar">
            <nav>
                <NavLink to="/dashboard/chat" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <i className="fas fa-comments"></i> Trò chuyện AI
                </NavLink>
                <NavLink to="/dashboard/cv" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <i className="fas fa-file-alt"></i> Hồ sơ của tôi (CV)
                </NavLink>
                <NavLink to="/dashboard/jobs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <i className="fas fa-search"></i> Tìm việc làm
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;