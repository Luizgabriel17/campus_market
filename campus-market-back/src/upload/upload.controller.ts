import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  private static readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  private static readonly uploadLimits = {
    fileSize: 5 * 1024 * 1024, // 5MB
  };

  private static imageFileFilter(
    _req: unknown,
    file: any,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) {
    if (!UploadController.allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Formato inválido. Use JPG, PNG ou WEBP.'),
        false,
      );
    }

    callback(null, true);
  }

  @Post('product-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) =>
        UploadController.imageFileFilter(req, file, callback),
      limits: UploadController.uploadLimits,
    }),
  )
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const url = await this.cloudinaryService.uploadImage(
      file,
      'campusmarket/products',
    );

    return { url };
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) =>
        UploadController.imageFileFilter(req, file, callback),
      limits: UploadController.uploadLimits,
    }),
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const url = await this.cloudinaryService.uploadImage(
      file,
      'campusmarket/avatars',
    );

    return { url };
  }
}