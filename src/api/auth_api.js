// 1. Định nghĩa đường dẫn gốc (Base URL) của Backend
// Bạn kiểm tra lại xem Backend đang chạy port 8000 hay 5000 nhé (FastAPI thường là 8000)
const BASE_URL = 'http://localhost:8000/api/v1';

// --- API ĐĂNG KÝ ---
// Endpoint: POST /api/v1/users/register
export const registerApi = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Gửi dữ liệu: { email, password, full_name, ... }
            body: JSON.stringify(userData), 
        });

        const data = await response.json();

        if (!response.ok) {
            // Ném lỗi nếu server trả về 400, 422, 500...
            throw new Error(data.detail || 'Đăng ký thất bại');
        }

        return data; // Trả về dữ liệu thành công
    } catch (error) {
        throw error; // Ném lỗi ra ngoài để LoginPage bắt được
    }
};

// --- API ĐĂNG NHẬP ---
// Endpoint: POST /api/v1/auth/login
export const loginApi = async (email, password) => {
    try {
        // 1. Tạo form data thay vì JSON
        const formData = new URLSearchParams();
        formData.append('username', email); // FastAPI bắt buộc trường này tên là 'username'
        formData.append('password', password);

        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                // 2. Đổi Content-Type sang form-urlencoded
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: formData, // 3. Gửi formData đã tạo
        });

        const data = await response.json();

        if (!response.ok) {
            // Xử lý lỗi hiển thị [object Object]
            // Nếu data.detail là một object/array, ta lấy chuỗi đầu tiên hoặc in ra lỗi chung
            let errorMessage = 'Đăng nhập thất bại';
            if (data.detail) {
                if (typeof data.detail === 'string') {
                    errorMessage = data.detail;
                } else if (Array.isArray(data.detail)) {
                    // Lỗi 422 thường trả về mảng, lấy tin nhắn đầu tiên
                    errorMessage = data.detail[0].msg || 'Dữ liệu không hợp lệ';
                }
            }
            throw new Error(errorMessage);
        }

        return data; 
    } catch (error) {
        throw error;
    }
};

// --- API LẤY THÔNG TIN USER (ME) ---
// Endpoint: GET /api/v1/users/me
export const getMeApi = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Gửi kèm Token để chứng minh đã đăng nhập
                'Authorization': `Bearer ${token}` 
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Không thể lấy thông tin người dùng');
        }

        return data; // Trả về { id, email, full_name, ... }
    } catch (error) {
        throw error;
    }
};