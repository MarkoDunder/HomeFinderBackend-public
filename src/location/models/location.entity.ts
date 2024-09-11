import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ListingEntity } from '../../listing/models/listing.entity';

@Entity('custom_location')
export class CustomLocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '-' })
  homeAddress: string;

  @Column()
  countryCode: string;
  @Column()
  countryName: string;

  @Column()
  city: string;

  @Column({ default: '10000' })
  zipCode: string;

  @Column({ default: '-' })
  streetName: string;

  @Column({ default: '1' })
  streetNumber: string;

  @OneToOne(() => ListingEntity, (listing) => listing.customLocation)
  listing: ListingEntity;
}
