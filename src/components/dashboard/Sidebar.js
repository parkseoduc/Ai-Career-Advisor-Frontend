import React from 'react';
import { NavLink } from 'react-router-dom';

// --- THÊM IMPORT ICON ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faComments, 
    faFileAlt, 
    faBriefcase, 
    faTasks, 
    faBookReader, 
    faClipboardCheck, 
    faUserTie 
} from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
    // Hàm để tạo class cho NavLink, thêm class 'active' khi link đang được chọn
    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-4 px-5 py-4 text-white transition-all duration-200 hover:bg-dark-700 ${
            isActive ? 'border-l-4 border-primary-500 bg-dark-700' : ''
        }`;

    return (
        // Sidebar chính: cố định, bên trái, có nền tối
        <aside className="fixed left-0 top-[60px] bottom-0 w-[250px] bg-dark-800 pt-5 z-40">
            <nav>
                <ul className="list-none p-0 m-0">
                    <li>
                        <NavLink to="/dashboard/chat" className={navLinkClasses}>
                            {/* --- THAY THẾ ICON --- */}
                            <FontAwesomeIcon icon={faComments} className="w-5 text-center" />
                            <span>Trò chuyện AI</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/cv" className={navLinkClasses}>
                            {/* --- THAY THẾ ICON --- */}
                            <FontAwesomeIcon icon={faFileAlt} className="w-5 text-center" />
                            <span>Hồ sơ (CV)</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/jobs" className={navLinkClasses}>
                            {/* --- THAY THẾ ICON --- */}
                            <FontAwesomeIcon icon={faBriefcase} className="w-5 text-center" />
                            <span>Tìm việc làm</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/applications" className={navLinkClasses}>
                            {/* --- THAY THẾ ICON --- */}
                            <FontAwesomeIcon icon={faTasks} className="w-5 text-center" />
                            <span>Việc đã nộp</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/learning" className={navLinkClasses}>
                            {/* --- THAY THẾ ICON --- */}
                            <FontAwesomeIcon icon={faBookReader} className="w-5 text-center" />
                            <span>Góc học tập</span>
                        </NavLink>
                    </li>
                    
                    <li>
                        <NavLink to="/dashboard/assessments" className={navLinkClasses}>
                            {/* --- THAY THẾ ICON --- */}
                            <FontAwesomeIcon icon={faClipboardCheck} className="w-5 text-center" />
                            <span>Kiểm tra năng lực</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/advisors" className={navLinkClasses}>
                            {/* --- THAY THẾ ICON --- */}
                            <FontAwesomeIcon icon={faUserTie} className="w-5 text-center" />
                            <span>Gặp chuyên gia</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Footer của Sidebar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <p className="text-xs text-gray-400">© 2025 JobFinder AI</p>
            </div>
        </aside>
    );
}

export default Sidebar;