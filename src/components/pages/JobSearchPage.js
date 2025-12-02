import React, { useState, useEffect } from 'react';
import { searchJobsApi } from '../../api/job_api';
import { applyJobApi } from '../../api/application_api';
import { useAuth } from '../../context/AuthContext';

// --- THÊM IMPORT ICON ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faMoneyBillWave, faBriefcase } from '@fortawesome/free-solid-svg-icons';

function JobSearchPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [industry, setIndustry] = useState('all');
    const [loading, setLoading] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await searchJobsApi(searchTerm, industry);
            setJobs(data);
        } catch (error) {
            console.error("Lỗi tìm việc:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        // eslint-disable-next-line
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleApply = async (jobId) => {
        if (!user) {
            alert("Vui lòng đăng nhập để ứng tuyển!");
            return;
        }
        if (!window.confirm("Bạn có chắc muốn ứng tuyển công việc này?")) return;
        try {
            await applyJobApi(jobId, user.token);
            alert("✅ Ứng tuyển thành công! Nhà tuyển dụng sẽ sớm liên hệ.");
        } catch (error) {
            alert("❌ " + error.message);
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-dark-50 to-dark-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-dark-800 mb-8">Tìm việc làm</h2>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-12">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo từ khóa (VD: Marketing, Node.js...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-5 py-3 rounded-lg border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="px-5 py-3 rounded-lg border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                        <option value="all">Tất cả ngành nghề</option>
                        <option value="it">Công nghệ thông tin</option>
                        <option value="marketing">Marketing / Truyền thông</option>
                        <option value="sales">Kinh doanh / Bán hàng</option>
                        <option value="accounting">Kế toán / Kiểm toán</option>
                    </select>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading && <p className="text-center col-span-full text-dark-600">Đang tải danh sách việc làm...</p>}
                    {!loading && jobs.length === 0 && <p className="text-center col-span-full text-dark-600">Chưa tìm thấy công việc nào phù hợp.</p>}
                    {!loading && jobs.map(job => (
                        <div key={job.id || job._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 min-w-[3rem] bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                                        {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-dark-800 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                                        <p className="text-dark-600">{job.company}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-dark-700">
                                    <p className="flex items-center">
                                        {/* --- THAY THẾ ICON --- */}
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-primary-500" /> {job.location}
                                    </p>
                                    <p className="flex items-center">
                                        {/* --- THAY THẾ ICON --- */}
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-success-500" /> {job.salary || (job.salary_range ? "Thỏa thuận" : "Liên hệ")}
                                    </p>
                                    <p className="flex items-center">
                                        {/* --- THAY THẾ ICON --- */}
                                        <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-primary-500" /> {job.experience || 'Không yêu cầu'}
                                    </p>
                                </div>
                            </div>
                            <div className="px-6 pb-6">
                                <button onClick={() => handleApply(job._id || job.id)} className="w-full py-2 bg-gradient-to-r from-success-500 to-success-600 text-white font-bold rounded-lg hover:from-success-600 hover:to-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transform transition-all hover:scale-105">
                                    Ứng tuyển ngay
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default JobSearchPage;