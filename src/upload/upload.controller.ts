import { Controller, Get, Post, Body, UploadedFiles, Req, Query, HttpCode, Put,Delete, Res } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ImagAndDoc } from './upload'


@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('files')
  @ImagAndDoc()
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req, @Query('uploadPath') uploadPath: string,@Body() body) {
    return this.uploadService.uploadFile(files, req.user,body)
  }

  @Get('files')
  getFile(@Req() req, @Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10, @Query('all') all: boolean = false, @Query('beName') beName: string) {
    return this.uploadService.getFile(req.user, page, pageSize, all, beName)
  }

  @Put('files')
  updateFileName(@Body() body){
    return this.uploadService.updateFileName(body)
  }

  @Delete('files')
  deleteFile(@Req() req,@Body() body){
    return this.uploadService.deleteFile(req.user,body)
  }

  @HttpCode(200)
  @Post('folders')
  async createFolder(@Body() body: { directoryPath: string; folderName: string;all:boolean }, @Req() req) {
    const { directoryPath, folderName,all } = body;
    return this.uploadService.createFolder(directoryPath, folderName,all, req.user);
  }

}
