import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-use.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get()
  findOne(@Param() id: string) {
    return this.userService.findOne(Number(id));
  }

  @Patch()
  update(@Param() id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(Number(id), dto);
  }
}
