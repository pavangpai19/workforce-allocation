import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto/signup.dto';
import { LoginDto } from './dto/login.dto/login.dto';

import type { CurrentUser } from './interfaces/current-user.interface';
import { CurrentUser as CurrentUserDecorator } from './decorators/current-user.decorator';
import { SupabaseAuthGuard } from './guards/supabase-auth/supabase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('signup')
  signup(
    @Body() dto: SignupDto,
  ) {
    return this.authService.signup(dto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  me(
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.authService.me(user);
  }
}
