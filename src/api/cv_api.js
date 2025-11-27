const BASE_URL = 'http://localhost:8000/api/v1';

// 1. Lấy hồ sơ
export const getCVProfileApi = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/job-seekers/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        // Nếu chưa có hồ sơ (backend trả về rỗng hoặc lỗi nhẹ), ta trả về null để form tự xử lý
        if (!response.ok) return null; 
        return data;
    } catch (error) { throw error; }
};

// 2. Cập nhật hồ sơ
export const updateCVProfileApi = async (profileData, token) => {
    try {
        const response = await fetch(`${BASE_URL}/job-seekers/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Lỗi cập nhật hồ sơ');
        return data;
    } catch (error) { throw error; }
};

export const uploadCVApi = async (file, token) => {
    try {
        const formData = new FormData();
        formData.append("file", file); // Key 'file' phải khớp với backend

        const response = await fetch(`${BASE_URL}/job-seekers/upload-cv`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Lưu ý: KHÔNG thêm Content-Type: application/json ở đây
                // Để trình duyệt tự động set multipart/form-data
            },
            body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Lỗi upload CV');
        return data;
    } catch (error) { throw error; }
};