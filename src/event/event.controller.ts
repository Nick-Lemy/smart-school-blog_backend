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
    @Req() req: { user: { userId: number; email: string } },
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
    @Req() req: { user: { userId: number; email: string } },
  ) {
    return this.eventService.register(+id, req.user.userId);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: { user: { userId: number; email: string } },
  ) {
    // Optionally, you can check if the user is the host before allowing deletion
    const event = await this.eventService.findOne(+id);
    if (!event) {
      throw new ForbiddenException('Event not found');
    }
    if (event.hostId !== req.user.userId) {
      throw new ForbiddenException('You are not allowed to delete this event');
    }
    // Proceed with deletion
    if (!req.user) {
      throw new Error('Unauthorized');
    }
    return this.eventService.delete(+id);
  }
}
