import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdvisorsApi, bookAppointmentApi } from '../../api/advisor_api';

const AdvisorPage = () => {
    const { user } = useAuth();
    const [advisors, setAdvisors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setLoading(true);
            getAdvisorsApi(user.token)
                .then(data => setAdvisors(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    const handleBook = async (advisor) => {
        // Demo đơn giản: Dùng prompt để nhập ngày giờ
        const dateStr = prompt(`Đặt lịch với ${advisor.headline}\nNhập ngày giờ (YYYY-MM-DD HH:MM):`, "2025-12-01 09:00");
        
        if (dateStr) {
            try {
                // Chuyển đổi sang định dạng ISO chuẩn
                const startTime = new Date(dateStr).toISOString();
                const notes = prompt("Lời nhắn cho chuyên gia:", "Mong được tư vấn về CV");
                
                await bookAppointmentApi(advisor._id, startTime, notes, user.token);
                alert("✅ Đặt lịch thành công! Kiểm tra email để nhận link họp.");
            } catch (error) {
                alert("❌ Lỗi: " + error.message);
            }
        }
    };

    return (
        <div className="content-section">
            <h2>Gặp gỡ Chuyên gia</h2>
            <p style={{marginBottom: '20px', color: '#666'}}>Kết nối trực tiếp với các Mentor hàng đầu để được tư vấn 1-1.</p>

            {loading ? <p>Đang tải...</p> : (
                <div className="advisor-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                    {advisors.map(adv => (
                        <div key={adv._id} style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center'}}>
                            <img 
                                src={adv.avatar || "https://via.placeholder.com/100"} 
                                alt="Avatar" 
                                style={{width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover'}}
                            />
                            <h3 style={{margin: '5px 0', fontSize: '18px'}}>{adv.headline}</h3>
                            <p style={{color: '#007bff', fontWeight: 'bold'}}>{adv.years_of_experience} năm kinh nghiệm</p>
                            <p style={{fontSize: '13px', color: '#555', height: '40px', overflow: 'hidden'}}>{adv.bio}</p>
                            
                            <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee'}}>
                                <span style={{display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#28a745'}}>
                                    {adv.hourly_rate?.amount.toLocaleString()} {adv.hourly_rate?.currency}/giờ
                                </span>
                                <button 
                                    onClick={() => handleBook(adv)}
                                    className="btn"
                                    style={{width: '100%'}}
                                >
                                    Đặt lịch ngay
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdvisorPage;