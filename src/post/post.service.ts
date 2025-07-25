import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  create(authorId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...dto,
        likes: [],
        authorId,
      },
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      include: {
        author: true,
        comments: true,
        aiSummary: true,
      },
    });
  }

  findByAuthorId(authorId: number) {
    return this.prisma.post.findMany({
      where: { authorId },
      include: {
        author: true,
        comments: true,
        aiSummary: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
        aiSummary: true,
      },
    });
  }

  update(id: number, dto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: dto,
    });
  }

  delete(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
  async like(id: number, userId: number) {
    const post = await this.findOne(id);
    if (!post) return;
    const likes = post.likes as number[];
    return this.prisma.post.update({
      where: { id },
      data: { likes: [...likes, userId] },
    });
  }
}
