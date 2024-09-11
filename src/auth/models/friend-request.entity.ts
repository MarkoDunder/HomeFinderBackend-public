import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from 'src/auth/models/user.entity';
import { FriendRequest_Status } from './friend-request.interface';

@Entity('friend-request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.friendRequestCreator)
  creator: UserEntity;

  @Column()
  status: FriendRequest_Status;
}
