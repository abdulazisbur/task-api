import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

interface AuthenticatedRequest extends Request {
  user: { sub: number };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req: AuthenticatedRequest) {
    return this.tasksService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.tasksService.findAll(req.user.sub);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.update(+id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.tasksService.remove(+id, req.user.sub);
  }
}
