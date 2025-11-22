import React, { useState } from 'react';

function CVPage() {
    const [cvData, setCvData] = useState({
        name: 'Nguyễn Văn A',
        email: 'a.nguyen@email.com',
        phone: '09xxxxxxxx',
        address: 'Hà Nội',
        objective: 'Trở thành một chuyên gia Digital Marketing giỏi, có khả năng quản lý các chiến dịch quy mô lớn và đóng góp vào sự phát triển bền vững của công ty.',
        experience: {
            company: 'Công ty ABC',
            position: 'Chuyên viên Digital Marketing',
            duration: '2021 - Nay',
            description: '- Lên kế hoạch và thực thi các chiến dịch SEO, Google Ads, Facebook Ads.\n- Phân tích và báo cáo hiệu quả chiến dịch.\n- Tối ưu hóa tỷ lệ chuyển đổi.'
        }
    });

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

    const handleSave = () => {
        alert('Đã lưu thông tin CV! (Kiểm tra console để xem dữ liệu)');
        console.log('Dữ liệu CV đã lưu:', cvData);
    };

    return (
        <section id="cv-content" className="content-section">
            <h2>Quản lý Hồ sơ (CV)</h2>
            <div className="cv-form-section">
                <h3>Thông tin cá nhân</h3>
                <div className="cv-form-grid">
                    <div className="form-group">
                        <label htmlFor="cv-name">Họ và Tên</label>
                        <input type="text" id="cv-name" name="name" value={cvData.name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv-email">Email</label>
                        <input type="email" id="cv-email" name="email" value={cvData.email} onChange={handleInputChange} />
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
                    <textarea id="cv-objective" rows="4" name="objective" value={cvData.objective} onChange={handleInputChange}></textarea>
                </div>
            </div>

            <div className="cv-form-section" style={{ marginTop: '20px' }}>
                <h3>Kinh nghiệm làm việc</h3>
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
                        <input type="text" id="cv-duration" name="experience.duration" value={cvData.experience.duration} onChange={handleInputChange} />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="cv-description">Mô tả công việc</label>
                        <textarea id="cv-description" rows="4" name="experience.description" value={cvData.experience.description} onChange={handleInputChange}></textarea>
                    </div>
                </div>
            </div>
            <button className="btn" style={{ width: 'auto', marginTop: '20px' }} onClick={handleSave}>Lưu thay đổi</button>
        </section>
    );
}

export default CVPage;