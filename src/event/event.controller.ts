import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateEventDto,
    @Req()
    req: { user: { userId: number; email: string; isVerified: boolean } },
  ) {
    return this.eventService.create(req.user.userId, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.eventService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:hostId')
  findByHostId(@Param('hostId') hostId: string) {
    return this.eventService.findByHostId(+hostId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/category')
  findByCategory(@Query('category') category: string) {
    return this.eventService.findByCategory(category);
  }

  @UseGuards(JwtAuthGuard)
  @Post('register/:id')
  register(
    @Param('id') id: string,
    @Req()
    req: { user: { userId: number; email: string; isVerified: boolean } },
  ) {
    return this.eventService.register(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req()
    req: { user: { userId: number; email: string; isVerified: boolean } },
  ) {
    // Check if the event exists
    const event = await this.eventService.findOne(+id);
    if (!event) {
      throw new ForbiddenException('Event not found');
    }

    // Allow admin users (isVerified: true) to delete any event
    // Regular users can only delete their own events
    if (!req.user.isVerified && event.hostId !== req.user.userId) {
      throw new ForbiddenException('You are not allowed to delete this event');
    }

    // Proceed with deletion
    return this.eventService.delete(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/attendees')
  findAttendees(@Param('id') id: string) {
    return this.eventService.findAttendees(+id);
  }
}
