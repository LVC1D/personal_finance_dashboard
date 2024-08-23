import axios from 'axios';

const api = axios.create({
    baseUrl: 'http://localhost:7935',
    withCredentials: true,
});

export default api;