import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Project } from "./Project";

export enum ExpenseCategory {
  MATERIALS = "materials",
  LABOR = "labor",
  EQUIPMENT = "equipment",
  OTHER = "other",
}

@Entity("expenses")
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: "enum", enum: ExpenseCategory })
  category: ExpenseCategory;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "date" })
  date: Date;

  @Column()
  projectId: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "projectId" })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}