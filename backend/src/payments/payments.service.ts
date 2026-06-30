import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IPayment, PaymentProvider, PaymentStatus } from '../common/interfaces/user.interface';

@Injectable()
export class PaymentsService {
  private payments: IPayment[] = [];

  mobileMoneyPayment(dto: { userId: string; amount: number; provider: PaymentProvider; phone: string; purpose?: string }): IPayment {
    if (dto.amount < 100) throw new BadRequestException('Minimum amount is 100 RWF');

    const payment: IPayment = {
      id: uuid().slice(0, 8),
      reference: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: dto.userId,
      amount: dto.amount,
      provider: dto.provider,
      phone: dto.phone,
      status: PaymentStatus.COMPLETED,
      purpose: dto.purpose || 'appointment',
      msisdn: dto.phone,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date(),
    };

    this.payments.push(payment);
    return payment;
  }

  findByUser(userId: string): IPayment[] {
    return this.payments.filter((p) => p.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findAll(): IPayment[] {
    return this.payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
