import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IAppointment, AppointmentStatus } from '../common/interfaces/user.interface';

@Injectable()
export class AppointmentsService {
  private appointments: IAppointment[] = [];

  create(dto: { userId: string; patientName: string; hospitalId: string; doctorName: string; date: string; time: string; createdVia?: string }): IAppointment {
    const appointment: IAppointment = {
      id: uuid().slice(0, 8),
      reference: `ERN-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: dto.userId,
      patientName: dto.patientName,
      hospitalId: dto.hospitalId,
      doctorName: dto.doctorName,
      date: dto.date,
      time: dto.time,
      status: AppointmentStatus.CONFIRMED,
      queueNumber: `Q-${Math.floor(100 + Math.random() * 900)}`,
      estimatedWaitMinutes: Math.floor(10 + Math.random() * 60),
      createdVia: dto.createdVia || 'web',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.appointments.push(appointment);
    return appointment;
  }

  findByUser(userId: string): IAppointment[] {
    return this.appointments.filter((a) => a.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findById(id: string): IAppointment {
    const appointment = this.appointments.find((a) => a.id === id);
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  updateStatus(id: string, status: AppointmentStatus): IAppointment {
    const appointment = this.findById(id);
    appointment.status = status;
    appointment.updatedAt = new Date();
    return appointment;
  }

  findAll(): IAppointment[] {
    return this.appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
