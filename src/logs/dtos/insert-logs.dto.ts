import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LogsLevel } from '../enums/logsLevel.enum';
import { LogsEnvironment } from '../enums/logsEnvironment.enum';

export class InsertLogsDto {
  @IsString()
  @MinLength(4, { message: 'O nome da API deve ter mais de 4 caracteres' })
  @MaxLength(256, { message: 'O nome da API deve ter menos de 256 caracteres' })
  apiName: string;

  @IsOptional()
  description: object;

  @IsEnum(LogsLevel, { message: 'Level inválido' })
  level: string;

  @IsEnum(LogsEnvironment, { message: 'Ambiente inválido' })
  environment: string;
}
