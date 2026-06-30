import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HospitalsService } from './hospitals.service';

@ApiTags('Hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private hospitalsService: HospitalsService) {}

  @Get()
  @ApiOperation({ summary: 'List all hospitals with real-time capacity' })
  findAll() {
    return this.hospitalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hospital details' })
  findById(@Param('id') id: string) {
    return this.hospitalsService.findById(id);
  }

  @Get('doctors/all')
  @ApiOperation({ summary: 'List all doctors' })
  getDoctors() {
    return this.hospitalsService.getDoctors();
  }
}
