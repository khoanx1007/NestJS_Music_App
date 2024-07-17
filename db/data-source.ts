import { Artist } from 'src/artists/artist.entity';
import Playlist from 'src/playlists/playlist.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { DataSource, DataSourceOptions } from "typeorm";
export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123456",
  database: "music_app",
  entities: [
    'dist/**/*.entity{.ts,.js}'
    // User, Playlist, Artist, Song,
  ],
  synchronize: false,
  migrations: ["dist/db/migrations/*.js"],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
