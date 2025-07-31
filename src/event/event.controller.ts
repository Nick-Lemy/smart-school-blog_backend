import {
  Body,
  Controller,
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
    console.log('Creating event for user:', req);
    // console.log('Event details:', dto);
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
  register(@Param('id') id: string, @Req() req: { user: { userId: number } }) {
    return this.eventService.register(+id, req.user.userId);
  }
}
