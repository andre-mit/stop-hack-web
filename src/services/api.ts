import axios from 'axios';

const api = axios.create({
    baseURL: 'https://stophack.herokuapp.com/api',
});

export default api;
