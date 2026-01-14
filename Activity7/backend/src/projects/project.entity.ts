import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Task } from '../tasks/task.entity'

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: true })
  dueDate?: string

  @Column({ default: 'open' })
  status: 'open' | 'in-progress' | 'done'

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[]
}
