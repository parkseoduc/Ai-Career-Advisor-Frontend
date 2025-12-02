import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAssessmentsApi, submitAssessmentApi } from '../../api/assessment_api';

// --- THÊM IMPORT ICON ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AssessmentPage = () => {
    const { user } = useAuth();
    const [tests, setTests] = useState([]);
    const [currentTest, setCurrentTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    useEffect(() => {
        if (user) {
            getAssessmentsApi(user.token).then(setTests).catch(console.error);
        }
    }, [user]);

    const startTest = (test) => {
        setCurrentTest(test);
        setAnswers({});
        setScore(null);
    };

    const handleSelectOption = (questionIndex, optionIndex) => {
        setAnswers({ ...answers, [questionIndex]: optionIndex });
    };

    const handleSubmit = async () => {
        if (!currentTest) return;
        
        let correctCount = 0;
        currentTest.questions.forEach((q, index) => {
            if (answers[index] === q.correct) correctCount++;
        });

        const finalScore = Math.round((correctCount / currentTest.questions.length) * 100);

        try {
            await submitAssessmentApi(currentTest._id, finalScore, user.token);
            setScore(finalScore);
            alert(`Bạn đạt ${finalScore}/100 điểm!`);
        } catch (error) {
            console.error("Lỗi nộp bài:", error);
        }
    };

    if (!currentTest) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-dark-50 to-accent-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-extrabold text-center text-dark-800 mb-8">Kiểm tra năng lực</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tests.map(test => (
                            <div key={test._id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <h3 className="text-xl font-bold text-primary-600 mb-2">{test.title}</h3>
                                <p className="text-dark-600 mb-4">{test.description}</p>
                                <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                                    {test.difficulty}
                                </span>
                                <button 
                                    onClick={() => startTest(test)} 
                                    className="w-full py-2 bg-gradient-to-r from-success-500 to-success-600 text-white font-bold rounded-lg hover:from-success-600 hover:to-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transform transition-all hover:scale-105"
                                >
                                    Làm bài ngay
                                </button>
                            </div>
                        ))}
                    </div>
                    {tests.length === 0 && <p className="text-center text-dark-600 mt-8">Chưa có bài kiểm tra nào.</p>}
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-dark-50 to-accent-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button 
                    onClick={() => setCurrentTest(null)} 
                    className="mb-6 text-primary-600 hover:text-primary-800 font-semibold flex items-center"
                >
                    {/* --- THAY THẾ ICON --- */}
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Quay lại
                </button>
                
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-dark-800 border-b border-gray-200 pb-4 mb-6">{currentTest.title}</h2>
                    
                    {score !== null ? (
                        <div className="text-center p-12">
                            <h3 className="text-2xl font-bold text-dark-700 mb-4">Kết quả của bạn</h3>
                            <h1 className={`text-6xl font-bold ${score >= 50 ? 'text-success-500' : 'text-red-500'}`}>{score}/100</h1>
                            <p className="text-lg text-dark-600 mb-6">{score >= 50 ? 'Chúc mừng! Bạn đã vượt qua.' : 'Hãy cố gắng ôn tập thêm nhé.'}</p>
                            <button onClick={() => setCurrentTest(null)} className="px-6 py-3 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition-colors">Làm bài khác</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {currentTest.questions.map((q, qIndex) => (
                                <div key={qIndex} className="p-6 bg-gray-50 rounded-lg">
                                    <p className="font-bold text-lg text-dark-800 mb-4">Câu {qIndex + 1}: {q.question}</p>
                                    <div className="space-y-3">
                                        {q.options.map((opt, optIndex) => (
                                            <label 
                                                key={optIndex} 
                                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${answers[qIndex] === optIndex ? 'bg-primary-100 border-2 border-primary-500' : 'bg-white border-2 border-gray-200 hover:bg-gray-100'}`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name={`q-${qIndex}`} 
                                                    checked={answers[qIndex] === optIndex}
                                                    onChange={() => handleSelectOption(qIndex, optIndex)}
                                                    className="mr-3"
                                                /> 
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button onClick={handleSubmit} className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-all hover:scale-105">Nộp bài</button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AssessmentPage;