import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/auth/models/user.entity';
import { ListingEntity } from 'src/listing/models/listing.entity';

@Entity('bookmark')
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.bookmarks, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => ListingEntity, { onDelete: 'CASCADE' })
  listing: ListingEntity;
}
