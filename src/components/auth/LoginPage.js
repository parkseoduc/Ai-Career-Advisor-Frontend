import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
        navigate('/dashboard/chat');
    };

    return (
        <section id="auth-page">
            <div className="auth-container">
                {isSignup ? (
                    <div>
                        <h2>Đăng Ký</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="signup-name">Họ và Tên</label>
                                <input type="text" id="signup-name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-email">Email</label>
                                <input type="email" id="signup-email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-password">Mật khẩu</label>
                                <input type="password" id="signup-password" required />
                            </div>
                            <button type="submit" className="btn">Đăng Ký</button>
                        </form>
                        <div className="auth-switch">
                            Đã có tài khoản? <a onClick={() => setIsSignup(false)}>Đăng nhập</a>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2>Đăng Nhập</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="login-email">Email</label>
                                <input type="email" id="login-email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="login-password">Mật khẩu</label>
                                <input type="password" id="login-password" required />
                            </div>
                            <button type="submit" className="btn">Đăng Nhập</button>
                        </form>
                        <div className="auth-switch">
                            Chưa có tài khoản? <a onClick={() => setIsSignup(true)}>Đăng ký ngay</a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default LoginPage;