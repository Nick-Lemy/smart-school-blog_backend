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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: { user: { userId: number } }, @Body() dto: CreatePostDto) {
    return this.postService.create(req.user.userId, dto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() req: { user: { userId: number } },
  ) {
    const post = await this.postService.findOne(+id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId !== req.user.userId) {
      throw new ForbiddenException('You are not allowed to update this post');
    }
    return this.postService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { userId: number } },
  ) {
    const post = await this.postService.findOne(+id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== req.user.userId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    return this.postService.delete(+id);
  }
}
