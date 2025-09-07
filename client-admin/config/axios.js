import axios from "axios";
const token = localStorage.getItem('auth_token') || null;
const host = import.meta.env.VITE_API_HOST;

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const instance = axios.create({
    baseURL: host + '/api',
})

// if token is not null, set the Authorization header
if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token') || null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {

        console.log(error);
        

        if (error.response.status === 401) {
            localStorage.clear();
        }
        return Promise.reject(error);
    }
);

export default instance;