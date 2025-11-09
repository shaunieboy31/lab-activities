import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    // use the entity's password field (stored as hash)
    const ok = await bcrypt.compare(pass, (user as any).password || '');
    if (ok) {
      const { password, ...safe } = user as any;
      return safe;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: { username: string; password: string; displayName?: string }) {
    const existing = await this.usersService.findByUsername(data.username);
    if (existing) throw new BadRequestException('User already exists');
    const passwordHash = await bcrypt.hash(data.password, 10);
    // save hashed password into "password" field to match entity
    const created = await this.usersService.create({
      username: data.username,
      password: passwordHash,
      displayName: data.displayName,
    } as any);
    return this.login(created);
  }
}
