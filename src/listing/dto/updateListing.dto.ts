import {
  IsEnum,
  IsNumber,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { ListingType } from '../models/listingType.enum';
import { CustomLocation } from 'src/location/models/location.interface';

export class UpdateListingDTO {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsEnum(ListingType)
  listingType: ListingType;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  customLocation: CustomLocation;

  @IsOptional()
  imageUrls: string[];
}
