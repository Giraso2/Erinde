import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { UserRole } from '../common/interfaces/user.interface';

interface UserStore {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  hospitalId?: string;
}

@Injectable()
export class AuthService {
  private users: Map<string, UserStore> = new Map();

  constructor(private jwtService: JwtService) {
    this.seedDemoUser();
  }

  private seedDemoUser() {
    const demo: UserStore = {
      id: 'usr_001',
      email: 'demo@erinde.rw',
      password: bcrypt.hashSync('demo123', 10),
      name: 'Demo User',
      phone: '+250780000000',
      role: UserRole.CITIZEN,
    };
    const admin: UserStore = {
      id: 'usr_000',
      email: 'admin@erinde.rw',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Ministry Admin',
      phone: '+250781000000',
      role: UserRole.SUPER_ADMIN,
    };
    this.users.set(demo.email, demo);
    this.users.set(admin.email, admin);
  }

  async register(dto: { email: string; password: string; name: string; phone?: string }) {
    if (this.users.has(dto.email)) throw new ConflictException('Email already registered');

    const user: UserStore = {
      id: `usr_${uuid().slice(0, 8)}`,
      email: dto.email,
      password: bcrypt.hashSync(dto.password, 10),
      name: dto.name,
      phone: dto.phone || '',
      role: UserRole.CITIZEN,
    };

    this.users.set(dto.email, user);
    return this.generateToken(user);
  }

  async login(dto: { email: string; password: string }) {
    const user = this.users.get(dto.email);
    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  async getProfile(email: string) {
    const user = this.users.get(email);
    if (!user) throw new UnauthorizedException('User not found');
    const { password, ...profile } = user;
    return profile;
  }

  private generateToken(user: UserStore) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    };
  }

  findAll() {
    return Array.from(this.users.values()).map(({ password, ...u }) => u);
  }
}
