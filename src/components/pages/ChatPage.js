import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getChatHistoryApi, sendAdviceApi } from '../../api/chat_api';

// --- THÊM IMPORT ICON ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';

function ChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Chào bạn, tôi là tư vấn viên AI. Tôi có thể giúp gì cho bạn về con đường sự nghiệp hôm nay?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attachedFile, setAttachedFile] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (user && user.token) {
            loadChatHistory();
        }
        // eslint-disable-next-line
    }, [user]);

    const loadChatHistory = async () => {
        try {
            const historyData = await getChatHistoryApi(user.token);
            if (Array.isArray(historyData) && historyData.length > 0) {
                const mappedMessages = historyData.map(msg => ({
                    sender: msg.role === 'user' ? 'user' : 'ai',
                    text: msg.content
                }));
                setMessages(prev => [prev[0], ...mappedMessages]);
            }
        } catch (error) {
            console.error("Không tải được lịch sử chat:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!inputValue.trim() && !attachedFile) || isLoading) return;

        const currentMsg = inputValue;
        const currentFile = attachedFile;
        setInputValue('');
        setAttachedFile(null);
        setIsLoading(true);

        const userMessage = { sender: 'user', text: currentMsg, fileName: currentFile?.name };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        try {
            // !!! QUAN TRỌNG: API HIỆN TẠI CÓ THỂ KHÔNG HỖ TRỢ FILE !!!
            // Bạn cần cập nhật API `sendAdviceApi` để có thể gửi `FormData`
            const formData = new FormData();
            formData.append('message', currentMsg);
            if (currentFile) {
                formData.append('file', currentFile);
            }

            // Tạm thời, chỉ gửi text để demo
            const data = await sendAdviceApi(currentMsg, user.token);
            const aiText = data.response || data.content || "Xin lỗi, tôi chưa hiểu ý bạn.";
            const aiResponse = { sender: 'ai', text: aiText };
            setMessages(prevMessages => [...prevMessages, aiResponse]);

        } catch (error) {
            const errorMsg = { sender: 'ai', text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau." };
            setMessages(prevMessages => [...prevMessages, errorMsg]);
            console.error("Lỗi chat:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    return (
        // Bố cục chính: chiếm toàn bộ chiều cao của viewport
        <section className="flex flex-col h-screen bg-white">
            {/* --- ĐÃ BỎ THANH TIÊU ĐỀ --- */}

            {/* Khu vực hiển thị tin nhắn */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-white text-gray-800 shadow-md'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.fileName && <p className="text-xs mt-1 opacity-75"><i>Đã đính kèm: {msg.fileName}</i></p>}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl shadow-md">
                            <p><em>AI đang suy nghĩ...</em></p>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Khu vực nhập liệu */}
            <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4 flex gap-2">
                {attachedFile && (
                    <div className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded-lg">
                        <span className="text-sm text-gray-600 truncate">{attachedFile.name}</span>
                        <button type="button" onClick={() => setAttachedFile(null)} className="text-red-500 hover:text-red-700">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                )}
                
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Đính kèm file"
                >
                    <FontAwesomeIcon icon={faPaperclip} className="text-lg" />
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <input
                    type="text"
                    placeholder="Nhập câu hỏi của bạn..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                    className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <button type="submit" disabled={isLoading || (!inputValue.trim() && !attachedFile)} className="bg-primary-500 text-white rounded-full p-2 px-4 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50">
                    {isLoading ? '...' : <FontAwesomeIcon icon={faPaperPlane} />}
                </button>
            </form>
        </section>
    );
}

export default ChatPage;