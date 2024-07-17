import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus, DefaultValuePipe, Query, UseGuards, Request } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './song.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from '../guards/jwt-artist.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) { }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDto: CreateSongDto, @Request() req): Promise<Object> {
    return this.songsService.create(createSongDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSongDto: UpdateSongDto): Promise<Object> {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Object> {
    return this.songsService.remove(id);
  }
}
