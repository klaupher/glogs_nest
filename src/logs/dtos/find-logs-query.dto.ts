import { BaseQueryParametersDto } from 'src/shared/dtos/base-query-parameters.dto';

export class FindLogsQueryDto extends BaseQueryParametersDto {
  apiName: string;
  description: string;
  level: string;
  environment: boolean;
  startAt: string;
  finishAt: string;
}
