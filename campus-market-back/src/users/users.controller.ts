import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadedFile, UseInterceptors, Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { memoryStorage } from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('me')
  getMe(@Request() req: any) {
    return this.usersService.findOne(
      req.user.userId,
    );
  }

  @Get('me/profile')
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(
      req.user.userId,
    );
  }

  @Patch('me')
  update(
    @Request() req: any,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(
      req.user.userId,
      dto,
    );
  }

  @Patch('me/password')
  changePassword(
    @Request() req: any,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.userId,
      dto,
    );
  }

  @Delete('me')
  remove(@Request() req: any) {
    return this.usersService.remove(
      req.user.userId,
    );
  }
  @Post('me/avatar')
@UseInterceptors(
  FileInterceptor('avatar', {
    storage: memoryStorage(),
  }),
)
async uploadAvatar(
  @Request() req: any,
  @UploadedFile() file: Express.Multer.File,
) {
  const imageUrl =
    await this.cloudinaryService.uploadImage(
      file,
      'avatars',
    );

  return this.usersService.updateAvatar(
    req.user.userId,
    imageUrl,
  );
}
}