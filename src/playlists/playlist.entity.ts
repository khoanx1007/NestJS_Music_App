import { Song } from 'src/songs/entities/song.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('playlists')
export default class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null })
  description: string;

  @OneToMany(() => Song, (song) => song.playList)
  songs: Song[];

  @ManyToOne(() => User, (user) => user.playLists)
  user: User;
}
