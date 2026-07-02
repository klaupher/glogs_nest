import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { InsertLogsDto } from './dtos/insert-logs.dto';
import { LogsService } from './logs.service';
import { RolesGuard } from '../auth/guard/roles.guard';
import { FindLogsQueryDto } from './dtos/find-logs-query.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { type AuthenticatedRequest } from '../auth/types/authenticated-request';
import { Logs } from './logs.entity';

@Controller('logs')
@UseGuards(JwtAuthGuard)
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Post()
    async insertNewLogs(
        @Body(ValidationPipe) insertLogsDto: InsertLogsDto,
        @Req() req: AuthenticatedRequest,
    ) {
        console.log('Dados recebidos ', insertLogsDto);
        const logs = await this.logsService.insertLogs(insertLogsDto, req.user);
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
