import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus } from '../common/interfaces/user.interface';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new appointment' })
  create(@Body() dto: { patientName: string; hospitalId: string; doctorName: string; date: string; time: string }, @Req() req) {
    return this.appointmentsService.create({ ...dto, userId: req.user.id });
  }

  @Get('mine')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my appointments' })
  getMine(@Req() req) {
    return this.appointmentsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  getById(@Param('id') id: string) {
    return this.appointmentsService.findById(id);
  }

  @Post(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  updateStatus(@Param('id') id: string, @Body('status') status: AppointmentStatus) {
    return this.appointmentsService.updateStatus(id, status);
  }
}
