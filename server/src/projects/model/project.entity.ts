import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { ProjectType, ProjectStatus } from "../types/projects.types";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ type: "uuid" })
  clientId: string;

  @Column()
  name: string;

  @Column({ type: "enum", enum: ProjectType })
  type: ProjectType;

  @Column({ type: "enum", enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Column()
  location: string;

  @Column({ type: "date", nullable: true })
  startDate: Date | null;

  @Column({ type: "date", nullable: true })
  endDate: Date | null;

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  squareMeters: number | null;

  @Column({ type: "varchar", nullable: true })
  permitNumber: string | null;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
