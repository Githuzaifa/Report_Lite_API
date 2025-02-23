import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class SalesData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  data: object;

  @CreateDateColumn()
  createdAt: Date;
}
