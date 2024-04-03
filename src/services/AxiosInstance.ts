import axios, { AxiosError, AxiosResponse, } from 'axios';

const AxiosInstance = axios.create({
  headers: {
    "Content-type": "application/json",
  },
});

AxiosInstance.defaults.baseURL = `https://backend-zarego-production.up.railway.app/`;

AxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log(error);
    const { response = {} } = error || {};

    return Promise.reject(response);
  }
);

export default AxiosInstance;
