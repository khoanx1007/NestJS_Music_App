import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { query } from 'express';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private songsRepository: Repository<Song>,
    @InjectRepository(Artist) private artistsRepository: Repository<Artist>
  ) { }
  async create(createSongDto: CreateSongDto): Promise<Object> {
    const { title, releasedDate, duration, lyrics } = createSongDto;
    const artists = await this.artistsRepository.findByIds(createSongDto.artists);
    const song = this.songsRepository.create({ title, releasedDate, artists, duration, lyrics });
    await this.songsRepository.save(song);
    return {
      message: 'song created success',
      data: song,
      code: HttpStatus.CREATED
    }
  }

  findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songsRepository.findOneBy({ id });
    if (!song) {
      throw new HttpException(
        'Not found',
        HttpStatus.NOT_FOUND,
      )
    }
    return song;
  }

  async update(id: number, updateSongDto: UpdateSongDto): Promise<Object> {
    const song = await this.findOne(id);
    // this.songsRepository.merge(song, updateSongDto);
    const updateSong = await this.songsRepository.save(song);
    return {
      message: 'updated successfully',
      data: updateSong
    }
  }

  async remove(id: number): Promise<Object> {
    const song = await this.findOne(id);
    this.songsRepository.remove(song);
    return {
      message: 'deleted successfully',
      status: HttpStatus.OK,
    };
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songsRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.title', 'ASC');
    return paginate<Song>(this.songsRepository, options)
  }
}
