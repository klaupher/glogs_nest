import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { InsertLogsDto } from './dtos/insert-logs.dto';
import { LogsService } from './logs.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { FindLogsQueryDto } from './dtos/find-logs-query.dto';

@Controller('logs')
@UseGuards(AuthGuard(), RolesGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async insertNewLogs(@Body(ValidationPipe) insertLogsDto: InsertLogsDto) {
    console.log('Dados recebidos ', insertLogsDto);
    const logs = await this.logsService.insertLogs(insertLogsDto);
    return {
      id: logs.id,
      message: 'Logs inserido com sucesso.',
    };
  }

  @Get('/filter')
  async filterLogs(@Query() query: FindLogsQueryDto) {
    console.log(query.sort);
    const found = await this.logsService.findLogs(query);
    return {
      found,
      message: 'Logs encontrados',
    };
  }

  @Get()
  async getLogs() {
    return this.logsService.findAllLogs();
  }
}
