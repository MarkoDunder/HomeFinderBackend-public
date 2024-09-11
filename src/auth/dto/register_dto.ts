import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Role } from '../models/role.enum';
import { Listing } from '../../listing/models/listing.interface';
import { CreateListingDTO } from '../../listing/dto/createListing.dto';

export class BaseRegisterDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: true })
  email?: string;

  @ApiProperty({ required: true })
  password?: string;

  @ApiProperty({ required: false })
  imagePath?: string;

  @ApiProperty({ required: false, enum: Role })
  role?: Role;

  @ApiProperty({ type: [CreateListingDTO], required: false })
  listings: Listing[];
}
export class RegisterDto extends PartialType(BaseRegisterDto) {}
