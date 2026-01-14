import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export type UserRole = 'user' | 'admin'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ default: 'user' })
  role: UserRole
}
