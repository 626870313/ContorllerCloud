import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs/promises'; // 引入 fs 模块
import * as path from 'path';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NV_Upload } from './entities/upload.entity';
import { NV_Delete } from './entities/delete.entity';
import {UP_PUBLIC_LOCTATION} from '../common/public.decorator'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([NV_Upload,NV_Delete]),
    MulterModule.registerAsync({
      useFactory() {
        return {
          storage: diskStorage({
            destination: async (req, file, callback) => {
              const user = req.user;
              const { username } = (user as any);
              // 构建子目录结构，例如 uploads/user123
              // const userUploadsPath = join('uploads', username);
              let userUploadsPath = path.resolve(UP_PUBLIC_LOCTATION, username);
              const uploadPath = req.body.uploadPath as string;
              if(uploadPath){
                userUploadsPath = uploadPath
              }
              try {
                // 确保目录存在，如果不存在则创建
                await fs.mkdir(userUploadsPath, { recursive: true });
                callback(null, userUploadsPath);
              } catch (error) {
                callback(error, 'uploads'); // 出错时使用默认目录
              }
            },
            filename: (req, file, callback) => {
              const fileName = `${Date.now()}-${Math.round(Math.random() * 1e10)}${extname(file.originalname)}`;
              callback(null, fileName);
            },
          }),
        };
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
