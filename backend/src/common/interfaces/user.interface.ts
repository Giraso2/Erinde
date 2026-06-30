export enum UserRole {
  CITIZEN = 'citizen',
  HOSPITAL_ADMIN = 'hospital_admin',
  MINISTRY_ADMIN = 'ministry_admin',
  SUPER_ADMIN = 'super_admin',
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  hospitalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHospital {
  id: string;
  name: string;
  code: string;
  location: string;
  district: string;
  province: string;
  beds: number;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: Date;
}

export interface IAppointment {
  id: string;
  reference: string;
  userId: string;
  patientName: string;
  hospitalId: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  queueNumber: string;
  estimatedWaitMinutes: number;
  createdVia: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export interface IPayment {
  id: string;
  reference: string;
  userId: string;
  amount: number;
  provider: PaymentProvider;
  phone: string;
  status: PaymentStatus;
  purpose: string;
  appointmentId?: string;
  msisdn: string;
  transactionId?: string;
  createdAt: Date;
}

export enum PaymentProvider {
  MTN_MOMO = 'mtn_momo',
  AIRTEL_MONEY = 'airtel_money',
  CBHI = 'cbhi',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface IQueueEntry {
  id: string;
  queueNumber: string;
  hospitalId: string;
  userId: string;
  appointmentId?: string;
  status: QueueStatus;
  position: number;
  estimatedWaitMinutes: number;
  joinedAt: Date;
  servedAt?: Date;
}

export enum QueueStatus {
  WAITING = 'waiting',
  CALLED = 'called',
  IN_PROGRESS = 'in_progress',
  SERVED = 'served',
  SKIPPED = 'skipped',
  LEFT = 'left',
}

export interface ISmsLog {
  id: string;
  phone: string;
  message: string;
  type: SmsType;
  status: SmsDeliveryStatus;
  reference?: string;
  sentAt: Date;
  deliveredAt?: Date;
}

export enum SmsType {
  APPOINTMENT_CONFIRMATION = 'appointment_confirmation',
  QUEUE_UPDATE = 'queue_update',
  PAYMENT_CONFIRMATION = 'payment_confirmation',
  TURN_REMINDER = 'turn_reminder',
  GENERAL = 'general',
}

export enum SmsDeliveryStatus {
  QUEUED = 'queued',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export interface IUssdSession {
  sessionId: string;
  phone: string;
  state: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
