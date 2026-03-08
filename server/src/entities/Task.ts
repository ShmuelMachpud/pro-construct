import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Project } from "./Project";
import { Employee } from "./Employee";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date", nullable: true })
  endDate: Date;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2 })
  estimatedHours: number;

  @Column()
  projectId: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "projectId" })
  project: Project;

  @Column({ nullable: true })
  employeeId: number;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: "employeeId" })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}