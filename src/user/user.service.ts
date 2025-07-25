import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-use.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    if (dto.password) {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      return this.prisma.user.update({
        where: { id },
        data: { ...dto, password: hashedPassword },
      });
    }
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ omit: { password: true } });
  }

  async unVerify(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new Error('user not found');
    return this.prisma.user.update({
      where: { id },
      data: { isVerified: !user?.isVerified },
    });
  }
}
