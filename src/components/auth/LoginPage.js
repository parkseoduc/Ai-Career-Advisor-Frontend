import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// 1. Import các hàm gọi API đã viết
import { loginApi, registerApi, getMeApi } from '../../api/auth_api';

function LoginPage() {
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); 

    // State form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    
    // State UI
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading để disable nút khi đang gọi API

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Bắt đầu load

        try {
            if (isSignup) {
                // --- XỬ LÝ ĐĂNG KÝ ---
                await registerApi({ 
                    email, 
                    password, 
                    full_name: fullName 
                });
                
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                setIsSignup(false); // Chuyển về tab đăng nhập
            } else {
                // --- XỬ LÝ ĐĂNG NHẬP (QUY TRÌNH 2 BƯỚC) ---
                
                // Bước 1: Lấy Token
                const loginData = await loginApi(email, password);
                const token = loginData.access_token; // FastAPI thường trả về key là 'access_token'

                if (!token) throw new Error("Không nhận được token xác thực");

                // Bước 2: Dùng Token để lấy thông tin User (Tên, Role...)
                const userData = await getMeApi(token);

                // Bước 3: Lưu tất cả vào Context (Gộp thông tin User + Token)
                // Lưu token lại để sau này dùng cho các API chat
                const finalUser = { ...userData, token: token }; 
                
                login(finalUser);

                // Bước 4: Chuyển trang
                navigate('/dashboard/chat');
            }

        } catch (err) {
            // Hiển thị lỗi từ API trả về (nếu có) hoặc lỗi chung
            console.error("Lỗi Auth:", err);
            setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setIsLoading(false); // Kết thúc load
        }
    };

    return (
        <section id="auth-page">
            <div className="auth-container">
                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

                {isSignup ? (
                    <div>
                        <h2>Đăng Ký</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="signup-name">Họ và Tên</label>
                                <input 
                                    type="text" id="signup-name" required 
                                    value={fullName} 
                                    onChange={(e) => setFullName(e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-email">Email</label>
                                <input 
                                    type="email" id="signup-email" required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-password">Mật khẩu</label>
                                <input 
                                    type="password" id="signup-password" required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn" disabled={isLoading}>
                                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                            </button>
                        </form>
                        <div className="auth-switch">
                            Đã có tài khoản? <a onClick={() => !isLoading && setIsSignup(false)} style={{cursor: 'pointer', color: 'blue'}}>Đăng nhập</a>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2>Đăng Nhập</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="login-email">Email</label>
                                <input 
                                    type="email" id="login-email" required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="login-password">Mật khẩu</label>
                                <input 
                                    type="password" id="login-password" required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn" disabled={isLoading}>
                                {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                            </button>
                        </form>
                        <div className="auth-switch">
                            Chưa có tài khoản? <a onClick={() => !isLoading && setIsSignup(true)} style={{cursor: 'pointer', color: 'blue'}}>Đăng ký ngay</a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default LoginPage;