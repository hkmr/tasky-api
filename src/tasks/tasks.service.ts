import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from './dto/task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRespository: Repository<Task>,
  ) {}

  async getAllTasks(filterTaskDto: FilterTaskDto): Promise<Task[]> {
    const { search, status } = filterTaskDto;
    const query = this.taskRespository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(taskId: number): Promise<Task> {
    const task = await this.taskRespository.findOne({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    const res = await this.taskRespository.save(task);
    return res;
  }

  async updateTaskById(
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const updatedTask = await this.getTaskById(taskId);

    if (updateTaskDto.title) {
      updatedTask.title = updateTaskDto.title;
    }

    if (updateTaskDto.description) {
      updatedTask.description = updateTaskDto.description;
    }

    const res = await this.taskRespository.save(updatedTask);
    return res;
  }

  async updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
    const updatedTask = await this.getTaskById(taskId);

    updatedTask.status = status;
    const res = await this.taskRespository.save(updatedTask);
    return res;
  }

  async deleteTaskById(taskId: number) {
    const res = await this.taskRespository.delete(taskId);

    if (res.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
