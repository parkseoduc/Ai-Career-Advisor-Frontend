const BASE_URL = 'http://localhost:8000/api/v1';

// 1. Lấy danh sách chuyên gia
export const getAdvisorsApi = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/advisors/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error('Lỗi tải danh sách chuyên gia');
        return data;
    } catch (error) { throw error; }
};

// 2. Đặt lịch hẹn
export const bookAppointmentApi = async (advisorId, startTime, notes, token) => {
    try {
        const response = await fetch(`${BASE_URL}/appointments/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                advisor_id: advisorId,
                start_time: startTime, // Format: "2025-11-20T10:00:00"
                notes: notes 
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Lỗi đặt lịch');
        return data;
    } catch (error) { throw error; }
};