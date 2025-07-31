import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-use.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(
    @Req()
    req: {
      user: { userId: number; email: string; isVerified: boolean };
    },
  ) {
    return this.userService.findOne(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(
    @Req()
    req: { user: { userId: number; email: string; isVerified: boolean } },
    @Body() dto: UpdateUserDto,
  ) {
    const userId = req.user.userId;
    return this.userService.update(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req()
    req: { user: { userId: number; email: string; isVerified: boolean } },
  ) {
    const targetUserId = Number(id);
    const targetUser = await this.userService.findOne(targetUserId);

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Only admins (isVerified: true) can update other users
    // Users can only update themselves
    if (!req.user.isVerified && targetUserId !== req.user.userId) {
      throw new ForbiddenException('You are not allowed to update this user');
    }

    return this.userService.update(targetUserId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Req()
    req: { user: { userId: number; email: string; isVerified: boolean } },
  ) {
    const targetUserId = Number(id);
    const targetUser = await this.userService.findOne(targetUserId);

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Only admins (isVerified: true) can delete other users
    // Users can delete themselves
    if (!req.user.isVerified && targetUserId !== req.user.userId) {
      throw new ForbiddenException('You are not allowed to delete this user');
    }

    return this.userService.remove(targetUserId);
  }
}
