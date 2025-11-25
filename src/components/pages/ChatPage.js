import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext'; // 1. Lấy Token
import { getChatHistoryApi, sendAdviceApi } from '../../api/chat_api'; // 2. Gọi API

function ChatPage() {
    const { user } = useAuth(); // Lấy thông tin user (có chứa token)
    const [messages, setMessages] = useState([
        // Tin nhắn chào mừng mặc định (nếu muốn)
        { sender: 'ai', text: 'Chào bạn, tôi là tư vấn viên AI. Tôi có thể giúp gì cho bạn về con đường sự nghiệp hôm nay?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Trạng thái đang gửi
    const messagesEndRef = useRef(null); // Để tự động cuộn xuống cuối

    // --- 1. Tự động cuộn xuống cuối khi có tin nhắn mới ---
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- 2. Load lịch sử chat khi vào trang ---
    useEffect(() => {
        if (user && user.token) {
            loadChatHistory();
        }
        // eslint-disable-next-line
    }, [user]);

    const loadChatHistory = async () => {
        try {
            const historyData = await getChatHistoryApi(user.token);
            
            // Backend trả về dạng { role: 'user/ai', content: '...' }
            // Frontend đang dùng dạng { sender: 'user/ai', text: '...' }
            // => Cần map lại dữ liệu cho khớp
            if (Array.isArray(historyData) && historyData.length > 0) {
                const mappedMessages = historyData.map(msg => ({
                    sender: msg.role === 'user' ? 'user' : 'ai', // Chuẩn hóa role
                    text: msg.content
                }));
                // Gộp tin nhắn chào mừng với lịch sử cũ (nếu muốn)
                setMessages(prev => [prev[0], ...mappedMessages]); 
            }
        } catch (error) {
            console.error("Không tải được lịch sử chat:", error);
        }
    };

    // --- 3. Xử lý gửi tin nhắn ---
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const currentMsg = inputValue;
        setInputValue(''); // Xóa ô nhập liệu ngay lập tức
        setIsLoading(true);

        // Hiển thị tin nhắn của User lên màn hình ngay lập tức (Optimistic UI)
        const userMessage = { sender: 'user', text: currentMsg };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        try {
            // Gọi API gửi tin nhắn
            const data = await sendAdviceApi(currentMsg, user.token);

            // Lấy phản hồi từ AI (Backend trả về key là 'response' hoặc 'content')
            const aiText = data.response || data.content || "Xin lỗi, tôi chưa hiểu ý bạn.";

            const aiResponse = { sender: 'ai', text: aiText };
            setMessages(prevMessages => [...prevMessages, aiResponse]);

        } catch (error) {
            // Xử lý lỗi
            const errorMsg = { sender: 'ai', text: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.' };
            setMessages(prevMessages => [...prevMessages, errorMsg]);
            console.error("Lỗi chat:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="chat-content" className="content-section">
            <h2>Tư vấn viên AI</h2>
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {/* Thêm style white-space: pre-wrap để AI xuống dòng đẹp hơn */}
                            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        </div>
                    ))}
                    
                    {/* Hiển thị hiệu ứng đang gõ */}
                    {isLoading && (
                        <div className="message ai">
                            <p><em>AI đang suy nghĩ...</em></p>
                        </div>
                    )}
                    
                    {/* Thẻ div rỗng này dùng để cuộn xuống đáy */}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Nhập câu hỏi của bạn..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading} // Khóa ô nhập khi đang gửi
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? '...' : <i className="fas fa-paper-plane"></i>}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default ChatPage;