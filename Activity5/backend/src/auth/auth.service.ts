import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService, // inject JwtService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  private signToken(payload: { sub: number; username: string }) {
    return this.jwtService.sign(payload);
  }

  async register(dto: RegisterDto) {
    if (!dto.username || !dto.password) {
      throw new HttpException('username and password required', HttpStatus.BAD_REQUEST);
    }

    const emailNormalized = dto.email ? dto.email.toLowerCase() : null;

    const conflict = await this.usersRepo.findOne({
      where: [
        { username: dto.username },
        ...(emailNormalized ? [{ email: emailNormalized }] : []),
      ],
    });
    if (conflict) throw new HttpException('username/email in use', HttpStatus.CONFLICT);

    const user = this.usersRepo.create({
      username: dto.username,
      email: emailNormalized,
      password: await this.hashPassword(dto.password),
    });

    try {
      const saved = await this.usersRepo.save(user);
      const { password, ...safe } = saved as any;
      const token = this.signToken({ sub: saved.id, username: saved.username });
      return { user: safe, token };
    } catch (err) {
      // map common DB duplicate-key errors to 409 conflict
      const code = (err as any).code;
      if (code === 'ER_DUP_ENTRY' || code === 'SQLITE_CONSTRAINT' || code === '23505') {
        throw new HttpException('username or email already in use', HttpStatus.CONFLICT);
      }
      console.error('create user failed', err);
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { username: dto.username } });
    if (!user) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const ok = await this.compare(dto.password, user.password);
    if (!ok) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const { password, ...safe } = user as any;
    const token = this.signToken({ sub: user.id, username: user.username });
    return { user: safe, token };
  }
}