import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  CONTRACTOR = "contractor",
  SITE_MANAGER = "site_manager",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  contractorId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "contractorId" })
  contractor: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}