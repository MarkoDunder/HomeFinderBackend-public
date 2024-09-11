import { User } from 'src/auth/models/user.interface';
import { ListingType } from './listingType.enum';
import { CustomLocation } from 'src/location/models/location.interface';

export interface Listing {
  id?: number;
  title: string;
  listingType: ListingType;
  price: number;
  description: string;
  createdAt: Date;
  expiresAt: Date;
  creator: User;
  customLocation: CustomLocation;
  imageUrls?: string[];
  isDeleted: boolean;
}
