import { Repository } from 'typeorm';
import { Logs } from './logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertLogsDto } from './dtos/insert-logs.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FindLogsQueryDto } from './dtos/find-logs-query.dto';
import {
  firstDayOfMonth,
  lastDayOfMonth,
} from 'src/shared/dtos/utils/date-time-functions';

export class LogsRepository {
  constructor(
    @InjectRepository(Logs)
    private readonly repo: Repository<Logs>,
  ) {}

  async insertLogs(insertLogsDto: InsertLogsDto): Promise<Logs> {
    const { apiName, level, description, environment } = insertLogsDto;

    const logs = new Logs();
    logs.apiName = apiName;
    logs.description = description ?? {};
    logs.level = level;
    logs.environment = environment;
    try {
      await logs.save();
      return logs;
    } catch (error: any) {
      if (error.code.toString() === '23505') {
        throw new ConflictException(
          'Os dados estão em conflito com os demais registros',
        );
      } else {
        throw new InternalServerErrorException(
          'Erro ao inserir o log no banco de dados',
        );
      }
    }
  }

  async findLogs(
    queryDto: FindLogsQueryDto,
  ): Promise<{ logs: Logs[]; total: number; pages: number }> {
    queryDto.page =
      queryDto.page === undefined || queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit =
      queryDto.limit === undefined || queryDto.limit > 100
        ? 100
        : queryDto.limit;

    const { apiName, description, environment, level, startAt, finishAt } =
      queryDto;
    const query = this.repo.createQueryBuilder('logs');

    if (apiName) {
      query.andWhere('logs.apiName ILIKE :apiName', {
        apiName: `%${apiName}%`,
      });
    }
    if (description) {
      query.andWhere('logs.description ILIKE :description', {
        description: `%${description}%`,
      });
    }
    if (environment) {
      query.andWhere('logs.environment = :environment', {
        environment: `${environment}`,
      });
    }
    if (level) {
      query.andWhere('logs.level = :level', { level: `${level}` });
    }
    query.andWhere('logs.createdAt between :startAt and :finishAt', {
      startAt: `${startAt ?? firstDayOfMonth(new Date()).toISOString()}`,
      finishAt: `${finishAt ?? lastDayOfMonth(new Date()).toISOString()}`,
    });

    query.take(queryDto.limit);
    query.skip((queryDto.page - 1) * queryDto.limit);

    if (queryDto.sort) {
      console.log('Sorte recebido repo', queryDto.sort);
      console.log('Sorte recebido repo2', Object.entries(queryDto.sort));
      Object.entries(queryDto.sort).forEach(([field, order]) => {
        query.addOrderBy(`logs.${field}`, order);
      });
    }

    query.select([
      'logs.apiName',
      'logs.description',
      'logs.environment',
      'logs.level',
    ]);
    const [logs, total] = await query.getManyAndCount();
    const pages = Math.round(total / queryDto.limit);
    return { logs, total, pages };
  }
}
