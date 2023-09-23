import axios from 'axios';

// const BASE_URL_PREFIX = import.meta.env.VITE_API_BASEURL;

// const BASE_URL_PREFIX = window.meta_config.development.BASE_URL;
const env = import.meta.env.MODE;
const BASE_URL_PREFIX = window.getMetaConfig(env).BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL_PREFIX,
  timeout: 1000 * 30,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const service = {
  get(url, data) {
    return axiosInstance.get(url, { params: data });
  },

  post(url, data) {
    return axiosInstance.post(url, data);
  },

  put(url, data) {
    return axiosInstance.put(url, data);
  },

  delete(url, data) {
    return axiosInstance.delete(url, data);
  },

  upload: (url, file) =>
    axiosInstance.post(url, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default service;
