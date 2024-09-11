import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.interface';
import { Observable } from 'rxjs';
import { ApiBody } from '@nestjs/swagger';
import { BaseRegisterDto } from '../dto/register_dto';
import { LoginDto } from '../dto/login_dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('register')
  @ApiBody({ type: BaseRegisterDto })
  register(
    @Body() user: BaseRegisterDto,
  ): Observable<{ token: string; user: User }> {
    return this.authService.registerAccount(user);
  }

  @Post('login')
  login(@Body() user: LoginDto): Observable<{ token: string; user: User }> {
    return this.authService.login(user);
  }
}
