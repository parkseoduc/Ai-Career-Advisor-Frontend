import React from 'react';

function Header({ onLogout }) {
    return (
        <header className="dashboard-header">
            <div className="logo">
                <h1>JobFinder AI</h1>
            </div>
            <div className="user-info">
                <span>Chào, Nguyễn Văn A</span>
                <img src="https://i.pravatar.cc/150?img=5" alt="User Avatar" />
                <a href="#" onClick={onLogout} title="Đăng xuất">
                    <i className="fas fa-sign-out-alt"></i>
                </a>
            </div>
        </header>
    );
}

export default Header;