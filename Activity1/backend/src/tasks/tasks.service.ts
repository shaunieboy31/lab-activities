import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const { title, description, completed = false, deadline } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      completed,
      deadline,
    });

    return this.tasksRepository.save(task);
  }

  findAll() {
    return this.tasksRepository.find();
  }

  findOne(id: number) {
    return this.tasksRepository.findOneBy({ id });
  }

  async update(id: number, updateTaskDto: Partial<Task>) {
    await this.tasksRepository.update(id, updateTaskDto);
    return this.tasksRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.tasksRepository.delete(id);
  }
}
