import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './project.entity'
import { Task } from '../tasks/task.entity'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projects: Repository<Project>,
    @InjectRepository(Task) private tasks: Repository<Task>,
  ) {}

  create(data: Partial<Project>) {
    const p = this.projects.create(data)
    return this.projects.save(p)
  }

  findAll() {
    return this.projects.find({ relations: ['tasks'] })
  }

  async findOne(id: number) {
    const p = await this.projects.findOne({ where: { id }, relations: ['tasks'] })
    if (!p) throw new NotFoundException('project not found')
    return p
  }

  async update(id: number, data: Partial<Project>) {
    await this.findOne(id)
    await this.projects.update(id, data)
    return this.findOne(id)
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.projects.delete(id)
  }
}
