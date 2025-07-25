import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: { user: { userId: number } },
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(req.user.userId, dto);
  }

  @Get('/post/:postId')
  findByPostId(@Param('postId') postId: string) {
    return this.commentService.findByPostId(+postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Req() req: { user: { userId: number } },
    @Param('id') id: string,
  ) {
    const comment = await this.commentService.findOne(+id);

    if (!comment) {
      throw new NotFoundException('Post not found');
    }

    if (comment.authorId !== req.user.userId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }
    return this.commentService.delete(+id);
  }
}
