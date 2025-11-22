import React, { useState } from 'react';

function ChatPage() {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Chào bạn, tôi là tư vấn viên AI. Tôi có thể giúp gì cho bạn về con đường sự nghiệp hôm nay?' },
        { sender: 'user', text: 'Chào bạn, tôi muốn tìm việc làm về ngành Marketing tại Hà Nội.' },
        { sender: 'ai', text: 'Tuyệt vời! Ngành Marketing tại Hà Nội có rất nhiều cơ hội. Bạn có thể cho tôi biết thêm về kinh nghiệm và kỹ năng của mình được không?' },
    ]);

    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { sender: 'user', text: inputValue };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        setTimeout(() => {
            const aiResponse = { sender: 'ai', text: 'Cảm ơn bạn đã chia sẻ. Tôi sẽ phân tích và đưa ra gợi ý sớm nhất.' };
            setMessages(prevMessages => [...prevMessages, aiResponse]);
        }, 1000);

        setInputValue('');
    };

    return (
        <section id="chat-content" className="content-section">
            <h2>Tư vấn viên AI</h2>
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Nhập câu hỏi của bạn..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button type="submit"><i className="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </section>
    );
}

export default ChatPage;