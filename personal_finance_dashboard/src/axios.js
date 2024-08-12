import axios from 'axios';

const api = axios.create({
    baseUrl: 'http://localhost:7934',
    withCredentials: true
});

export default api;