import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(username: string, password: string, role: string = 'user') {
    const existing = await this.usersRepo.findOne({ where: { username } })
    if (existing) throw new UnauthorizedException('username taken')
    const hash = await bcrypt.hash(password, 10)
    const u = this.usersRepo.create({ username, password: hash, role } as any)
    return this.usersRepo.save(u)
  }

  async validateUser(username: string, pass: string) {
    const user = await this.usersRepo.findOne({ where: { username } })
    if (!user) return null
    const ok = await bcrypt.compare(pass, user.password)
    if (!ok) return null
    const { password, ...rest } = user as any
    return rest
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role }
    return { access_token: this.jwtService.sign(payload) }
  }

  async findById(id: number) {
    return this.usersRepo.findOne({ where: { id } })
  }
}
