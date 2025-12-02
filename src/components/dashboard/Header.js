import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- THÊM IMPORT ICON ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAvatarClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            setShowMenu(!showMenu);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-dark-200 flex justify-between items-center px-6 z-50">
            <div className="logo">
                <h1 className="text-2xl font-bold text-primary-600">JobFinder AI</h1>
            </div>
            
            <div className="user-info relative flex items-center gap-3">
                {user ? (
                    <>
                        <span className="text-gray-700">Chào, {user.full_name || user.name || user.email}</span>
                        
                        <img 
                            src="https://i.pravatar.cc/150?img=5" 
                            alt="User Avatar" 
                            onClick={handleAvatarClick}
                            className="w-9 h-9 rounded-full cursor-pointer border-2 border-success-500 object-cover"
                        />
                        
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md p-2.5 z-40 min-w-[150px] transition-all duration-200">
                                <div 
                                    onClick={handleLogout} 
                                    className="cursor-pointer text-red-500 flex items-center gap-2 hover:bg-red-50 p-2 rounded"
                                >
                                    {/* --- THAY THẾ ICON --- */}
                                    <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <span 
                            onClick={() => navigate('/login')} 
                            className="cursor-pointer underline text-primary-600 hover:text-primary-800 transition-colors"
                        >
                            Đăng nhập ngay
                        </span>
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                            alt="Guest Avatar" 
                            onClick={handleAvatarClick}
                            className="w-9 h-9 rounded-full cursor-pointer opacity-70"
                        />
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;