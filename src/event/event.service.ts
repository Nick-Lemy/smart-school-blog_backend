import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateeEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  create(hostId: number, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...dto,
        hostId,
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  findOne(id: number) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  findByHostId(hostId: number) {
    return this.prisma.event.findMany({
      where: { hostId },
      include: {
        host: true,
      },
    });
  }

  findByCategory(category: string) {
    return this.prisma.event.findMany({ where: { category } });
  }

  update(id: number, dto: UpdateeEventDto) {
    return this.prisma.event.update({ where: { id }, data: dto });
  }
}
