import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLearningResourcesApi } from '../../api/learning_api';

// --- THÊM IMPORT ICON ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const LearningPage = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [topic, setTopic] = useState('all');
    const [difficulty, setDifficulty] = useState('all');
    const [loading, setLoading] = useState(false);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const data = await getLearningResourcesApi(topic, difficulty, user.token);
            setResources(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchResources();
        // eslint-disable-next-line
    }, [topic, difficulty]);

    return (
        <section className="min-h-screen bg-gradient-to-br from-dark-50 to-accent-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-dark-800 mb-8">Góc học tập & Phát triển</h2>
                
                <div className="flex flex-wrap gap-4 mb-12 justify-center">
                    <select value={topic} onChange={(e) => setTopic(e.target.value)} className="px-5 py-3 rounded-lg border border-dark-200 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all">
                        <option value="all">Tất cả chủ đề</option>
                        <option value="Python">Python</option>
                        <option value="React">ReactJS</option>
                        <option value="Interview">Phỏng vấn</option>
                        <option value="Soft Skills">Kỹ năng mềm</option>
                    </select>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="px-5 py-3 rounded-lg border border-dark-200 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all">
                        <option value="all">Tất cả trình độ</option>
                        <option value="beginner">Cơ bản</option>
                        <option value="intermediate">Trung bình</option>
                        <option value="advanced">Nâng cao</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading && <p className="text-center col-span-full text-dark-600">Đang tải...</p>}
                    {!loading && resources.length === 0 && <p className="text-center col-span-full text-dark-600">Chưa có tài liệu nào phù hợp.</p>}
                    {!loading && resources.map(res => (
                        <div key={res._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative">
                            <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full text-white ${res.type === 'video' ? 'bg-red-500' : 'bg-green-500'}`}>
                                {res.type === 'video' ? 'Video' : 'Bài viết'}
                            </span>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-dark-800 mb-2">{res.title}</h3>
                                <p className="text-dark-600 mb-4 line-clamp-3">{res.description}</p>
                                <a href={res.url} target="_blank" rel="noreferrer" className="inline-flex items-center font-bold text-primary-600 hover:text-primary-800 transition-colors">
                                    Xem ngay 
                                    {/* --- THAY THẾ ICON --- */}
                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LearningPage;