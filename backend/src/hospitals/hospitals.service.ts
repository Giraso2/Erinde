import { Injectable, NotFoundException } from '@nestjs/common';
import { IHospital } from '../common/interfaces/user.interface';

@Injectable()
export class HospitalsService {
  private hospitals: IHospital[] = [
    { id: 'hosp_001', name: 'CHUK', code: 'CHUK', location: 'Kigali', district: 'Nyarugenge', province: 'Kigali City', beds: 340, phone: '+250788301000', email: 'chuk@rbc.rw', latitude: -1.9441, longitude: 30.0619, isActive: true, createdAt: new Date('2020-01-01') },
    { id: 'hosp_002', name: 'Kanombe Hospital', code: 'KAN', location: 'Kanombe', district: 'Kicukiro', province: 'Kigali City', beds: 200, phone: '+250788302000', email: 'kanombe@rbc.rw', latitude: -1.9604, longitude: 30.1325, isActive: true, createdAt: new Date('2020-01-01') },
    { id: 'hosp_003', name: 'Kigali Teaching Hospital', code: 'KTH', location: 'Kacyiru', district: 'Gasabo', province: 'Kigali City', beds: 280, phone: '+250788303000', email: 'kth@rbc.rw', latitude: -1.9325, longitude: 30.0755, isActive: true, createdAt: new Date('2020-01-01') },
    { id: 'hosp_004', name: 'Rwamagana Hospital', code: 'RWA', location: 'Rwamagana', district: 'Rwamagana', province: 'Eastern Province', beds: 150, phone: '+250788304000', email: 'rwamagana@rbc.rw', latitude: -1.9527, longitude: 30.4347, isActive: true, createdAt: new Date('2020-01-01') },
    { id: 'hosp_005', name: 'Butare University Hospital', code: 'BUT', location: 'Huye', district: 'Huye', province: 'Southern Province', beds: 180, phone: '+250788305000', email: 'butare@rbc.rw', latitude: -2.5967, longitude: 29.7404, isActive: true, createdAt: new Date('2020-01-01') },
    { id: 'hosp_006', name: 'Musanze Hospital', code: 'MUS', location: 'Musanze', district: 'Musanze', province: 'Northern Province', beds: 120, phone: '+250788306000', email: 'musanze@rbc.rw', latitude: -1.4985, longitude: 29.6341, isActive: true, createdAt: new Date('2020-01-01') },
    { id: 'hosp_007', name: 'Rubavu Hospital', code: 'RUB', location: 'Gisenyi', district: 'Rubavu', province: 'Western Province', beds: 130, phone: '+250788307000', email: 'rubavu@rbc.rw', latitude: -1.6793, longitude: 29.2566, isActive: true, createdAt: new Date('2020-01-01') },
  ];

  private capacities: Record<string, number> = {
    hosp_001: 0.92, hosp_002: 0.78, hosp_003: 0.65,
    hosp_004: 0.34, hosp_005: 0.45, hosp_006: 0.28, hosp_007: 0.55,
  };

  findAll() {
    return this.hospitals.map((h) => ({
      ...h,
      capacity: this.capacities[h.id] || 0.5,
      estimatedWait: this.getEstimatedWait(h.id),
    }));
  }

  findById(id: string) {
    const hospital = this.hospitals.find((h) => h.id === id);
    if (!hospital) throw new NotFoundException('Hospital not found');
    return { ...hospital, capacity: this.capacities[id] || 0.5, estimatedWait: this.getEstimatedWait(id) };
  }

  getEstimatedWait(id: string): number {
    const cap = this.capacities[id] || 0.5;
    return Math.round(cap * 60);
  }

  getDoctors() {
    return [
      { id: 'doc_001', name: 'Dr Giraso', specialty: 'General Medicine', hospitalId: 'hosp_001' },
      { id: 'doc_002', name: 'Dr Alice', specialty: 'Pediatrics', hospitalId: 'hosp_003' },
      { id: 'doc_003', name: 'Dr John', specialty: 'Surgery', hospitalId: 'hosp_001' },
      { id: 'doc_004', name: 'Dr Marie', specialty: 'Maternity', hospitalId: 'hosp_002' },
      { id: 'doc_005', name: 'Dr David', specialty: 'Cardiology', hospitalId: 'hosp_003' },
      { id: 'doc_006', name: 'Dr Sandra', specialty: 'General Medicine', hospitalId: 'hosp_004' },
      { id: 'doc_007', name: 'Dr Patrick', specialty: 'Orthopedics', hospitalId: 'hosp_005' },
      { id: 'doc_008', name: 'Dr Grace', specialty: 'Pediatrics', hospitalId: 'hosp_006' },
    ];
  }
}
