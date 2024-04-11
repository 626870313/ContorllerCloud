import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NV_Users } from './entities/auth.entity';
import { NV_Upload } from '../upload/entities/upload.entity';
import { Repository } from 'typeorm';
import { JwtService } from "@nestjs/jwt"
import * as bcryptjs from "bcryptjs"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(NV_Users) private readonly user: Repository<NV_Users>,
    @InjectRepository(NV_Upload) private readonly upload: Repository<NV_Upload>,
    private readonly JwtService: JwtService
  ) { }

  //用户用户信息
  async getUserInfo(req:{username:string}){
    const findUser = await this.user.findOne({
      where: { username: req.username },
      select: ['id','username','avatar','space']
    })
    if(!findUser) return {}
    return findUser
  }

  //注册
  async signup(signupData: CreateAuthDto) {
    const findUser = await this.user.findOne({
      where: { username: signupData.username }
    })
    if(findUser && findUser.username===signupData.username) return {code:500, message:'用户已存在'}

    signupData.password = bcryptjs.hashSync(signupData.password, 10)
    await this.user.save(signupData)
    return {
      code:200,
      message:"注册成功"
    }
  }

  //登录
  async login(loginData: CreateAuthDto) {
    const findUser = await this.user.findOne({
      where:{username:loginData.username}
    })

    if(!findUser) return new BadRequestException("用户不存在")

    const compareRes:boolean = bcryptjs.compareSync(loginData.password,findUser.password)
    if(!compareRes) return new BadRequestException("密码不正确")
    const payload = {username:findUser.username}

    return {
      access_token:this.JwtService.sign(payload),
      msg:"登录成功",
      code:'200'
    }
  }

  //已使用空间
  async aspace(req){
    let findUseSpace:any
    let findUser:any
    let totalSize:number = 0
    findUser = await this.user.findOne({
      where: { username: req.user.username },
      select: ['space']
    })
    if(findUser){
      findUseSpace = await this.upload.find({
        where: { username: req.user.username, fieldname:"file"},
        select: ['size']
      })
      if(findUseSpace&&findUseSpace.length>0){
        totalSize = findUseSpace.reduce((acc, curr) => acc + curr.size, 0);
      }
    }
    return totalSize
  }
  
}
