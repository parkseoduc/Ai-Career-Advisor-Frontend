// src/api/job_api.js
const BASE_URL = 'http://localhost:8000/api/v1';

export const searchJobsApi = async (keyword, category) => {
    try {
        const params = new URLSearchParams();
        if (keyword) params.append('q', keyword);
        if (category && category !== 'all') params.append('category', category);

        // SỬA LẠI ĐƯỜNG DẪN: Bỏ chữ /search đi
        // Endpoint chuẩn theo Swagger của bạn là: /jobs/
        const response = await fetch(`${BASE_URL}/jobs/?${params.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        // Kiểm tra nếu response không ok
        if (!response.ok) throw new Error(data.detail || 'Lỗi tải danh sách việc làm');

        return data; 
    } catch (error) { throw error; }
};