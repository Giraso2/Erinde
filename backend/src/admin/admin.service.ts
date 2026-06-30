import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AdminService {
  getDashboardStats() {
    return {
      totalHospitals: 7,
      totalUsers: 28492,
      activePatients: 34892,
      todayAppointments: 12470,
      totalAppointments: 89234,
      totalPayments: 45230,
      totalRevenue: 1280000000,
      avgWaitTime: 23,
      bedOccupancyRate: 0.67,
      nationalCapacity: 0.58,
      activeAlerts: 2,
      ussdSessions: 847,
      mobileAppUsers: 2341,
    };
  }

  getRevenueReport(period: string) {
    const data: Record<string, any> = {
      daily: { total: 42800000, mobileMoney: 31200000, cbhi: 8600000, cash: 3000000, pending: 2100000 },
      weekly: { total: 245000000, mobileMoney: 178000000, cbhi: 52000000, cash: 15000000, pending: 8500000 },
      monthly: { total: 1280000000, mobileMoney: 890000000, cbhi: 280000000, cash: 110000000, pending: 42000000 },
    };
    return data[period] || data.daily;
  }

  getNationalOverview() {
    return {
      totalCapacity: 0.58,
      districts: [
        { name: 'Kigali City', capacity: 0.85, status: 'critical' },
        { name: 'Eastern Province', capacity: 0.62, status: 'high' },
        { name: 'Southern Province', capacity: 0.48, status: 'medium' },
        { name: 'Northern Province', capacity: 0.35, status: 'low' },
        { name: 'Western Province', capacity: 0.42, status: 'low' },
      ],
      alerts: [
        { id: uuid().slice(0, 8), type: 'outbreak', severity: 'high', message: 'Unusual respiratory case spike in Eastern Province (+40%)', time: new Date().toISOString() },
        { id: uuid().slice(0, 8), type: 'capacity', severity: 'critical', message: 'CHUK at 92% capacity – consider patient redirection', time: new Date().toISOString() },
        { id: uuid().slice(0, 8), type: 'info', severity: 'info', message: 'Rwamagana Hospital has available capacity for referrals', time: new Date().toISOString() },
      ],
    };
  }

  getServiceDemand() {
    return [
      { service: 'General Consultation', percentage: 72, trend: '+12%' },
      { service: 'Pediatrics', percentage: 55, trend: '+8%' },
      { service: 'Emergency', percentage: 88, trend: '+18%' },
      { service: 'Maternity', percentage: 40, trend: '+3%' },
      { service: 'Pharmacy', percentage: 50, trend: '+6%' },
    ];
  }
}
