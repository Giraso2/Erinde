import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { PaymentProvider } from '../common/interfaces/user.interface';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('mobile-money')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pay via Mobile Money (MTN/Airtel)' })
  mobileMoney(@Body() dto: { amount: number; provider: PaymentProvider; phone: string; purpose?: string }, @Req() req) {
    return this.paymentsService.mobileMoneyPayment({ ...dto, userId: req.user.id });
  }

  @Get('mine')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my payment history' })
  getMine(@Req() req) {
    return this.paymentsService.findByUser(req.user.id);
  }
}
