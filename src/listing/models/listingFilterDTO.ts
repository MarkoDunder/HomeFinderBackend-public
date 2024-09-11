import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { ListingType } from './listingType.enum';

export class ListingFilterDTO {
  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceFrom?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceTo?: number;

  @IsOptional()
  @IsString()
  city?: string;
}
