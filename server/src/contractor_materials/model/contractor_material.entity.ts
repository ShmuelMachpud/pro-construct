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

// One row = one global material adopted by one contractor.
// The composite UNIQUE constraint guarantees a contractor cannot
// hold two price entries for the same catalog material
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

  // RESTRICT: a global material cannot be deleted from the catalog
  // while any contractor still references it
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
