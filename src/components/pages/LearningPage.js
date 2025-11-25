import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLearningResourcesApi } from '../../api/learning_api';

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
    }, [topic, difficulty]); // Tự động gọi lại khi filter thay đổi

    return (
        <div className="content-section">
            <h2>Góc học tập & Phát triển</h2>
            
            {/* Bộ lọc */}
            <div className="filter-bar" style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
                <select 
                    value={topic} onChange={(e) => setTopic(e.target.value)}
                    style={{padding: '10px', borderRadius: '5px', border: '1px solid #ddd'}}
                >
                    <option value="all">Tất cả chủ đề</option>
                    <option value="Python">Python</option>
                    <option value="React">ReactJS</option>
                    <option value="Interview">Phỏng vấn</option>
                    <option value="Soft Skills">Kỹ năng mềm</option>
                </select>

                <select 
                    value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                    style={{padding: '10px', borderRadius: '5px', border: '1px solid #ddd'}}
                >
                    <option value="all">Tất cả trình độ</option>
                    <option value="beginner">Cơ bản</option>
                    <option value="intermediate">Trung bình</option>
                    <option value="advanced">Nâng cao</option>
                </select>
            </div>

            {/* Danh sách tài liệu */}
            <div className="resources-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                {loading ? <p>Đang tải...</p> : resources.map(res => (
                    <div key={res._id} className="resource-card" style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
                        {/* Badge loại tài liệu */}
                        <span style={{
                            background: res.type === 'video' ? '#ff4757' : '#2ed573',
                            color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                        }}>
                            {res.type === 'video' ? 'Video' : 'Bài viết'}
                        </span>
                        
                        <h3 style={{marginTop: '10px', fontSize: '18px'}}>{res.title}</h3>
                        <p style={{color: '#666', fontSize: '14px', height: '40px', overflow: 'hidden'}}>{res.description}</p>
                        
                        <a 
                            href={res.url} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{display: 'inline-block', marginTop: '15px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold'}}
                        >
                            Xem ngay <i className="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                ))}
            </div>
            
            {!loading && resources.length === 0 && <p style={{textAlign: 'center'}}>Chưa có tài liệu nào phù hợp.</p>}
        </div>
    );
};

export default LearningPage;