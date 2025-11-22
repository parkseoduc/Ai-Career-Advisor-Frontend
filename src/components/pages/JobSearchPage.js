import React, { useState } from 'react';

function JobSearchPage() {
    const [jobs] = useState([
        { id: 1, title: 'Chuyên viên Digital Marketing', company: 'Công ty Cổ phần XYZ', location: 'Hà Nội', salary: '15-20 triệu', experience: '2 năm kinh nghiệm' },
        { id: 2, title: 'Nhân viên SEO Content', company: 'Tập đoàn GHI', location: 'TP. Hồ Chí Minh', salary: '10-15 triệu', experience: '1 năm kinh nghiệm' },
        { id: 3, title: 'Frontend Developer (React)', company: 'Công ty StartUp KLM', location: 'Đà Nẵng', salary: '25-35 triệu', experience: '3 năm kinh nghiệm' },
        { id: 4, title: 'Quản lý Marketing', company: 'Thương hiệu NOP', location: 'Hà Nội', salary: '30-45 triệu', experience: '5 năm kinh nghiệm' }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [industry, setIndustry] = useState('Tất cả ngành nghề');

    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Tìm kiếm với từ khóa: "${searchTerm}" và ngành: "${industry}"`);
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
                    <option>Tất cả ngành nghề</option>
                    <option>Công nghệ thông tin</option>
                    <option>Marketing / Truyền thông</option>
                    <option>Kế toán / Kiểm toán</option>
                </select>
                <button type="submit" className="btn" style={{ width: 'auto', padding: '0 20px' }}><i className="fas fa-search"></i> Tìm kiếm</button>
            </form>

            <div className="job-list">
                {jobs.map(job => (
                    <div className="job-card" key={job.id}>
                        <h4>{job.title}</h4>
                        <div className="company">{job.company}</div>
                        <div className="details">
                            <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                            <span><i className="fas fa-money-bill-wave"></i> {job.salary}</span>
                            <span><i className="fas fa-briefcase"></i> {job.experience}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default JobSearchPage;