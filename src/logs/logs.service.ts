import { Injectable } from '@nestjs/common';
import { LogsRepository } from './logs.repository';
import { InsertLogsDto } from './dtos/insert-logs.dto';
import { Logs } from './logs.entity';
import { FindLogsQueryDto } from './dtos/find-logs-query.dto';

@Injectable()
export class LogsService {
  constructor(private readonly logsRepository: LogsRepository) {}

  async insertLogs(insertLogsDto: InsertLogsDto): Promise<Logs> {
    return this.logsRepository.insertLogs(insertLogsDto);
  }

  async findLogs(
    query: FindLogsQueryDto,
  ): Promise<{ logs: Logs[]; total: number; pages: number }> {
    const logs = await this.logsRepository.findLogs(query);
    return logs;
  }

  async findAllLogs(): Promise<{ logs: Logs[]; total: number }> {
    const [logsList, total] = await Logs.findAndCount();
    return {
      logs: logsList,
      total,
    };
  }
}
