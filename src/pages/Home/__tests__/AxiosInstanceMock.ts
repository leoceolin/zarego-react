import axios from 'axios'
import MockAdapter from 'axios-mock-adapter';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
});

export const axiosMockAdapterInstance = new MockAdapter(AxiosInstance, { delayResponse: 0 });
