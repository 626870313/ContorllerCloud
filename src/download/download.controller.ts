import { Controller, Get, Post, Body, Patch, Param, Delete,Res, Req } from '@nestjs/common';
import { DownloadService } from './download.service';
import { CreateDownloadDto } from './dto/create-download.dto';
import { UpdateDownloadDto } from './dto/update-download.dto';
import { Response } from 'express';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) { }

  @Get('stream/:filename')
  async streamFile(@Param('filename') filename: string, @Res() res: Response,@Req() req) {
    return this.downloadService.streamFile(filename, res,req)
  }


  @Post()
  create(@Body() createDownloadDto: CreateDownloadDto) {
    return this.downloadService.create(createDownloadDto);
  }

  @Get()
  findAll() {
    return this.downloadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.downloadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDownloadDto: UpdateDownloadDto) {
    return this.downloadService.update(+id, updateDownloadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.downloadService.remove(+id);
  }
}
