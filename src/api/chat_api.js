// src/api/chat_api.js
const BASE_URL = 'http://localhost:8000/api/v1';

// 1. Lấy lịch sử chat
export const getChatHistoryApi = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/chat/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi kèm token
            },
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Lỗi lấy lịch sử chat');
        
        return data; // Mong đợi trả về mảng: [{role: 'user', content: '...'}, {role: 'ai', ...}]
    } catch (error) {
        throw error;
    }
};

// 2. Gửi tin nhắn để xin lời khuyên
export const sendAdviceApi = async (message, token) => {
    try {
        const response = await fetch(`${BASE_URL}/chat/advice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // Kiểm tra lại Backend của bạn xem key là 'message', 'question' hay 'content' nhé
            // Ở đây mình để mặc định là 'message'
            body: JSON.stringify({ message: message }), 
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Lỗi gửi tin nhắn');

        return data; // Mong đợi trả về: { response: "Nội dung AI trả lời..." }
    } catch (error) {
        throw error;
    }
};