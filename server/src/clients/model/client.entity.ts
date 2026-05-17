import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/model/user.entity";

export enum ClientType {
  PRIVATE = "private",
  BUSINESS = "business",
}

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "enum", enum: ClientType })
  type: ClientType;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  idNumber: string;

  @Column({ nullable: true })
  notes: string;

  @Column()
  contractorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "contractorId" })
  contractor: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
