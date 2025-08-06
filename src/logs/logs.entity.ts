import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Logs extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  apiName: string;

  @Column({ nullable: true, type: 'json' })
  description: object;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  level: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  environment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
