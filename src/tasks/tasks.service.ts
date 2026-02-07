import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(userId: number, dto: CreateTaskDto) {
    const task = this.taskRepo.create({
      title: dto.title,
      completed: false,
      userId: userId,
    });

    return this.taskRepo.save(task);
  }

  async findAll(userId: number) {
    return this.taskRepo.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: number, userId: number, dto: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, dto);

    return this.taskRepo.save(task);
  }

  async remove(id: number, userId: number) {
    const task = await this.taskRepo.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepo.delete(id);

    return { deleted: true };
  }
}
