import { Injectable } from '@nestjs/common';
import { CreateDownloadDto } from './dto/create-download.dto';
import { UpdateDownloadDto } from './dto/update-download.dto';
import * as fs from 'fs'; // 引入 fs 模块
import { InjectRepository } from '@nestjs/typeorm';
import { NV_Upload } from '../upload/entities/upload.entity';
import { Repository } from 'typeorm';


@Injectable()
export class DownloadService {

  constructor(
    @InjectRepository(NV_Upload) private readonly upload: Repository<NV_Upload>,
  ) { }

  async streamFile(filename,res,req){
    const {username} = req.user

    const findUser = await this.upload.findOne({
      where:{username:username,filename:filename}
    })

    if(findUser){
      const filePath = findUser.path
      const stream = fs.createReadStream(filePath);

      stream.pipe(res);
    }

  }


  create(createDownloadDto: CreateDownloadDto) {
    return 'This action adds a new download';
  }

  findAll() {
    return `This action returns all download`;
  }

  findOne(id: number) {
    return `This action returns a #${id} download`;
  }

  update(id: number, updateDownloadDto: UpdateDownloadDto) {
    return `This action updates a #${id} download`;
  }

  remove(id: number) {
    return `This action removes a #${id} download`;
  }
}
