import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlayListDto } from './playlist.dto';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) { }

  @Post()
  create(@Body() playlistDto: CreatePlayListDto): Promise<Object> {
    return this.playlistsService.create(playlistDto);
  }
}
