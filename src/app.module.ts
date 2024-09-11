import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ListingModule } from './listing/listing.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/all-exceptions.filter';
//import { ChatModule } from './chat/chat.module';
import { CustomLocationModule } from './location/location.module';
//import { RedisModule } from './redis.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { EmailModule } from './email/email.module';

// ChatModule,
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configure TypeORM module asynchronously to use ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ListingModule,
    CustomLocationModule,
    BookmarkModule,
    //RedisModule,
    EmailModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  controllers: [],
})
export class AppModule {}
