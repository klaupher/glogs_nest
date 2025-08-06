import { Transform } from 'class-transformer';
import { IsOptional, IsObject } from 'class-validator';

export abstract class BaseQueryParametersDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;

    const sortEntries = value.split(',').map((pair: string) => {
      const [key, order] = pair.split(':');
      return [key.trim(), order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'];
    });

    return Object.fromEntries(sortEntries);
  })
  @IsObject()
  sort?: Record<string, 'ASC' | 'DESC'>;

  page?: number;
  pages?: number;
  limit?: number;
}
