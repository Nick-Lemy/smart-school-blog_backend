import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register.dto';
import { User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  register(user: RegisterUserDto) {
    return this.userService.create(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, `${user.password}`))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  login(user: Omit<User, 'password'>) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
