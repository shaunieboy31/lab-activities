import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './task.entity'
import { Project } from '../projects/project.entity'
import { User } from '../users/user.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasks: Repository<Task>,
    @InjectRepository(Project) private projects: Repository<Project>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async create(projectId: number, data: Partial<Task>) {
    const project = await this.projects.findOne({ where: { id: projectId } })
    if (!project) throw new NotFoundException('project not found')
    const task = this.tasks.create({ ...data, project })
    return this.tasks.save(task)
  }

  async findByProject(projectId: number) {
    return this.tasks.find({ where: { project: { id: projectId } }, relations: ['assignee', 'project'] })
  }

  async update(id: number, data: Partial<Task>) {
    const task = await this.tasks.findOne({ where: { id } })
    if (!task) throw new NotFoundException('task not found')
    await this.tasks.update(id, data)
    return this.tasks.findOne({ where: { id }, relations: ['assignee', 'project'] })
  }

  async remove(id: number) {
    const task = await this.tasks.findOne({ where: { id } })
    if (!task) throw new NotFoundException('task not found')
    return this.tasks.delete(id)
  }
}
