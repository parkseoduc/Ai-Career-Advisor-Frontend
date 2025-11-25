const BASE_URL = 'http://localhost:8000/api/v1';

export const getLearningResourcesApi = async (topic, difficulty, token) => {
    try {
        const params = new URLSearchParams();
        if (topic && topic !== 'all') params.append('topic', topic);
        if (difficulty && difficulty !== 'all') params.append('difficulty', difficulty);

        const response = await fetch(`${BASE_URL}/learning/?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error('Lỗi tải tài liệu');
        return data;
    } catch (error) { throw error; }
};