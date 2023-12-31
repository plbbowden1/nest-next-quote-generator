import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  quote?: string;

  @Column()
  character?: string;
}
