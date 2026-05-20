import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ClientType } from "../types/clients.types";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid"})
  contractorId: string;

  @Column({ type: "enum", enum: ClientType })
  type: ClientType;

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
