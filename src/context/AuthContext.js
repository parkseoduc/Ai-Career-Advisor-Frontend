import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider
export const AuthProvider = ({ children }) => {
    // State lưu thông tin user. Mặc định là null (chưa đăng nhập)
    const [user, setUser] = useState(null);
    
    // State loading: Dùng để chờ kiểm tra xem user đã đăng nhập trước đó chưa (trong localStorage)
    const [loading, setLoading] = useState(true);

    // useEffect này chạy 1 lần khi load trang để giữ đăng nhập khi F5
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                // Lấy dữ liệu từ LocalStorage
                const storedUser = localStorage.getItem('user'); 
                
                if (storedUser) {
                    // --- CHỖ NÀY CÓ THỂ GỌI API ĐỂ VALIDATE TOKEN NẾU CẦN ---
                    // Ví dụ: const res = await api.getProfile(token);
                    
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.log("Lỗi kiểm tra đăng nhập:", error);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    // --- HÀM LOGIN ---
    // Hàm này sẽ được gọi từ LoginPage sau khi bạn gọi API thành công bên đó
    const login = (userData) => {
        // 1. Lưu vào State của React
        setUser(userData);
        
        // 2. Lưu vào LocalStorage để không bị mất khi reload trang
        // Lưu ý: userData nên chứa cả token nếu có (ví dụ: {name: 'A', token: 'xyz...'})
        localStorage.setItem('user', JSON.stringify(userData)); 
        
        // --- NẾU MUỐN LƯU TOKEN RIÊNG ---
        // localStorage.setItem('token', userData.token);
    };

    // --- HÀM LOGOUT ---
    const logout = () => {
        // 1. Xóa State
        setUser(null);
        
        // 2. Xóa LocalStorage
        localStorage.removeItem('user');
        // localStorage.removeItem('token'); // Nếu có lưu token riêng
        
        // --- CHỖ NÀY CÓ THỂ GỌI API LOGOUT NẾU BACKEND YÊU CẦU ---
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {/* Chỉ hiển thị giao diện khi đã kiểm tra xong localStorage để tránh nháy màn hình Login */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Hook custom để dùng nhanh ở các file khác
export const useAuth = () => {
    return useContext(AuthContext);
};