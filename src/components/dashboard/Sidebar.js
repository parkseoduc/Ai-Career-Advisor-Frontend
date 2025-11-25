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

                    <li>
                        <NavLink to="/dashboard/applications" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <i className="fas fa-tasks"></i> Việc đã nộp
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/learning" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <i className="fas fa-book-reader"></i> Góc học tập
                        </NavLink>
                    </li>
                    
                    <li>
                        <NavLink
                            to="/dashboard/assessments"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            <i className="fas fa-clipboard-check"></i>
                            <span>Kiểm tra năng lực</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/advisors" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <i className="fas fa-user-tie"></i>
                            <span>Gặp chuyên gia</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            {/* <div className="sidebar-footer" style={{marginTop: 'auto', padding: '20px', fontSize: '12px', color: '#888', textAlign: 'center'}}>
                <p>© 2025 JobFinder AI</p>
            </div> */}
        </aside>
    );
}

export default Sidebar;