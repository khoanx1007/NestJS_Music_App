import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlayListDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  songs;

  @IsNumber()
  @IsNotEmpty()
  user: number;
}
