import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { QuoteStatus } from "../types/price_quotes.types";

@Entity("price_quotes")
export class PriceQuote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  projectId: string;

  @Column()
  title: string;

  @Column({ type: "enum", enum: QuoteStatus, default: QuoteStatus.DRAFT })
  status: QuoteStatus;

  @Column({ type: "date", nullable: true })
  validUntil: Date | null;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
