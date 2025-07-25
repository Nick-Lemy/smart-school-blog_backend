import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Post()
  create(
    @Body() dto: CreateEventDto,
    @Req() req: { user: { userId: number } },
  ) {
    return this.eventService.create(req.user.userId, dto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Get('/user/:hostId')
  findByHostId(@Param('hostId') hostId: string) {
    return this.eventService.findByHostId(+hostId);
  }

  @Get('/category')
  findByCategory(@Query('category') category: string) {
    return this.eventService.findByCategory(category);
  }
}
