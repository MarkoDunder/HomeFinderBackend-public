import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn, OneToMany,
} from 'typeorm';
import { ListingEntity } from './listing.entity';
import { BookmarkEntity } from '../../bookmark/entities/bookmark.entity'; // Adjust the import path as needed

@Entity('listing_images')
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ListingEntity, (listing) => listing.itemImages, {
    onDelete: 'CASCADE',
  })
  listing: ListingEntity;

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.listing) // Add this line
  bookmarks: BookmarkEntity[]; // Add this line
}
