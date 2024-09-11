import { Injectable } from '@nestjs/common';
import { UserEntity } from '../auth/models/user.entity';
import { BookmarkEntity } from './entities/bookmark.entity';
import { ListingEntity } from '../listing/models/listing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
  ) {}
  async bookmark(user: UserEntity, listingId: number): Promise<BookmarkEntity> {
    const bookmark = new BookmarkEntity();
    bookmark.user = user;
    bookmark.listing = { id: listingId } as ListingEntity;
    return this.bookmarkRepository.save(bookmark);
  }

  async removeBookmark(user: UserEntity, listingId: number): Promise<void> {
    await this.bookmarkRepository.delete({
      user: { id: user.id } as any,
      listing: { id: listingId } as any,
    });
  }
  async findAllBookMarksOfUsersOnItems(
    user: UserEntity,
  ): Promise<BookmarkEntity[]> {
    return this.bookmarkRepository.find({
      where: { user },
      relations: [
        'listing',
        'listing.creator',
        'listing.customLocation',
        'listing.itemImages',
      ],
    });
  }
}
