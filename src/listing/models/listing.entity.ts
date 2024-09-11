import { UserEntity } from 'src/auth/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ListingType } from './listingType.enum';
import { CustomLocationEntity } from 'src/location/models/location.entity';
import { ImageEntity } from './images.entity';

@Entity('listing')
export class ListingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  listingType: ListingType;

  @Column()
  price: number;

  @Column('text')
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @OneToOne(() => CustomLocationEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  customLocation: CustomLocationEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.listings)
  creator: UserEntity;

  @Column('simple-array', { nullable: true })
  imageUrls?: string[];
  @Column('simple-array', { nullable: true })
  imagePaths?: string[];
  @Column({ default: false })
  isDeleted: boolean;
  @OneToMany(() => ImageEntity, (image) => image.listing, { cascade: true })
  itemImages?: ImageEntity[];
}
