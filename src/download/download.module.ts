import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NV_Upload } from 'src/upload/entities/upload.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NV_Upload]),
  ],
  controllers: [DownloadController],
  providers: [DownloadService]
})
export class DownloadModule {}
