import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
  ADMIN = "admin",
  OPERATOR = "operator",
  CONTRACTOR = "contractor",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PAST_DUE = "past_due",
  CANCELLED = "cancelled",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ type: "enum", enum: SubscriptionStatus, nullable: true })
  subscriptionStatus: SubscriptionStatus | null;

  @Column({ type: "date", nullable: true })
  subscriptionStartDate: Date | null;

  @Column({ type: "date", nullable: true })
  subscriptionEndDate: Date | null;

  @Column({ type: "varchar", nullable: true })
  paymentToken: string | null;

  @Column({ type: "varchar", nullable: true })
  subscriptionPlan: "monthly" | "annual" | null;

  @Column({ type: "varchar", nullable: true })
  phone: string | null;

  @Column({ type: "varchar", nullable: true })
  companyName: string | null;

  @Column({ type: "varchar", nullable: true })
  companyId: string | null;

  @Column({ type: "varchar", nullable: true })
  address: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
