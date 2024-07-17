import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/songs/entities/song.entity';
import { Repository } from 'typeorm';
import Playlist from './playlist.entity';
import { User } from 'src/users/user.entity';
import { CreatePlayListDto } from './playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist) private playlistsRepository: Repository<Playlist>,
    @InjectRepository(Song) private songsRepository: Repository<Song>,
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }

  async create(playlistDTO: CreatePlayListDto): Promise<Object> {
    const { name, description } = playlistDTO;
    const songs = await this.songsRepository.findByIds(playlistDTO.songs);
    const user = await this.usersRepository.findOneBy({ id: playlistDTO.user });
    const playlist = this.playlistsRepository.create({ name, description, songs, user });
    await this.playlistsRepository.save(playlist);
    return {
      message: "playlist created successfully",
      data: playlist,
      status: HttpStatus.CREATED
    }
  }
}
