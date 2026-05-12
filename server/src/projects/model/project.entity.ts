import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../auth/model/user.entity";
import { Client } from "../../clients/model/client.entity";

export enum ProjectType {
  NEW_CONSTRUCTION = "new_construction",
  RENOVATION = "renovation",
  INFRASTRUCTURE = "infrastructure",
  OTHER = "other",
}

export enum ProjectStatus {
  PLANNING = "planning",
  IN_PROGRESS = "in_progress",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
}

export enum PermitStatus {
  NOT_REQUIRED = "not_required",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "enum", enum: ProjectType })
  type: ProjectType;

  @Column({ type: "enum", enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Column()
  city: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2 })
  budget: number;

  @Column({ type: "enum", enum: PermitStatus, nullable: true })
  permitStatus: PermitStatus;

  @Column()
  contractorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "contractorId" })
  contractor: User;

  @Column()
  clientId: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: "clientId" })
  client: Client;

  @Column({ nullable: true })
  siteManagerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "siteManagerId" })
  siteManager: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
