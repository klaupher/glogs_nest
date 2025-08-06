import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { Logs } from './logs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsRepository } from './logs.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Logs]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [LogsController],
  providers: [LogsService, LogsRepository],
  exports: [LogsRepository],
})
export class LogsModule {}
