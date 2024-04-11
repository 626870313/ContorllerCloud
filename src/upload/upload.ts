import { applyDecorators, UnsupportedMediaTypeException, UseInterceptors } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

export function upload(fieldName = 'file', options: MulterOptions = {}) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)))
}

export function uploadFiles(fieldName = 'file', options: MulterOptions = {}) {
  return applyDecorators(UseInterceptors(FilesInterceptor(fieldName, Infinity, options)))
}

export function fileMimetypeFilter(...mimes: string[]) {
  return (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    // console.log('file类型',file)
    if (mimes.some(mime => file.mimetype.includes(mime))) {
      callback(null, true)
    } else {
      callback(new UnsupportedMediaTypeException('文件类型错误'), false)
    }
  }
}


//图片上传
export function Image(filed = 'file') {
  return uploadFiles(filed, {
    limits: { fileSize: Math.pow(1024, 2) * 2 },
    fileFilter: fileMimetypeFilter('image')
  } as MulterOptions
  )
}


//文档上传
export function Document(filed = 'file') {
  return uploadFiles(filed, {
    limits: { fileSize: Math.pow(1024, 2) * 5 },
    fileFilter: fileMimetypeFilter('document')
  } as MulterOptions
  )
}

//文档上传
export function ImagAndDoc(filed = 'file') {
  return uploadFiles(filed, {
    // limits: { fileSize: Math.pow(1024, 2) * 5 },
    limits: { fileSize: Infinity },
    fileFilter: fileMimetypeFilter('image', 'document', 'text/plain', 'application/pdf','application/msword','application/zip')
  } as MulterOptions
  )
}