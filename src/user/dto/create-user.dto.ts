// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, IsEnum } from 'class-validator';
import { Language } from 'generated/prisma';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;

  @IsEnum(Language)
  languagePreference: Language;
}
