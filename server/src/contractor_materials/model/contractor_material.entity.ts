import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from "typeorm";
import { GlobalMaterial } from "../../global_materials/model/global_material.entity";

@Entity("contractor_materials")
@Unique(["contractorId", "globalMaterialId"])
export class ContractorMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: "uuid" })
  contractorId: string;

  @Column()
  globalMaterialId: number;

  @ManyToOne(() => GlobalMaterial, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "globalMaterialId" })
  globalMaterial: GlobalMaterial;

  @Column({ type: "numeric", nullable: true, precision: 10, scale: 2 })
  price: number | null;

  @Column({ type: "varchar", nullable: true })
  supplier: string | null;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
