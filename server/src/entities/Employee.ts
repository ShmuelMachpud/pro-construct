import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export enum EmployeeRole {
  WORKER = "worker",
  FOREMAN = "foreman",
  ENGINEER = "engineer",
  OTHER = "other",
}

@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "enum", enum: EmployeeRole })
  role: EmployeeRole;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2 })
  hourlyRate: number;

  @Column()
  contractorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "contractorId" })
  contractor: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}