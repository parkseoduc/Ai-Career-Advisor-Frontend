import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginApi, registerApi, getMeApi } from '../../api/auth_api';

function LoginPage() {
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isSignup) {
                await registerApi({ email, password, full_name: fullName });
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                setIsSignup(false);
            } else {
                const loginData = await loginApi(email, password);
                const token = loginData.access_token;
                if (!token) throw new Error("Không nhận được token xác thực");
                const userData = await getMeApi(token);
                const finalUser = { ...userData, token: token };
                login(finalUser);
                navigate('/dashboard/chat');
            }
        } catch (err) {
            console.error("Lỗi Auth:", err);
            setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Nền gradient toàn màn hình, căn giữa nội dung
        <section className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4">
            {/* Thẻ chứa form */}
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
                {/* Logo/Tiêu đề */}
                <h1 className="text-3xl font-bold text-primary-600 mb-6">JobFinder AI</h1>
                
                {/* Hiển thị lỗi */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {isSignup ? (
                    // --- FORM ĐĂNG KÝ ---
                    <div>
                        <h2 className="text-2xl font-bold text-dark-800 mb-6">Đăng Ký</h2>
                        <form onSubmit={handleSubmit} className="text-left">
                            <div className="mb-5">
                                <label htmlFor="signup-name" className="block mb-2 font-semibold text-gray-700">Họ và Tên</label>
                                <input
                                    type="text"
                                    id="signup-name"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="signup-email" className="block mb-2 font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="signup-email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="signup-password" className="block mb-2 font-semibold text-gray-700">Mật khẩu</label>
                                <input
                                    type="password"
                                    id="signup-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                            </button>
                        </form>
                        <div className="mt-6">
                            Đã có tài khoản? <a onClick={() => !isLoading && setIsSignup(false)} className="cursor-pointer text-primary-600 hover:text-primary-800 font-semibold">Đăng nhập</a>
                        </div>
                    </div>
                ) : (
                    // --- FORM ĐĂNG NHẬP ---
                    <div>
                        <h2 className="text-2xl font-bold text-dark-800 mb-6">Đăng Nhập</h2>
                        <form onSubmit={handleSubmit} className="text-left">
                            <div className="mb-5">
                                <label htmlFor="login-email" className="block mb-2 font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="login-password" className="block mb-2 font-semibold text-gray-700">Mật khẩu</label>
                                <input
                                    type="password"
                                    id="login-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                                {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                            </button>
                        </form>
                        <div className="mt-6">
                            Chưa có tài khoản? <a onClick={() => !isLoading && setIsSignup(true)} className="cursor-pointer text-primary-600 hover:text-primary-800 font-semibold">Đăng ký ngay</a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default LoginPage;