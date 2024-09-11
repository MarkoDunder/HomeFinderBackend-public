import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const apiKey = configService.get<string>('COUNTRY_STATE_CITY_API_KEY');

if (!apiKey) {
  throw new Error('API key is not set in the environment variables');
}

interface CreateAxiosDefaults<D = any>
  extends Omit<AxiosRequestConfig<D>, 'headers'> {
  headers?: RawAxiosRequestHeaders;
}

const axiosConfig: CreateAxiosDefaults = {
  baseURL: 'https://api.countrystatecity.in/v1',
  headers: {
    'X-CSCAPI-KEY': apiKey!,
  } as RawAxiosRequestHeaders,
};

export const axiosInstance: AxiosInstance = axios.create(axiosConfig);
