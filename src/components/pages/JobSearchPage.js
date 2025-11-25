import React, { useState, useEffect } from 'react';
import { searchJobsApi } from '../../api/job_api';
import { applyJobApi } from '../../api/application_api';
import { useAuth } from '../../context/AuthContext'; // 1. Import thêm cái này

function JobSearchPage() {
    const { user } = useAuth(); // 2. Lấy user để có token
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [industry, setIndustry] = useState('all');
    const [loading, setLoading] = useState(false);

    // Hàm gọi API tìm kiếm
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

    // Hàm xử lý ứng tuyển
    const handleApply = async (jobId) => {
        if (!user) {
            alert("Vui lòng đăng nhập để ứng tuyển!");
            return;
        }

        if (!window.confirm("Bạn có chắc muốn ứng tuyển công việc này?")) return;

        try {
            // Gọi API ứng tuyển
            await applyJobApi(jobId, user.token);
            alert("✅ Ứng tuyển thành công! Nhà tuyển dụng sẽ sớm liên hệ.");
        } catch (error) {
            alert("❌ " + error.message);
        }
    };

    return (
        <section id="job-search-content" className="content-section">
            <h2>Tìm việc làm</h2>

            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo từ khóa (VD: Marketing, Node.js...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    <option value="all">Tất cả ngành nghề</option>
                    <option value="it">Công nghệ thông tin</option>
                    <option value="marketing">Marketing / Truyền thông</option>
                    <option value="sales">Kinh doanh / Bán hàng</option>
                    <option value="accounting">Kế toán / Kiểm toán</option>
                </select>

                <button type="submit" className="btn" style={{ width: 'auto', padding: '0 20px' }} disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
                    {loading ? ' Đang tìm...' : ' Tìm kiếm'}
                </button>
            </form>

            <div className="job-list">
                {loading && <p style={{ textAlign: 'center', color: '#666' }}>Đang tải danh sách việc làm...</p>}

                {!loading && jobs.length === 0 ? (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>Chưa tìm thấy công việc nào phù hợp.</p>
                ) : (
                    jobs.map(job => (
                        <div className="job-card" key={job.id || job._id} style={{ position: 'relative', paddingBottom: '50px' }}>
                            <h4>{job.title}</h4>
                            <div className="company">{job.company}</div>
                            
                            <div className="details">
                                <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                                <span>
                                    <i className="fas fa-money-bill-wave"></i>
                                    {/* Xử lý hiển thị lương */}
                                    {job.salary || (job.salary_range ? "Thỏa thuận" : "Liên hệ")}
                                </span>
                                <span><i className="fas fa-briefcase"></i> {job.experience || 'Không yêu cầu'}</span>
                            </div>

                            {/* 3. THÊM NÚT ỨNG TUYỂN TẠI ĐÂY */}
                            <button 
                                onClick={() => handleApply(job._id || job.id)}
                                className="btn"
                                style={{
                                    position: 'absolute',
                                    bottom: '15px',
                                    right: '15px',
                                    width: 'auto',
                                    padding: '5px 15px',
                                    fontSize: '14px',
                                    backgroundColor: '#28a745' // Màu xanh lá
                                }}
                            >
                                Ứng tuyển ngay
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default JobSearchPage;