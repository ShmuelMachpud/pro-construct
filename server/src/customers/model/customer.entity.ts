import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { CustomerType } from "../types/customer.types";

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ type: "uuid" })
  contractorId: string;

  @Column({ type: "enum", enum: CustomerType })
  type: CustomerType;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column({ type: "varchar", nullable: true })
  billingName: string | null;

  @Column({ type: "varchar", nullable: true })
  billingPhone: string | null;

  @Column({ type: "varchar", nullable: true })
  billingAddress: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
