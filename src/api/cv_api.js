// src/api/cv_api.js
const BASE_URL = 'http://localhost:8000/api/v1';

// 1. Lấy thông tin hồ sơ
export const getCVProfileApi = async (token) => {
    try {
        // SỬA LẠI ĐƯỜNG DẪN: /job-seekers/me
        const response = await fetch(`${BASE_URL}/job-seekers/me`, { 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Lỗi lấy hồ sơ');
        return data;
    } catch (error) { throw error; }
};

// 2. Cập nhật hồ sơ
export const updateCVProfileApi = async (profileData, token) => {
    try {
        // SỬA LẠI ĐƯỜNG DẪN: /job-seekers/me
        const response = await fetch(`${BASE_URL}/job-seekers/me`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Lỗi cập nhật');
        return data;
    } catch (error) { throw error; }
};