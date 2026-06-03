import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { QuoteItemType } from "../types/quote_items.types";

@Entity("quote_items")
export class QuoteItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quoteId: number;

  @Column({ type: "enum", enum: QuoteItemType })
  type: QuoteItemType;

  @Column({ type: "integer", nullable: true })
  sourceId: number | null;

  @Column()
  description: string;

  @Column({ type: "numeric", precision: 10, scale: 3 })
  quantity: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  unitPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
