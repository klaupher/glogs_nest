import { Injectable } from '@nestjs/common';
import { LogsRepository } from './logs.repository';
import { InsertLogsDto } from './dtos/insert-logs.dto';
import { Logs } from './logs.entity';
import { FindLogsQueryDto } from './dtos/find-logs-query.dto';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class LogsService {
    constructor(private readonly logsRepository: LogsRepository) {}

    async insertLogs(newLogs: InsertLogsDto, userLogged: User): Promise<Logs> {
        return this.logsRepository.insertLogs(newLogs, userLogged);
    }

    async findLogs(
        query: FindLogsQueryDto,
    ): Promise<{ logs: Logs[]; total: number; pages: number }> {
        const logs = await this.logsRepository.findLogs(query);
        return logs;
    }

    async findAllLogs(): Promise<{ logs: Logs[]; total: number }> {
        const [logsList, total] = await Logs.findAndCount({
            order: { createdAt: 'DESC' },
        });
        logsList.forEach((log) => {
            console.log(JSON.stringify(log.description));
            console.log(log.description);
        });
        return {
            logs: logsList,
            total,
        };
    }
}
