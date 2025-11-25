import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import Context

function Header() {
    // 2. Lấy user và hàm logout từ Context
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // State để bật/tắt menu con khi bấm vào ảnh
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = () => {
        logout(); // Xóa token
        navigate('/login'); // Quay về trang login
    };

    // Xử lý khi bấm vào ảnh đại diện
    const handleAvatarClick = () => {
        if (!user) {
            // Nếu chưa đăng nhập -> Chuyển sang trang Login
            navigate('/login');
        } else {
            // Nếu đã đăng nhập -> Bật/Tắt menu Đăng xuất
            setShowMenu(!showMenu);
        }
    };

    return (
        <header className="dashboard-header">
            <div className="logo">
                <h1>JobFinder AI</h1>
            </div>
            
            <div className="user-info" style={{ position: 'relative' }}>
                {user ? (
                    // --- TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP ---
                    <>
                        {/* Hiện tên người dùng lấy từ API */}
                        <span>Chào, {user.full_name || user.name || user.email}</span>
                        
                        <img 
                            src="https://i.pravatar.cc/150?img=5" 
                            alt="User Avatar" 
                            onClick={handleAvatarClick}
                            style={{ cursor: 'pointer', border: '2px solid #4CAF50' }} // Thêm viền xanh để biết đang online
                        />
                        
                        {/* Menu con hiện ra khi bấm vào ảnh */}
                        {showMenu && (
                            <div style={{
                                position: 'absolute',
                                right: '0',
                                top: '60px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                borderRadius: '5px',
                                padding: '10px',
                                zIndex: 100,
                                minWidth: '150px'
                            }}>
                                <div 
                                    onClick={handleLogout} 
                                    style={{ cursor: 'pointer', color: '#d9534f', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    // --- TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP (KHÁCH) ---
                    <>
                        <span 
                            onClick={() => navigate('/login')} 
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Đăng nhập ngay
                        </span>
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png" // Ảnh icon người màu xám
                            alt="Guest Avatar" 
                            onClick={handleAvatarClick}
                            style={{ cursor: 'pointer', opacity: 0.7 }}
                        />
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;