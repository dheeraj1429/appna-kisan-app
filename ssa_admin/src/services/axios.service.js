import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'https://catfact.ninja'
})

axios.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
