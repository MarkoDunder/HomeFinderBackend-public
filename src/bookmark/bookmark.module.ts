import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from './entities/bookmark.entity';
import { UserEntity } from '../auth/models/user.entity';
import { ListingEntity } from '../listing/models/listing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity, UserEntity, ListingEntity]),
  ],
  providers: [BookmarkService],
  controllers: [BookmarkController],
  exports: [BookmarkService],
})
export class BookmarkModule {}
