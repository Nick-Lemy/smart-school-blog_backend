// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Language } from 'generated/prisma';

export class RegisterUserDto {
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

  @IsBoolean()
  isVerified: boolean;
}
