import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @IsString()
  @ApiProperty({ description: 'URL of the image' }) // Add Swagger property
  url: string;
}
