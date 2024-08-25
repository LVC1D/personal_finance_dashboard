import axios from 'axios';

const api = axios.create({
    baseUrl: 'http://localhost:7935',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const csrfToken = document.cookie.match(/XSRF-TOKEN=([^;]*)/)?.[1];
    if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;