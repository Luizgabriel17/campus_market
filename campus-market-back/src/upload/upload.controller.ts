import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('product-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',

        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);

          callback(
            null,
            uniqueName +
              extname(file.originalname),
          );
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      filename: file.filename,

      url: `/uploads/products/${file.filename}`,
    };
  }
}