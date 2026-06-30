import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ISmsLog, SmsType, SmsDeliveryStatus } from '../common/interfaces/user.interface';

@Injectable()
export class SmsService {
  private logs: ISmsLog[] = [];
  private smsProvider = {
    name: 'Africa\'s Talking',
    apiKey: process.env.SMS_API_KEY || 'sandbox_key',
    username: process.env.SMS_USERNAME || 'sandbox',
  };

  async send(dto: { phone: string; message: string; type: SmsType; reference?: string }): Promise<ISmsLog> {
    const log: ISmsLog = {
      id: uuid().slice(0, 8),
      phone: dto.phone,
      message: dto.message,
      type: dto.type,
      status: SmsDeliveryStatus.QUEUED,
      reference: dto.reference,
      sentAt: new Date(),
    };

    this.logs.push(log);

    try {
      // Simulate SMS provider call
      console.log(`[SMS Provider: ${this.smsProvider.name}] To: ${dto.phone} | Msg: ${dto.message}`);
      log.status = SmsDeliveryStatus.SENT;
      log.deliveredAt = new Date();

      if (this.smsProvider.username === 'sandbox') {
        // In sandbox mode, simulate delivery
        setTimeout(() => {
          log.status = SmsDeliveryStatus.DELIVERED;
        }, 2000);
      }
    } catch (error) {
      log.status = SmsDeliveryStatus.FAILED;
    }

    return log;
  }

  async sendAppointmentConfirmation(phone: string, patientName: string, hospital: string, date: string, time: string, ref: string) {
    const message = `Erinde: Confirmed! ${patientName}, your appointment at ${hospital} on ${date} at ${time}. Ref: ${ref}. Dial *880# for details.`;
    return this.send({ phone, message, type: SmsType.APPOINTMENT_CONFIRMATION, reference: ref });
  }

  async sendQueueUpdate(phone: string, queueNumber: string, hospital: string, patientsAhead: number, estimatedWait: number) {
    const message = `Erinde: You are Q-${queueNumber} at ${hospital}. ${patientsAhead} ahead. Est. wait: ${estimatedWait} min. We'll SMS when your turn approaches.`;
    return this.send({ phone, message, type: SmsType.QUEUE_UPDATE, reference: queueNumber });
  }

  async sendPaymentConfirmation(phone: string, amount: number, ref: string, provider: string) {
    const message = `Erinde: Payment of RWF ${amount.toLocaleString()} via ${provider} successful. Ref: ${ref}. Thank you!`;
    return this.send({ phone, message, type: SmsType.PAYMENT_CONFIRMATION, reference: ref });
  }

  async sendTurnReminder(phone: string, queueNumber: string, hospital: string) {
    const message = `Erinde: Your turn is coming up! Q-${queueNumber} at ${hospital}. Please proceed to the waiting area.`;
    return this.send({ phone, message, type: SmsType.TURN_REMINDER, reference: queueNumber });
  }

  getLogs(): ISmsLog[] {
    return this.logs.slice(-100);
  }
}
