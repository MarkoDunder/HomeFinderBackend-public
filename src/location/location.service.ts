import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map, from } from 'rxjs';
import { axiosInstance } from './config/axios.config';
import { AxiosResponse } from 'axios';

@Injectable()
export class LocationService {
  private readonly apiUrl = 'https://api.countrystatecity.in/v1';
  private readonly apiKey = process.env.COUNTRY_STATE_CITY_API_KEY;

  constructor(private httpService: HttpService) {}

  getCountries(): Observable<any> {
    const url = '/countries';

    return from(axiosInstance.get(url)).pipe(
      map((response: AxiosResponse) => response.data)
    );
  }

  getCitiesByCountry(country: string): Observable<any> {
    const url = `/countries/${country}/cities`;
   return  from(axiosInstance.get(url)).pipe(
      map((response: AxiosResponse) => response.data)
    );
  }

}
