import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAssessmentsApi, submitAssessmentApi } from '../../api/assessment_api';

const AssessmentPage = () => {
    const { user } = useAuth();
    const [tests, setTests] = useState([]);
    const [currentTest, setCurrentTest] = useState(null); // Bài test đang làm
    const [answers, setAnswers] = useState({}); // Lưu đáp án user chọn
    const [score, setScore] = useState(null); // Điểm số sau khi nộp

    // Load danh sách bài test
    useEffect(() => {
        if (user) {
            getAssessmentsApi(user.token).then(setTests).catch(console.error);
        }
    }, [user]);

    // Bắt đầu làm bài
    const startTest = (test) => {
        setCurrentTest(test);
        setAnswers({});
        setScore(null);
    };

    // Chọn đáp án
    const handleSelectOption = (questionIndex, optionIndex) => {
        setAnswers({ ...answers, [questionIndex]: optionIndex });
    };

    // Nộp bài
    const handleSubmit = async () => {
        if (!currentTest) return;
        
        // Tự chấm điểm tại Frontend (hoặc gửi về BE chấm)
        let correctCount = 0;
        currentTest.questions.forEach((q, index) => {
            if (answers[index] === q.correct) correctCount++;
        });

        // Quy ra thang điểm 100
        const finalScore = Math.round((correctCount / currentTest.questions.length) * 100);

        try {
            await submitAssessmentApi(currentTest._id, finalScore, user.token);
            setScore(finalScore);
            alert(`Bạn đạt ${finalScore}/100 điểm!`);
        } catch (error) {
            console.error("Lỗi nộp bài:", error);
        }
    };

    // --- GIAO DIỆN: DANH SÁCH BÀI TEST ---
    if (!currentTest) {
        return (
            <div className="content-section">
                <h2>Kiểm tra năng lực</h2>
                <div className="test-grid" style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                    {tests.map(test => (
                        <div key={test._id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: '#007bff' }}>{test.title}</h3>
                            <p>{test.description}</p>
                            <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '15px', fontSize: '12px' }}>
                                {test.difficulty}
                            </span>
                            <button 
                                onClick={() => startTest(test)} 
                                style={{ display: 'block', width: '100%', marginTop: '15px', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Làm bài ngay
                            </button>
                        </div>
                    ))}
                </div>
                {tests.length === 0 && <p>Chưa có bài kiểm tra nào.</p>}
            </div>
        );
    }

    // --- GIAO DIỆN: ĐANG LÀM BÀI ---
    return (
        <div className="content-section">
            <button onClick={() => setCurrentTest(null)} style={{marginBottom: '20px'}}>← Quay lại</button>
            
            <h2 style={{borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>{currentTest.title}</h2>
            
            {score !== null ? (
                <div style={{textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px'}}>
                    <h3>Kết quả của bạn</h3>
                    <h1 style={{color: score >= 50 ? 'green' : 'red', fontSize: '50px'}}>{score}/100</h1>
                    <p>{score >= 50 ? 'Chúc mừng! Bạn đã vượt qua.' : 'Hãy cố gắng ôn tập thêm nhé.'}</p>
                    <button onClick={() => setCurrentTest(null)} className="btn">Làm bài khác</button>
                </div>
            ) : (
                <div className="questions-list">
                    {currentTest.questions.map((q, qIndex) => (
                        <div key={qIndex} style={{ marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '8px' }}>
                            <p style={{ fontWeight: 'bold' }}>Câu {qIndex + 1}: {q.question}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {q.options.map((opt, optIndex) => (
                                    <label key={optIndex} style={{ cursor: 'pointer', padding: '5px', background: answers[qIndex] === optIndex ? '#e3f2fd' : 'transparent', borderRadius: '5px' }}>
                                        <input 
                                            type="radio" 
                                            name={`q-${qIndex}`} 
                                            checked={answers[qIndex] === optIndex}
                                            onChange={() => handleSelectOption(qIndex, optIndex)}
                                        /> 
                                        <span style={{ marginLeft: '10px' }}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button onClick={handleSubmit} className="btn" style={{ marginTop: '20px' }}>Nộp bài</button>
                </div>
            )}
        </div>
    );
};

export default AssessmentPage;