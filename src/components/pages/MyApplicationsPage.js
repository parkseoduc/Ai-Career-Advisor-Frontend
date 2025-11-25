import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyApplicationsApi } from '../../api/application_api';

const MyApplicationsPage = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.token) {
            getMyApplicationsApi(user.token)
                .then(data => setApplications(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    // Hàm tô màu trạng thái
    const getStatusColor = (status) => {
        if (status === 'Đang chờ duyệt') return 'orange';
        if (status === 'Đã duyệt') return 'green';
        return 'gray';
    };

    return (
        <div className="content-section">
            <h2>Lịch sử ứng tuyển</h2>
            
            {loading ? <p>Đang tải...</p> : (
                <div className="applications-list">
                    {applications.length === 0 ? <p>Bạn chưa ứng tuyển công việc nào.</p> : (
                        <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden'}}>
                            <thead style={{background: '#f4f4f4', textAlign: 'left'}}>
                                <tr>
                                    <th style={{padding: '15px'}}>Vị trí</th>
                                    <th style={{padding: '15px'}}>Công ty</th>
                                    <th style={{padding: '15px'}}>Ngày nộp</th>
                                    <th style={{padding: '15px'}}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app._id} style={{borderBottom: '1px solid #eee'}}>
                                        <td style={{padding: '15px', fontWeight: 'bold', color: '#007bff'}}>
                                            {app.job_title}
                                        </td>
                                        <td style={{padding: '15px'}}>{app.company}</td>
                                        <td style={{padding: '15px'}}>
                                            {new Date(app.applied_at).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td style={{padding: '15px'}}>
                                            <span style={{
                                                padding: '5px 10px', 
                                                borderRadius: '15px', 
                                                color: 'white',
                                                fontSize: '12px',
                                                backgroundColor: getStatusColor(app.status)
                                            }}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyApplicationsPage;