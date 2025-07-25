import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateeEventDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate?: string;

  @IsString()
  description?: string;
}
