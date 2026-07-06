import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AddressService } from './address.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) {}

  @Post()
  create(
    @Request() req: any,
    @Body() dto: CreateAddressDto,
  ) {
    return this.addressService.create(
      req.user.userId,
      dto,
    );
  }

  @Get()
  findAll(@Request() req: any) {
    return this.addressService.findAll(
      req.user.userId,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.addressService.findOne(
      id,
      req.user.userId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressService.update(
      id,
      req.user.userId,
      dto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.addressService.remove(
      id,
      req.user.userId,
    );
  }
}