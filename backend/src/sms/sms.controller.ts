import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SmsService } from './sms.service';

@ApiTags('SMS Notifications')
@Controller('sms')
export class SmsController {
  constructor(private smsService: SmsService) {}

  @Post('send')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send an SMS notification' })
  send(@Body() dto: { phone: string; message: string; type: string }) {
    return this.smsService.send({ ...dto, type: dto.type as any });
  }

  @Get('logs')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get SMS delivery logs' })
  getLogs() {
    return this.smsService.getLogs();
  }
}
