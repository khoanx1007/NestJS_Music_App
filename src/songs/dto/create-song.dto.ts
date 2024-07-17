import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber({}, { each: true })
  artists;

  @IsNotEmpty()
  @IsDateString()
  releasedDate: Date;

  @IsNotEmpty()
  @IsMilitaryTime()
  duration: Date;

  @IsString()
  @IsOptional()
  lyrics: string;
}
