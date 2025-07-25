import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(hostId: number, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...dto,
        hostId,
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany();
  }

  async findOne(id: number) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  async findByHostId(hostId: number) {
    return this.prisma.event.findMany({
      where: { hostId },
      include: {
        host: true,
      },
    });
  }
}
