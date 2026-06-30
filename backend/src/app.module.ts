import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UssdModule } from './ussd/ussd.module';
import { PaymentsModule } from './payments/payments.module';
import { QueueModule } from './queue/queue.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SmsModule } from './sms/sms.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UssdModule,
    PaymentsModule,
    QueueModule,
    HospitalsModule,
    AppointmentsModule,
    SmsModule,
    AdminModule,
  ],
})
export class AppModule {}
