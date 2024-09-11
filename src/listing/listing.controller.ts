import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { Listing } from './models/listing.interface';
import { Observable } from 'rxjs';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateListingDTO } from './dto/createListing.dto';
import { UpdateListingDTO } from './dto/updateListing.dto';
import { AmazonS3UploadService } from 'src/auth/services/amazonS3.upload.service';
import { ListingEntity } from './models/listing.entity';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ListingFilterDTO } from './models/listingFilterDTO';

@Controller('listing')
export class ListingController {
  constructor(
    private listingService: ListingService,
    private s3Service: AmazonS3UploadService,
  ) {}

  @Get('all')
  findAllListings2(): Promise<ListingEntity[]> {
    console.error('error');
    return this.listingService.findAllListings2();
  }
  @Get('/rent')
  getRented(): Observable<ListingEntity[]> {
    return this.listingService.findRentListings();
  }

  @Get('/sale')
  getForSale(): Observable<ListingEntity[]> {
    return this.listingService.findSaleListings();
  }

  @Get(':id')
  findById(@Param('id') id: number): Observable<Listing> {
    return this.listingService.findListingById(id);
  }

  @Post('/filter')
  @ApiOperation({ summary: 'Filter listings by title, price and type' })
  filterListings(
    @Body() filterDto: ListingFilterDTO,
  ): Promise<ListingEntity[]> {
    return this.listingService.filterListing(filterDto);
  }

  @Post(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete a listing' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the listing to be soft deleted',
  })
  @ApiResponse({
    status: 200,
    description: 'The listing has been successfully soft deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Listing not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async softDeleteListing(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return await this.listingService.softDeleteListing(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  create(
    @Body() listing: CreateListingDTO,
    @Request() req,
  ): Promise<ListingEntity> {
    return this.listingService.createListing(req.user, listing);
  }

  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved listings by user.',
    type: [ListingEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('/getListingByUser')
  getAllListingByUser(@Request() req): Observable<ListingEntity[]> {
    return this.listingService.findAllByCreatorId(req.user);
  }

  // @Post('upload-image')
  // @UseInterceptors(FileInterceptor('image'))
  // async uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<{ imageUrl: string }> {
  //   const key = `listing-images/${Date.now()}-${file.originalname}`;
  //   const imageUrl = await this.s3Service.uploadFile(file, key);
  //   return { imageUrl };
  // }

  @Post('uploadingImageToListing')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The image file to be uploaded',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The URL of the uploaded image',
    schema: {
      type: 'object',
      properties: {
        imageUrl: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image') as any) // Workaround with 'any' type assertion
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    const key = `listing-images/${Date.now()}-${file.originalname}`;
    const imageUrl = await this.s3Service.uploadFile(file, key);
    return { imageUrl };
  }

  @Post('add-image-to-listing')
  async addImageToListing(
    @Body() { listingId, imageUrl }: { listingId: number; imageUrl: string },
  ) {
    return this.listingService.addUploadFileUrls(listingId, [imageUrl]);
  }

  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id/update')
  async update(
    @Param('id') id: number,
    @Body() listing: CreateListingDTO,
  ): Promise<ListingEntity> {
    console.error('error updating');

    return this.listingService.updateListing(id, listing);
  }

  @Put('update2/:id')
  @ApiOperation({ summary: 'Update a listing' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the listing to update',
    type: Number,
  })
  @ApiBody({
    description: 'The data to update the listing with',
    type: CreateListingDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Listing updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 404,
    description: 'Listing not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  //@Roles(Role.USER, Role.ADMIN)
  //@UseGuards(JwtGuard, IsCreatorGuard)
  async update2(
    @Param('id') id: number,
    @Body() listing: CreateListingDTO,
  ): Promise<void> {
    console.error('error updating');
    return this.listingService.updateListing2(id, listing);
  }
}
