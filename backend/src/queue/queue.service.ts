import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IQueueEntry, QueueStatus } from '../common/interfaces/user.interface';
import { interval, Observable, map } from 'rxjs';

@Injectable()
export class QueueService {
  private queues: Record<string, IQueueEntry[]> = {};
  private counter = 1000;

  getQueueStatus(hospitalId: string) {
    const entries = this.queues[hospitalId] || [];
    const nowServing = Math.floor(100 + Math.random() * 60);
    const waitTime = Math.floor(10 + Math.random() * 50);

    return {
      hospitalId,
      totalInQueue: entries.filter((e) => e.status === QueueStatus.WAITING).length,
      nowServing: `Q-${nowServing}`,
      estimatedWaitMinutes: waitTime,
      queue: entries.slice(-20),
    };
  }

  joinQueue(dto: { hospitalId: string; userId: string; appointmentId?: string }) {
    this.counter++;
    const entry: IQueueEntry = {
      id: uuid().slice(0, 8),
      queueNumber: `Q-${this.counter}`,
      hospitalId: dto.hospitalId,
      userId: dto.userId,
      appointmentId: dto.appointmentId,
      status: QueueStatus.WAITING,
      position: (this.queues[dto.hospitalId]?.length || 0) + 1,
      estimatedWaitMinutes: Math.floor(10 + Math.random() * 60),
      joinedAt: new Date(),
    };

    if (!this.queues[dto.hospitalId]) this.queues[dto.hospitalId] = [];
    this.queues[dto.hospitalId].push(entry);
    return entry;
  }

  streamQueue(hospitalId: string): Observable<any> {
    return interval(3000).pipe(
      map(() => this.getQueueStatus(hospitalId)),
    );
  }
}
