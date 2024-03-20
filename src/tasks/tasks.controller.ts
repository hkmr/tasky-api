import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskStatus } from './tasks.model';
import { Task } from './tasks.entity';
import { IsEnum } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get('all')
  async getAllTask(@Query() query: FilterTaskDto): Promise<Task[]> {
    return this.taskService.getAllTasks(query);
  }

  @Get(':id')
  async getTaskById(@Param('id') taskId: number): Promise<Task> {
    return this.taskService.getTaskById(taskId);
  }

  @Post('create')
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Put(':id')
  async updateTask(
    @Param('id') taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTaskById(taskId, updateTaskDto);
  }

  @Patch(':id/status')
  async updateTaskStatusById(
    @Param('id') taskId: number,
    @Body('status', new ParseEnumPipe(TaskStatus)) status: TaskStatus,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(taskId, status);
  }

  @Delete(':id')
  async deleteTaskById(@Param('id') taskId: number): Promise<void> {
    return this.taskService.deleteTaskById(taskId);
  }
}
