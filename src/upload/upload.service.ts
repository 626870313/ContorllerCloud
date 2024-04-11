import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NV_Upload } from './entities/upload.entity';
import { NV_Delete } from './entities/delete.entity';
import * as fs from 'fs/promises'; // 引入 fs 模块
import { UP_PUBLIC_LOCTATION } from '../common/public.decorator'


@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(NV_Upload) private readonly upload: Repository<NV_Upload>,
    @InjectRepository(NV_Delete) private readonly deleteUpload: Repository<NV_Delete>,
  ) { }

  async uploadFile(files: any, user: { username: string }, body) {
    const { username } = user
    const { name, uploadPath } = body

    let findUser: any = { filename: '' }
    if (name.length === 0 || name === '') {
      findUser.filename = username
    } else {
      findUser = await this.upload.findOne({ where: { path: uploadPath } });
    }

    if (files.length > 0) {
      for (const item of files) {
        await this.upload.save({ ...item, username, belong: findUser?.filename || username, originalname: name });
      }
    }

    await this.computerDisk(findUser?.filename || username)
    return { code: 200, files }
  }

  async getFile(user: { username: string }, page: number = 1, pageSize: number = 10, all: any = false, beName: string) {
    const { username } = user;
    // 跳过的记录数量
    const skip = (page - 1) * pageSize;

    // 动态构造查询条件
    const where: { username: string, belong?: string } = {
      username,
    };
    // 添加过滤条件
    if (all === 'true') {
      where.belong = username;
    } else {
      where.belong = beName;
    }

    try {
      // 构造查询
      const findUser = await this.upload.find({
        where,
        skip,
        take: pageSize
      });
      await this.computerDisk(where.belong)
      return { code: 200, data: findUser, message: '操作成功' };
    } catch (error) {
      // 处理查询错误
      return { code: 500, data: null, message: '查询失败', error: error.message };
    }
  }

  async updateFileName(body) {
    try {
      let isBelong = await this.upload.findOne({ where: { originalname: body.originalname, belong: body.belong, fieldname: 'folder' } });
      if (isBelong) {
        return { code: 200, message: '当前目录存在同名文件夹,创建失败！', success: false }
      }
      await this.upload.update({ filename: body.filename, username: body.username }, { originalname: body.originalname });

      return { success: true, code: 200 };
    } catch (error) {
      return { success: false, code: 500 };
    }
  }

  async createFolder(directoryPath: string, folderName: string, all: any = false, user: { username: string }) {
    let filename = `${Date.now()}-${Math.round(Math.random() * 1e10)}` + '.folder'

    const { username } = user
    let folderPath: any
    let findUser: any = { filename: '' }
    let isBelong: any


    if (all) {
      folderPath = UP_PUBLIC_LOCTATION + `/${username}/${filename}`;
      findUser.filename = username
    } else {
      folderPath = `${directoryPath}/${filename}`;
      findUser = await this.upload.findOne({ where: { path: directoryPath } });
    }

    isBelong = await this.upload.findOne({ where: { originalname: folderName, belong: findUser.filename, fieldname: 'folder' } });
    if (isBelong) {
      return { code: 500, message: '当前目录存在同名文件夹,创建失败！', success: false }
    }

    try {
      // 判断文件夹是否已存在
      const folderExists = await fs.stat(folderPath).then(() => true).catch(() => false);
      if (folderExists) {
        return { code: 500, message: '当前目录存在同名文件夹,创建失败！', success: false }
      }

      // 文件夹不存在，进行创建
      const createfolder = await fs.mkdir(folderPath, { recursive: true });
      // let secondLastFolderName = path.basename(path.dirname(createfolder));
      // const secondLastFolderName = createfolder.replace(uploadRecord.filename, query.newOriginalName)

      const data = {
        username,
        fieldname: 'folder',
        path: createfolder,
        belong: findUser.filename,
        filename,
        mimetype: 'folder',
        originalname: folderName
      }

      await this.upload.save(data)
      return { code: 200, message: '创建成功！', success: true, data }
    } catch (error) {
      return { code: 500, message: error.message, success: false }
    }
  }

  async deleteFile(user: { username: string }, body) {
    const { username } = user
    const filenameList = Array.isArray(body)
    try {
      if (filenameList) {
        for (const item of body) {
          let findUser = await this.upload.findOne({ where: { username, filename: item } });
          if (findUser) {
            await this.deleteUpload.save(findUser);
            await this.upload.delete({ username, filename: item });
            await this.computerDisk(findUser.belong);
          }
        }
      } else {
        let findUser = await this.upload.findOne({ where: { username, filename: body.filename } });
        if (findUser) {
          await this.deleteUpload.save(findUser);
          await this.upload.delete({ username, filename: body.filename });
          await this.computerDisk(findUser.belong);
        }
      }
      return { code: 200, message: '删除成功！', success: true };
    } catch (error) {
      return { code: 500, message: error.message, success: false };
    }


  }

  async computerDisk(belong) {
    let findFolderSize: any
    let folderSizeList: any
    let totalSize: number = 0

    findFolderSize = await this.upload.findOne({
      where: { filename: belong, fieldname: "folder" },
      select: ['size']
    })

    folderSizeList = await this.upload.find({
      where: { belong: belong },
      select: ['size']
    })

    if (folderSizeList.length > 0) {
      totalSize = folderSizeList.reduce((acc, curr) => acc + curr.size, 0);
    }
    await this.upload.update({ filename: belong, fieldname: "folder" }, { size: totalSize });

  }

  create(createUploadDto: CreateUploadDto) {
    return 'This action adds a new upload';
  }

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
