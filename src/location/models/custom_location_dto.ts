import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CustomLocationDTO {
  @ApiProperty({
    description: 'The unique identifier of the location',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({
    description: 'The country code of the location',
    required: false,
  })
  @IsString()
  @IsOptional()
  countryCode: string;

  @ApiProperty({
    description: 'The country name of the location',
    required: false,
  })
  @IsString()
  @IsOptional()
  countryName: string;

  @ApiProperty({
    description: 'this is home address',
    required: false,
  })
  @IsString()
  @IsOptional()
  homeAddress: string;


  @ApiProperty({ description: 'The city of the location', required: false })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ description: 'The zip code of the location', required: false })
  @IsString()
  @IsOptional()
  zipCode: string;

  @ApiProperty({
    description: 'The street name of the location',
    required: false,
  })
  @IsString()
  @IsOptional()
  streetName: string;

  @ApiProperty({
    description: 'The street number of the location',
    required: false,
  })
  @IsString()
  @IsOptional()
  streetNumber: string;
}