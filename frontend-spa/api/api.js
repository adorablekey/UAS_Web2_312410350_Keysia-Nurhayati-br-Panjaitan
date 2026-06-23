// Setup Axios global configuration
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Backend API URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Axios Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('Sesi Anda telah habis atau Anda tidak memiliki akses. Silakan login kembali.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            
            // Redirect to login using Vue Router (will be imported globally)
            if (window.router) {
                window.router.push('/login');
            } else {
                window.location.href = '#/login';
            }
        }
        return Promise.reject(error);
    }
);
