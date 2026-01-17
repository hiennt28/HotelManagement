import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự động gửi token nếu đã đăng nhập
api.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
    }
    return config;
});

export default api;