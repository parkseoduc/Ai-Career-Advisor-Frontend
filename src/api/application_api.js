const BASE_URL = 'http://localhost:8000/api/v1';

// 1. Nộp đơn ứng tuyển
export const applyJobApi = async (jobId, token) => {
    try {
        const response = await fetch(`${BASE_URL}/applications/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ job_id: jobId })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Lỗi ứng tuyển');
        return data;
    } catch (error) { throw error; }
};

// 2. Lấy lịch sử ứng tuyển
export const getMyApplicationsApi = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/applications/my-applications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error('Lỗi tải lịch sử');
        return data;
    } catch (error) { throw error; }
};