import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  create(authorId: number, dto: CreateCommentDto) {
    return this.prisma.comment.create({ data: { authorId, ...dto } });
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  findByPostId(postId: number) {
    return this.prisma.comment.findMany({ where: { postId } });
  }

  delete(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
