import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../users/user.entity'
import { Project } from '../projects/project.entity'

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: true })
  assigneeName?: string

  @Column({ nullable: true })
  dueDate?: string

  @Column({ default: 'todo' })
  status: 'todo' | 'doing' | 'done'

  @ManyToOne(() => User, { nullable: true })
  assignee?: User

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project
}
