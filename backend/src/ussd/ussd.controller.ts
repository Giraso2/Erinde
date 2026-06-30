import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UssdService } from './ussd.service';

@ApiTags('USSD Gateway')
@Controller('ussd')
export class UssdController {
  constructor(private ussdService: UssdService) {}

  @Post()
  @ApiOperation({ summary: 'Handle USSD request from telecom gateway (*880#)' })
  handleUssd(
    @Body('sessionId') sessionId: string,
    @Body('phoneNumber') phone: string,
    @Body('text') text: string,
  ) {
    const { response, type } = this.ussdService.handleUssd(sessionId, phone, text);
    return `${type} ${response}`;
  }

  @Get('stats')
  @ApiOperation({ summary: 'USSD gateway statistics' })
  getStats() {
    return this.ussdService.getStats();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Recent USSD transactions' })
  getTransactions() {
    return this.ussdService.getTransactions();
  }
}
