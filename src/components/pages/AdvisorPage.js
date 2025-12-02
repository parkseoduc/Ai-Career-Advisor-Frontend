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
        const dateStr = prompt(`Đặt lịch với ${advisor.headline}\nNhập ngày giờ (YYYY-MM-DD HH:MM):`, "2025-12-01 09:00");
        
        if (dateStr) {
            try {
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
        <section className="min-h-screen bg-gradient-to-br from-dark-50 to-accent-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-dark-800 mb-4">
                    Gặp gỡ Chuyên gia
                </h2>
                <p className="text-center text-lg text-dark-600 mb-12">
                    Kết nối trực tiếp với các Mentor hàng đầu để được tư vấn 1-1.
                </p>

                {loading ? (
                    <p className="text-center text-dark-600">Đang tải...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {advisors.map(adv => (
                            <div key={adv._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center p-6">
                                <img 
                                    src={adv.avatar || "https://via.placeholder.com/100"} 
                                    alt="Avatar" 
                                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-xl font-bold text-dark-800 mb-1">{adv.headline}</h3>
                                <p className="text-primary-600 font-bold mb-2">{adv.years_of_experience} năm kinh nghiệm</p>
                                <p className="text-sm text-dark-500 mb-4 line-clamp-2">{adv.bio}</p>
                                
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <span className="block mb-3 font-bold text-success-600 text-lg">
                                        {adv.hourly_rate?.amount.toLocaleString()} {adv.hourly_rate?.currency}/giờ
                                    </span>
                                    <button 
                                        onClick={() => handleBook(adv)}
                                        className="w-full py-2 bg-gradient-to-r from-success-500 to-success-600 text-white font-bold rounded-lg hover:from-success-600 hover:to-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transform transition-all hover:scale-105"
                                    >
                                        Đặt lịch ngay
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdvisorPage;