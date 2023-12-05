import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
})

axios.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
