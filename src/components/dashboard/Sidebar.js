import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-logo">
                {/* Nếu muốn thêm Logo nhỏ ở sidebar thì thêm vào đây */}
            </div>

            <nav>
                {/* Dùng ul/li giúp cấu trúc rõ ràng hơn */}
                <ul className="nav-menu"> 
                    <li>
                        <NavLink 
                            to="/dashboard/chat" 
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            <i className="fas fa-comments"></i>
                            <span>Trò chuyện AI</span>
                        </NavLink>
                    </li>
                    
                    <li>
                        <NavLink 
                            to="/dashboard/cv" 
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            <i className="fas fa-file-alt"></i>
                            <span>Hồ sơ (CV)</span>
                        </NavLink>
                    </li>
                    
                    <li>
                        <NavLink 
                            to="/dashboard/jobs" 
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            <i className="fas fa-briefcase"></i>
                            <span>Tìm việc làm</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;