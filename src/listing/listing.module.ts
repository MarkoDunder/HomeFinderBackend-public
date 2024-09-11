import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingEntity } from './models/listing.entity';
import { AuthModule } from 'src/auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { LocationService } from 'src/location/location.service';
import { CustomLocationModule } from 'src/location/location.module';
import { CustomLocationEntity } from 'src/location/models/location.entity';
import { ImageEntity } from './models/images.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ListingEntity,
      CustomLocationEntity,
      ImageEntity,
    ]),
    CustomLocationModule,
  ],
  providers: [ListingService, IsCreatorGuard, LocationService],
  controllers: [ListingController],
})
export class ListingModule {}
