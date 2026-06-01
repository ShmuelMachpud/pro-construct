import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { ContractorMaterial } from "../../contractor_materials/model/contractor_material.entity";

@Entity("project_materials")
@Unique(["projectId", "contractorMaterialId"])
export class ProjectMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  projectId: string;

  @Column()
  contractorMaterialId: number;

  @ManyToOne(() => ContractorMaterial, { eager: true, onDelete: "RESTRICT" })
  @JoinColumn({ name: "contractorMaterialId" })
  contractorMaterial: ContractorMaterial;

  @Column({ type: "numeric", precision: 10, scale: 3 })
  quantity: number;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
