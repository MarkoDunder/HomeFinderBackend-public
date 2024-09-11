import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';
import { Observable } from 'rxjs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}
  @Get('/countries')
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ status: 200, description: 'List of all countries' })
  getAllCountries(): Observable<any> {
    return this.locationService.getCountries();
  }

  @Get('/countries/:countryCode/cities')
  @ApiOperation({ summary: 'Get cities by country code' })
  @ApiParam({ name: 'countryCode', type: String, description: 'Country code' })
  @ApiResponse({ status: 200, description: 'List of cities by country code' })
  getCitiesByCountry(
    @Param('countryCode') countryCode: string,
  ): Observable<any> {
    return this.locationService.getCitiesByCountry(countryCode);
  }
}
