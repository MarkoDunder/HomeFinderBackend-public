import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ListingType } from '../models/listingType.enum';
import { ImageDto } from './image.dto';
import { CustomLocation } from 'src/location/models/location.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CustomLocationDTO } from '../../location/models/custom_location_dto';

export class CreateListingDTO {
  @ApiProperty({ description: 'The title of the listing', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({ description: 'The type of the listing', enum: ListingType })
  @IsNotEmpty()
  @IsEnum(ListingType)
  listingType: ListingType;

  @ApiProperty({ description: 'The price of the listing' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'The description of the listing' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The custom location of the listing',
    type: CustomLocationDTO,
    required: false,
  })
  customLocation: CustomLocationDTO;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @ApiPropertyOptional({
    type: [ImageDto],
    description: 'Array of images for the listing',
  }) // Add Swagger property (optional)
  itemImages: ImageDto[];
}
