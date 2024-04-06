import MockAdapter from 'axios-mock-adapter';
import AxiosInstance from '../services/AxiosInstance';

const axiosMockInstance = AxiosInstance;

export const axiosMockAdapterInstance = new MockAdapter(axiosMockInstance, { delayResponse: 0 });
