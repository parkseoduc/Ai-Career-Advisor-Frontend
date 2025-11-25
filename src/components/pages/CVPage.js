import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // 1. Import Context
import { getCVProfileApi, updateCVProfileApi } from '../../api/cv_api'; // 2. Import API

function CVPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // State mặc định
    const [cvData, setCvData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        objective: '',
        experience: {
            company: '',
            position: '',
            duration: '',
            description: ''
        }
    });

    // 3. LOAD DỮ LIỆU TỪ SERVER KHI VÀO TRANG
    useEffect(() => {
        if (user && user.token) {
            // Mặc định hiển thị email từ tài khoản đăng nhập
            setCvData(prev => ({ ...prev, email: user.email }));

            getCVProfileApi(user.token).then(data => {
                if (data) {
                    // Xử lý field experience: Nếu DB lưu dạng JSON string thì parse ra, không thì để rỗng
                    let parsedExperience = { company: '', position: '', duration: '', description: '' };
                    try {
                        if (data.experience) {
                            parsedExperience = JSON.parse(data.experience);
                        }
                    } catch (e) {
                        console.log("Experience không phải JSON, bỏ qua.");
                    }

                    // Ánh xạ dữ liệu từ Backend về Frontend
                    setCvData({
                        name: data.full_name || '', // Backend là full_name
                        email: user.email,          // Email lấy từ User Context
                        phone: data.phone || '',
                        address: data.address || '',
                        objective: data.career_goal || '', // Backend là career_goal
                        experience: parsedExperience
                    });
                }
            }).catch(err => console.error("Lỗi tải CV:", err));
        }
    }, [user]);

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

    // 4. LƯU DỮ LIỆU LÊN SERVER
    const handleSave = async () => {
        setLoading(true);
        try {
            // Chuẩn bị dữ liệu để gửi lên Backend (Khớp với Schema JobSeekerUpdate)
            const payload = {
                full_name: cvData.name,
                phone: cvData.phone,
                address: cvData.address,
                career_goal: cvData.objective,
                // Mẹo: Biến object experience thành chuỗi JSON để lưu vào field string của Backend
                experience: JSON.stringify(cvData.experience) 
            };

            await updateCVProfileApi(payload, user.token);
            alert('✅ Đã lưu thông tin CV thành công!');
        } catch (error) {
            console.error(error);
            alert('❌ Lỗi khi lưu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="cv-content" className="content-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Quản lý Hồ sơ (CV)</h2>
                {/* Hiển thị trạng thái loading nhỏ */}
                {loading && <span style={{color: '#007bff'}}>Đang đồng bộ...</span>}
            </div>
            
            <div className="cv-form-section">
                <h3>Thông tin cá nhân</h3>
                <div className="cv-form-grid">
                    <div className="form-group">
                        <label htmlFor="cv-name">Họ và Tên</label>
                        <input 
                            type="text" id="cv-name" name="name" 
                            value={cvData.name} onChange={handleInputChange} 
                            placeholder="Nhập họ tên"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-email">Email (Không thể sửa)</label>
                        {/* Email thường không cho sửa vì liên quan đến tài khoản */}
                        <input 
                            type="email" id="cv-email" name="email" 
                            value={cvData.email} disabled 
                            style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-phone">Số điện thoại</label>
                        <input 
                            type="tel" id="cv-phone" name="phone" 
                            value={cvData.phone} onChange={handleInputChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-address">Địa chỉ</label>
                        <input 
                            type="text" id="cv-address" name="address" 
                            value={cvData.address} onChange={handleInputChange} 
                        />
                    </div>
                </div>
            </div>

            <div className="cv-form-section" style={{ marginTop: '20px' }}>
                <h3>Mục tiêu nghề nghiệp</h3>
                <div className="form-group full-width">
                    <textarea 
                        id="cv-objective" rows="4" name="objective" 
                        value={cvData.objective} onChange={handleInputChange}
                        placeholder="Mô tả ngắn gọn về mục tiêu nghề nghiệp của bạn..."
                    ></textarea>
                </div>
            </div>

            <div className="cv-form-section" style={{ marginTop: '20px' }}>
                <h3>Kinh nghiệm làm việc (Gần nhất)</h3>
                <div className="cv-form-grid">
                    <div className="form-group full-width">
                        <label htmlFor="cv-company">Tên công ty</label>
                        <input 
                            type="text" id="cv-company" name="experience.company" 
                            value={cvData.experience.company} onChange={handleInputChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-position">Vị trí</label>
                        <input 
                            type="text" id="cv-position" name="experience.position" 
                            value={cvData.experience.position} onChange={handleInputChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-duration">Thời gian</label>
                        <input 
                            type="text" id="cv-duration" name="experience.duration" 
                            value={cvData.experience.duration} onChange={handleInputChange} 
                            placeholder="VD: 2021 - Nay"
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="cv-description">Mô tả công việc</label>
                        <textarea 
                            id="cv-description" rows="4" name="experience.description" 
                            value={cvData.experience.description} onChange={handleInputChange}
                        ></textarea>
                    </div>
                </div>
            </div>
            
            <button 
                className="btn" 
                style={{ width: 'auto', marginTop: '20px' }} 
                onClick={handleSave}
                disabled={loading}
            >
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</> : 'Lưu thay đổi'}
            </button>
        </section>
    );
}

export default CVPage;