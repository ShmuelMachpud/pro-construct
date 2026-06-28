import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { MaterialCategory } from "../../material_categories/model/material_category.entity";

@Entity("global_materials")
export class GlobalMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  categoryId: number;

  @ManyToOne(() => MaterialCategory, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "categoryId" })
  category: MaterialCategory;

  @Column()
  unit: string;

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
