import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NV_Users } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from "./constants"
import  JwtAuthStrategy  from "./jwt-auth.strategy"
import { NV_Upload } from '../upload/entities/upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NV_Users,NV_Upload]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: jwtConstants.expiresIn }
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy]
})
export class AuthModule { }

