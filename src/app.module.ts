import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { jwtAuth } from './auth/jwt-auth.grard';
import { UploadModule } from './upload/upload.module';
import { DownloadModule } from './download/download.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "mysql", //数据库类型
    username: "root", //账号
    password: "root", //密码
    host: "localhost", //host
    port: 3306, //
    database: "db", //库名
    entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
    synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
    autoLoadEntities: false, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
  }), AuthModule, UploadModule, DownloadModule],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_GUARD,
    useClass: jwtAuth
  }],
})
export class AppModule { }
