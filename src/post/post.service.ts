import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import axios from 'axios';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async generateAISummary(text: string): Promise<string> {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not found, using fallback summary');
      return `Summary: ${text.substring(0, 100)}...`;
    }

    try {
      const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      const body = {
        contents: [
          {
            parts: [{ text: `Summarize this text of a blog: \n ${text}` }],
          },
        ],
      };

      const response = await axios.post(URL, body);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = response.data as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return data['candidates'][0]['content']['parts'][0].text as string;
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
      return `Summary: ${text.substring(0, 100)}...`;
    }
  }

  async create(authorId: number, dto: CreatePostDto) {
    const aiSummary = await this.generateAISummary(dto.content);

    return this.prisma.post.create({
      data: {
        ...dto,
        likes: [],
        authorId,
        aiSummary,
      },
    });
  }

  async findLikers(postId: number) {
    const post = await this.findOne(postId);
    const likers: {
      id: number;
      name: string;
      email: string;
      role: string;
    }[] = [];
    if (!post) return null;
    for (const userId of post.likes) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (user) {
        likers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      }
    }
    return likers;
  }

  findAll() {
    return this.prisma.post.findMany({
      include: {
        author: true,
        comments: true,
      },
    });
  }

  findByAuthorId(authorId: number) {
    return this.prisma.post.findMany({
      where: { authorId },
      include: {
        author: true,
        comments: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
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
    const likes = post.likes;
    return this.prisma.post.update({
      where: { id },
      data: { likes: [...likes, userId] },
    });
  }

  async getPostSummary(postId: number): Promise<{ content: string } | null> {
    const post = await this.findOne(postId);
    if (!post) return null;

    // If aiSummary doesn't exist or is empty, generate a new one
    if (!post.aiSummary) {
      const newSummary = await this.generateAISummary(post.content);
      await this.prisma.post.update({
        where: { id: postId },
        data: { aiSummary: newSummary },
      });
      return { content: newSummary };
    }

    return { content: post.aiSummary };
  }
}
