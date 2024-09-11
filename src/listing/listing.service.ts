import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Listing } from './models/listing.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ListingEntity } from './models/listing.entity';
import { DataSource, Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { UpdateListingDTO } from './dto/updateListing.dto';
import { CreateListingDTO } from './dto/createListing.dto';
import { UserEntity } from 'src/auth/models/user.entity';
import { map } from 'rxjs';
import { CustomLocation } from 'src/location/models/location.interface';
import { CustomLocationEntity } from 'src/location/models/location.entity';
import { AmazonS3UploadService } from 'src/auth/services/amazonS3.upload.service';
import { ListingType } from './models/listingType.enum';
import { ListingFilterDTO } from './models/listingFilterDTO';
import { ImageEntity } from './models/images.entity';
import { ILike, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(ListingEntity)
    private readonly listingRepository: Repository<ListingEntity>,
    @InjectRepository(CustomLocationEntity)
    private readonly locationRepository: Repository<CustomLocationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly s3Service: AmazonS3UploadService,
    private readonly dataSource: DataSource,
    @InjectRepository(ImageEntity)
    private itemImageRepository: Repository<ImageEntity>,
  ) {}

  findAllListings(): Observable<Listing[]> {
    return from(
      this.listingRepository.find({ relations: ['location', 'creator'] }),
    ).pipe(map((entities) => entities.map((entity) => this.toListing(entity))));
  }

  findAllListings2(): Promise<ListingEntity[]> {
    console.error('error');
    return this.listingRepository.find({
      where: {
        isDeleted: false,
      },
      relations: ['creator', 'customLocation', 'itemImages'], // Include relations here
    });
  }

  findRentListings(): Observable<ListingEntity[]> {
    return from(
      this.listingRepository.find({
        where: {
          listingType: ListingType.RENT,
          isDeleted: false,
        },
        relations: ['creator', 'customLocation', 'itemImages'],
      }),
    );
  }

  findSaleListings(): Observable<ListingEntity[]> {
    return from(
      this.listingRepository.find({
        where: {
          listingType: ListingType.SALE,
          isDeleted: false,
        },
        relations: ['creator', 'customLocation', 'itemImages'],
      }),
    );
  }

  findListingById(id: number): Observable<Listing> {
    return from(
      this.listingRepository.findOne({
        where: { id: id, isDeleted: false },
        relations: ['creator', 'customLocation', 'itemImages'],
      }),
    );
  }
  findAllByCreatorId(user: UserEntity): Observable<ListingEntity[]> {
    return from(
      this.listingRepository.find({
        where: { creator: user, isDeleted: false },
        relations: ['creator', 'customLocation', 'itemImages'],
      }),
    );
  }

  async createListing(
    user: UserEntity,
    createListingDto: CreateListingDTO,
  ): Promise<ListingEntity> {
    const { ...listingData } = createListingDto;
    try {
      let savedLocation: CustomLocationEntity | null = null;

      if (createListingDto.customLocation) {
        const locationEntity = this.locationRepository.create({
          countryCode: createListingDto.customLocation.countryCode ?? '',
          countryName: createListingDto.customLocation.countryName ?? '',
          city: createListingDto.customLocation.city ?? '',
          zipCode: createListingDto.customLocation.zipCode ?? '',
          streetName: createListingDto.customLocation.streetName ?? '',
          streetNumber: createListingDto.customLocation.streetNumber ?? '',
          homeAddress: createListingDto.customLocation.homeAddress ?? '',
        });
        savedLocation = await this.locationRepository.save(locationEntity);
      }
      // Create and save the listing entity with potentially null savedLocation

      const listingEntity = this.listingRepository.create({
        ...listingData,
        creator: user,
        customLocation: savedLocation, // Can be null if customLocation was not provided
      });

      const savedListing = await this.listingRepository.save(listingEntity);

      return savedListing;
    } catch (e) {
      console.log('' + e);
    }
  }

  async addUploadFileUrls(
    listingId: number,
    imageUrls: string[],
  ): Promise<ListingEntity> {
    const listing = await this.listingRepository.findOneBy({ id: listingId });
    if (!listing) {
      throw new HttpException('Listing not found', HttpStatus.NOT_FOUND);
    }

    listing.imageUrls = [...(listing.imageUrls || []), ...imageUrls];
    return await this.listingRepository.save(listing);
  }

  async updateListing(
    id: number,
    updateListingDto: CreateListingDTO,
  ): Promise<ListingEntity> {
    // Check if the listing exists and is not deleted
    const existingListing = await this.listingRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!existingListing) {
      throw new HttpException('Listing not found', HttpStatus.NOT_FOUND);
    }

    await this.listingRepository.update(id, {
      title: updateListingDto.title,
      listingType: updateListingDto.listingType,
      price: updateListingDto.price,
      description: updateListingDto.description,
      customLocation: updateListingDto.customLocation,
      itemImages: updateListingDto.itemImages,
    });

    // Retrieve the updated listing from the database
    const updatedListing = await this.listingRepository.findOne({
      where: { id }, // Include any relations if needed
    });

    if (!updatedListing) {
      throw new HttpException(
        'Failed to retrieve the updated listing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedListing;
  }

  async updateListing2(id: number, listingDTO: CreateListingDTO): Promise<any> {
    const { itemImages, customLocation, ...updateData } = listingDTO;

    try {
      const listing = await this.listingRepository.findOne({
        where: { id },
        relations: ['itemImages', 'customLocation'],
      });

      if (!listing) {
        throw new NotFoundException(`Listing with ID ${id} not found`);
      }

      // Update the basic listing fields
      Object.assign(listing, updateData);
      await this.listingRepository.save(listing);

      // Handle custom location update
      if (customLocation) {
        if (listing.customLocation) {
          Object.assign(listing.customLocation, customLocation);
          await this.locationRepository.save(listing.customLocation);
        } else {
          const newCustomLocation = this.locationRepository.create(customLocation);

          newCustomLocation.listing = listing;
          listing.customLocation =
            await this.locationRepository.save(newCustomLocation);
          await this.listingRepository.save(listing);
        }
      }

      // Handle item images update
      if (itemImages && itemImages.length > 0) {
        // Remove existing item images
        await this.itemImageRepository.delete({ listing });

        // Add new item images
        const newImages = itemImages.map((itemImageDTO) => {
          const newItemImage = this.itemImageRepository.create(itemImageDTO);
          newItemImage.listing = listing;
          return newItemImage;
        });
        await this.itemImageRepository.save(newImages);
      }

      // Fetch the updated listing with related item images and custom location
      const updatedListing = await this.listingRepository.findOne({
        where: { id },
        relations: ['itemImages', 'customLocation'],
      });

      return updatedListing;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw new InternalServerErrorException(
        'Internal Server Error while updating listing',
      );
    }
  }

  async softDeleteListing(id: number): Promise<any> {
    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['itemImages', 'customLocation'],
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    try {
      // Update the isDeleted column to true for soft delete
      listing.isDeleted = true;
      await this.listingRepository.save(listing);

      return listing;
    } catch (error) {
      console.error('Error soft deleting listing:', error);
      throw new InternalServerErrorException(
        'Internal Server Error while soft deleting listing',
      );
    }
  }

  
async filterListing(filterDto: ListingFilterDTO): Promise<ListingEntity[]> {
  const { listingType, title, priceFrom, priceTo, city } = filterDto;

  const whereCondition: any = {
    isDeleted: false,
  };

  if (listingType) {
    whereCondition.listingType = listingType;
  }

  if (title) {
    whereCondition.title = ILike(`%${title}%`);
  }

  if (priceFrom !== undefined && priceFrom !== null) {
    whereCondition.price = MoreThanOrEqual(priceFrom);
  }

  if (priceTo !== undefined && priceTo !== null) {
    if (!whereCondition.price) {
      whereCondition.price = LessThanOrEqual(priceTo);
    } else {
      whereCondition.price = [
        MoreThanOrEqual(priceFrom),
        LessThanOrEqual(priceTo),
      ];
    }
  }

  if (city) {
    whereCondition.customLocation = {
      city: ILike(`%${city}%`),
    };
  }

  // Use the find method to get the results and convert observable to promise
  return this.listingRepository.find({
    where: whereCondition,
    relations: ['creator', 'customLocation', 'itemImages'],
  });
}

  private calculateExpirationDate(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);
    return expiresAt;
  }

  private toListing(entity: ListingEntity): Listing {
    const {
      id,
      title,
      listingType,
      price,
      description,
      createdAt,
      expiresAt,
      creator,
      customLocation,
      imageUrls,
      isDeleted,
    } = entity;

    const mappedLocation: CustomLocation | null = customLocation
      ? {
          id: customLocation.id,
          countryCode: customLocation.countryCode,
          city: customLocation.city,
          zipCode: customLocation.zipCode,
          streetName: customLocation.streetName,
          streetNumber: customLocation.streetNumber,
        }
      : null;

    const mappedCreator = {
      id: creator.id,
      firstName: creator.firstName,
      lastName: creator.lastName,
      email: creator.email,
      listings: creator.listings
        ? creator.listings.map((listing) => ({
            id: listing.id,
            title: listing.title,
            price: listing.price,
            description: listing.description,
            listingType: listing.listingType,
            createdAt: listing.createdAt,
            expiresAt: listing.expiresAt,
            isDeleted: listing.isDeleted,
            imageUrls: listing.imageUrls,

            // Creator field can be simplified or excluded in recursive listings
            creator: {
              id: listing.creator.id,
              firstName: listing.creator.firstName,
              lastName: listing.creator.lastName,
              // Omitting recursive mappings
              email: listing.creator.email,
              listings: [], // Avoid deep recursion
            },
            customLocation: listing.customLocation
              ? {
                  id: listing.customLocation.id,
                  countryCode: listing.customLocation.countryCode,
                  city: listing.customLocation.city,
                  zipCode: listing.customLocation.zipCode,
                  streetName: listing.customLocation.streetName,
                  streetNumber: listing.customLocation.streetNumber,
                }
              : null,
          }))
        : [],
    };

    return {
      id,
      title,
      listingType,
      price,
      description,
      createdAt,
      expiresAt,
      creator: mappedCreator,
      customLocation: mappedLocation,
      imageUrls,
      isDeleted,
    };
  }
}