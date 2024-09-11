import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { FriendRequestEntity } from './models/friend-request.entity';
import { AmazonS3UploadService } from './services/amazonS3.upload.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure the ConfigModule is imported and set up
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    TypeOrmModule.forFeature([UserEntity, FriendRequestEntity]),
    CacheModule.register(),
  ],
  providers: [
    AuthService,
    JwtGuard,
    JwtStrategy,
    RolesGuard,
    UserService,
    AmazonS3UploadService,
  ],
  controllers: [AuthController, UserController],
  exports: [AuthService, UserService, AmazonS3UploadService, TypeOrmModule],
})
export class AuthModule {}
