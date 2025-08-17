import axios from "axios";
import { BACKEND_URL } from "../config";

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

//Request interceptor: Adds token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error)=> Promise.reject(error)
);


//Response interceptor: Handles 401 errors
axiosInstance.interceptors.response.use(
    (response) => response, //if response is good i.e 200, 201 etc.., then pass through
    async (error) => {  //if error then run this
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if(refreshToken){
                try {
                    const response = await axios.post(`${BACKEND_URL}/api/v1/token/refresh`, {refreshToken});

                    console.log("response in refresh axiosinstance:", response)
                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    //update authorization header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                }
                catch(refreshError){
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/signin';
                    return Promise.reject(refreshError); 
                }
            }
            else {
                window.location.href = '/signin';
            }
        }
        
        return Promise.reject(error); //pass through other errors if not 401
    }
);

export default axiosInstance;