import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// 1. Chỉ giữ lại 1 dòng import duy nhất cho api
import { getCVProfileApi, updateCVProfileApi, uploadCVApi } from '../../api/cv_api';

function CVPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // --- State cho tính năng Upload CV ---
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [uploading, setUploading] = useState(false);

    // --- State cho Form nhập liệu ---
    const [cvData, setCvData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        objective: '',
        experience: { company: '', position: '', duration: '', description: '' }
    });

    // Load dữ liệu khi vào trang
    useEffect(() => {
        if (user && user.token) {
            setCvData(prev => ({ ...prev, email: user.email }));
            getCVProfileApi(user.token).then(data => {
                if (data) {
                    let parsedExperience = { company: '', position: '', duration: '', description: '' };
                    try { if (data.experience) parsedExperience = JSON.parse(data.experience); } catch (e) { }

                    setCvData({
                        name: data.full_name || '',
                        email: user.email,
                        phone: data.phone || '',
                        address: data.address || '',
                        objective: data.career_goal || '',
                        experience: parsedExperience
                    });
                }
            }).catch(err => console.error("Lỗi tải CV:", err));
        }
    }, [user]);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('experience.')) {
            const field = name.split('.')[1];
            setCvData(prev => ({
                ...prev,
                experience: { ...prev.experience, [field]: value }
            }));
        } else {
            setCvData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Xử lý lưu form thủ công
    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                full_name: cvData.name,
                phone: cvData.phone,
                address: cvData.address,
                career_goal: cvData.objective,
                experience: JSON.stringify(cvData.experience)
            };
            await updateCVProfileApi(payload, user.token);
            alert('✅ Đã lưu thông tin CV thành công!');
        } catch (error) {
            alert('❌ Lỗi khi lưu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý Upload CV
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadCVApi(file, user.token);
            alert("✅ " + result.message);

            // Nếu tìm thấy công việc phù hợp -> Hiển thị
            if (result.jobs && result.jobs.length > 0) {
                setRecommendedJobs(result.jobs);
            }

            // (Tùy chọn) Tự động điền tóm tắt vào ô mục tiêu nghề nghiệp
            if (result.summary) {
                setCvData(prev => ({ ...prev, objective: result.summary }));
            }

        } catch (error) {
            alert("❌ Lỗi Upload: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <section id="cv-content" className="content-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Quản lý Hồ sơ (CV)</h2>
            </div>

            {/* --- KHU VỰC UPLOAD CV --- */}
            <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px dashed #007bff' }}>
                <h3>📄 Tải lên CV (PDF) để tìm việc nhanh</h3>
                <p style={{ fontSize: '14px', color: '#555' }}>Hệ thống sẽ đọc CV của bạn và tự động gợi ý công việc phù hợp nhất.</p>

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ marginTop: '10px' }}
                />

                {uploading && <p style={{ color: 'blue', marginTop: '10px' }}>🤖 AI đang đọc CV của bạn...</p>}

                {recommendedJobs.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <h4 style={{ color: '#28a745' }}>✨ Công việc phù hợp với CV của bạn:</h4>
                        <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                            {recommendedJobs.map(job => (
                                <div key={job._id || job.id} style={{ background: 'white', padding: '10px', borderRadius: '5px', borderLeft: '4px solid #28a745' }}>
                                    <strong>{job.title}</strong> - {job.company}
                                    <br />
                                    
                                    <small>
                                        💰 {typeof job.salary_range === 'object' && job.salary_range !== null
                                            ? `${job.salary_range.min} - ${job.salary_range.max} ${job.salary_range.currency}`
                                            : job.salary_range || "Thỏa thuận"}
                                        | 📍 {job.location}
                                    </small>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* ------------------------- */}

            {/* Form nhập liệu truyền thống */}
            <div className="cv-form-section">
                <h3>Thông tin cá nhân</h3>
                <div className="cv-form-grid">
                    <div className="form-group">
                        <label htmlFor="cv-name">Họ và Tên</label>
                        <input type="text" id="cv-name" name="name" value={cvData.name} onChange={handleInputChange} placeholder="Nhập họ tên" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-email">Email (Không thể sửa)</label>
                        <input type="email" id="cv-email" name="email" value={cvData.email} disabled style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-phone">Số điện thoại</label>
                        <input type="tel" id="cv-phone" name="phone" value={cvData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-address">Địa chỉ</label>
                        <input type="text" id="cv-address" name="address" value={cvData.address} onChange={handleInputChange} />
                    </div>
                </div>
            </div>

            <div className="cv-form-section" style={{ marginTop: '20px' }}>
                <h3>Mục tiêu nghề nghiệp</h3>
                <div className="form-group full-width">
                    <textarea id="cv-objective" rows="4" name="objective" value={cvData.objective} onChange={handleInputChange} placeholder="Mô tả ngắn gọn về mục tiêu..."></textarea>
                </div>
            </div>

            <div className="cv-form-section" style={{ marginTop: '20px' }}>
                <h3>Kinh nghiệm làm việc (Gần nhất)</h3>
                <div className="cv-form-grid">
                    <div className="form-group full-width">
                        <label htmlFor="cv-company">Tên công ty</label>
                        <input type="text" id="cv-company" name="experience.company" value={cvData.experience.company} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-position">Vị trí</label>
                        <input type="text" id="cv-position" name="experience.position" value={cvData.experience.position} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-duration">Thời gian</label>
                        <input type="text" id="cv-duration" name="experience.duration" value={cvData.experience.duration} onChange={handleInputChange} placeholder="VD: 2021 - Nay" />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="cv-description">Mô tả công việc</label>
                        <textarea id="cv-description" rows="4" name="experience.description" value={cvData.experience.description} onChange={handleInputChange}></textarea>
                    </div>
                </div>
            </div>

            <button className="btn" style={{ width: 'auto', marginTop: '20px' }} onClick={handleSave} disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</> : 'Lưu thay đổi'}
            </button>
        </section>
    );
}

export default CVPage;