import { Controller, Get, Post, Param, Body, UseGuards, Req, Sse } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QueueService } from './queue.service';
import { Observable } from 'rxjs';

@ApiTags('Queue Management')
@Controller('queue')
export class QueueController {
  constructor(private queueService: QueueService) {}

  @Get(':hospitalId')
  @ApiOperation({ summary: 'Get queue status for a hospital' })
  getStatus(@Param('hospitalId') hospitalId: string) {
    return this.queueService.getQueueStatus(hospitalId);
  }

  @Post(':hospitalId/join')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join the queue at a hospital' })
  join(@Param('hospitalId') hospitalId: string, @Body('appointmentId') appointmentId: string, @Req() req) {
    return this.queueService.joinQueue({ hospitalId, userId: req.user.id, appointmentId });
  }

  @Sse(':hospitalId/stream')
  @ApiOperation({ summary: 'SSE stream for real-time queue updates' })
  stream(@Param('hospitalId') hospitalId: string): Observable<MessageEvent> {
    return this.queueService.streamQueue(hospitalId);
  }
}
