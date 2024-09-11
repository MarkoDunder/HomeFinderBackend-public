import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { LocationController } from './location.controller';
import { CustomLocationEntity } from './models/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomLocationEntity]), HttpModule],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService, HttpModule],
})
export class CustomLocationModule {}
