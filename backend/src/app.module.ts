import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { AccessTokensModule } from './access-tokens/access-tokens.module';
import { StatsModule } from './stats/stats.module';

import { User } from './users/entities/user.entity';
import { Video } from './videos/entities/video.entity';
import { Playlist } from './playlists/entities/playlist.entity';
import { PlaylistVideo } from './playlists/entities/playlist-video.entity';
import { AccessToken } from './access-tokens/entities/access-token.entity';
import { AccessLog } from './access-tokens/entities/access-log.entity';
import { VideoStats } from './stats/entities/video-stats.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Video, Playlist, PlaylistVideo, AccessToken, AccessLog, VideoStats],
      synchronize: false, // Usar migrations em produção
      logging: process.env.NODE_ENV === 'development',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
    PassportModule,
    AuthModule,
    UsersModule,
    VideosModule,
    PlaylistsModule,
    AccessTokensModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
