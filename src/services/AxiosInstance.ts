import axios, { AxiosError, AxiosResponse, } from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  // baseURL: 'https://backend-zarego-production.up.railway.app',
  headers: {
    "Content-type": "application/json",
  },
});

AxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log(error);
    const { response = {} } = error || {};

    return Promise.reject(response);
  }
);

export default AxiosInstance;
