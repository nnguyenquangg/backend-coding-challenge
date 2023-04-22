import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  supervisorId?: string;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'supervisorId' })
  supervisor: EmployeeEntity;

  @OneToMany(() => EmployeeEntity, (employee) => employee.supervisor)
  @JoinColumn({ name: 'supervisorId' })
  employees: EmployeeEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
