import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCVProfileApi, updateCVProfileApi, uploadCVApi } from '../../api/cv_api';

// --- THÊM IMPORT ICON ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function CVPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [cvData, setCvData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        objective: '',
        experience: { company: '', position: '', duration: '', description: '' }
    });

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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadCVApi(file, user.token);
            alert("✅ " + result.message);

            if (result.jobs && result.jobs.length > 0) {
                setRecommendedJobs(result.jobs);
            }

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
        <section className="min-h-screen bg-gradient-to-br from-dark-50 to-accent-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-dark-800 mb-8">Quản lý Hồ sơ (CV)</h2>

                {/* --- KHU VỰC UPLOAD CV --- */}
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-dashed border-primary-300 mb-8">
                    <h3 className="text-xl font-bold text-dark-800 mb-2">📄 Tải lên CV (PDF) để tìm việc nhanh</h3>
                    <p className="text-sm text-dark-600 mb-4">Hệ thống sẽ đọc CV của bạn và tự động gợi ý công việc phù hợp nhất.</p>

                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />

                    {uploading && <p className="text-primary-600 mt-4">🤖 AI đang đọc CV của bạn...</p>}

                    {recommendedJobs.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-lg font-bold text-success-600 mb-3">✨ Công việc phù hợp với CV của bạn:</h4>
                            <div className="space-y-3">
                                {recommendedJobs.map(job => (
                                    <div key={job._id || job.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-success-500">
                                        <strong className="text-dark-800">{job.title}</strong> - <span className="text-dark-600">{job.company}</span>
                                        <br />
                                        <small className="text-dark-500">
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

                {/* --- FORM NHẬP LIỆU --- */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <h3 className="text-2xl font-bold text-dark-800 mb-4">Thông tin cá nhân</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cv-name" className="block text-sm font-semibold text-gray-700">Họ và Tên</label>
                            <input type="text" id="cv-name" name="name" value={cvData.name} onChange={handleInputChange} placeholder="Nhập họ tên" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="cv-email" className="block text-sm font-semibold text-gray-700">Email (Không thể sửa)</label>
                            <input type="email" id="cv-email" name="email" value={cvData.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="cv-phone" className="block text-sm font-semibold text-gray-700">Số điện thoại</label>
                            <input type="tel" id="cv-phone" name="phone" value={cvData.phone} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="cv-address" className="block text-sm font-semibold text-gray-700">Địa chỉ</label>
                            <input type="text" id="cv-address" name="address" value={cvData.address} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <h3 className="text-2xl font-bold text-dark-800 mb-4">Mục tiêu nghề nghiệp</h3>
                    <div>
                        <textarea id="cv-objective" rows="4" name="objective" value={cvData.objective} onChange={handleInputChange} placeholder="Mô tả ngắn gọn về mục tiêu..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"></textarea>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <h3 className="text-2xl font-bold text-dark-800 mb-4">Kinh nghiệm làm việc (Gần nhất)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="cv-company" className="block text-sm font-semibold text-gray-700">Tên công ty</label>
                            <input type="text" id="cv-company" name="experience.company" value={cvData.experience.company} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="cv-position" className="block text-sm font-semibold text-gray-700">Vị trí</label>
                            <input type="text" id="cv-position" name="experience.position" value={cvData.experience.position} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="cv-duration" className="block text-sm font-semibold text-gray-700">Thời gian</label>
                            <input type="text" id="cv-duration" name="experience.duration" value={cvData.experience.duration} onChange={handleInputChange} placeholder="VD: 2021 - Nay" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="cv-description" className="block text-sm font-semibold text-gray-700">Mô tả công việc</label>
                            <textarea id="cv-description" rows="4" name="experience.description" value={cvData.experience.description} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"></textarea>
                        </div>
                    </div>
                </div>

                <button onClick={handleSave} disabled={loading} className="w-full md:w-auto px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><FontAwesomeIcon icon={faSpinner} spin /> Đang lưu...</> : 'Lưu thay đổi'}
                </button>
            </div>
        </section>
    );
}

export default CVPage;