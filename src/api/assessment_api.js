const BASE_URL = 'http://localhost:8000/api/v1';

export const getAssessmentsApi = async (token) => {
    const res = await fetch(`${BASE_URL}/assessments/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
};

export const submitAssessmentApi = async (assessmentId, score, token) => {
    const res = await fetch(`${BASE_URL}/assessments/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ assessment_id: assessmentId, score: score })
    });
    return await res.json();
};