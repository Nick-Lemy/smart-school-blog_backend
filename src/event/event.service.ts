import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateeEventDto } from './dto/update-event.dto';
import { Event } from 'generated/prisma';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  create(hostId: number, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...dto,
        attendees: [],
        hostId,
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  async findOne(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({ where: { id } });
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

  async register(id: number, userId: number) {
    const event = await this.findOne(id);
    if (!event) return;

    const attendees = event.attendees;

    return this.prisma.event.update({
      where: { id },
      data: { attendees: [...attendees, userId] },
    });
  }
}
