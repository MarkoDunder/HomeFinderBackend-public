import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { ListingEntity } from 'src/listing/models/listing.entity';
import { FriendRequestEntity } from './friend-request.entity';
import { BookmarkEntity } from '../../bookmark/entities/bookmark.entity';


@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => ListingEntity, (listingEntity) => listingEntity.creator)
  listings: ListingEntity[];

  @OneToMany(
    () => FriendRequestEntity,
    (friendRequestEntity) => friendRequestEntity.creator,
  )
  friendRequestCreator: FriendRequestEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user) // Add this line
  bookmarks: BookmarkEntity[]; // Add this line
}
