import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { from, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { BaseRegisterDto } from '../dto/register_dto';
import { LoginDto } from '../dto/login_dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Inject cache manager

  ) {}
  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  registerAccount(
    user: BaseRegisterDto,
  ): Observable<{ token: string; user: User }> {
    const { firstName, lastName, email, password } = user;

    return this.hashPassword(password).pipe(
      switchMap((hashedPassword: string) => {
        if (!user) {
          //throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Invalid credentials' },
            HttpStatus.NOT_FOUND,
          );
        }

        return from(
          this.userRepository.save({
            firstName,
            lastName,
            email,
            password: hashedPassword,
          }),
        ).pipe(
          switchMap((savedUser: User) => {
            return from(
              this.jwtService.signAsync({
                id: savedUser.id,
                email: savedUser.email,
              }),
            ).pipe(
              map((token: string) => {
                delete savedUser.password;
                return { user: savedUser, token };
              }),
            );
          }),
        );
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { email },
        select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
      }),
    ).pipe(
      switchMap((user: User) =>
        from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password;
              return user;
            }
          }),
        ),
      ),
    );
  }
  login(user: LoginDto): Observable<{ token: string; user: User }> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
          return from(this.jwtService.signAsync({ user })).pipe(
            switchMap((jwt: string) => 
              // Use `switchMap` here for handling the async cache reset
              from(this.cacheManager.reset()).pipe(
                map(() => ({
                  token: jwt,
                  user: user, // Assuming the user's name is stored in `firstName`
                }))
              )
            )
          );
        } else {
          throw new Error('Invalid credentials');
        }
      }),
    );
  }

}
