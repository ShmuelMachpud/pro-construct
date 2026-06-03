import { AppDataSource } from "../../config/database";
import { Client } from "../../clients/model/client.entity";
import { Project } from "../model/project.entity";
import { CreateProjectDto, UpdateProjectDto } from "../types/projects.types";

const repository = AppDataSource.getRepository(Project);

export const findAllProjectsDal = async () => {
  return await repository.find({ order: { createdAt: "DESC" } });
};

export const findProjectsByContractorDal = async (contractorId: string) => {
  return await repository
    .createQueryBuilder("project")
    .innerJoin(Client, "client", "client.id = project.clientId")
    .where("client.contractorId = :contractorId", { contractorId })
    .orderBy("project.createdAt", "DESC")
    .getMany();
};

export const findProjectsByClientDal = async (clientId: string) => {
  return await repository.find({ where: { clientId }, order: { createdAt: "DESC" } });
};

export const findProjectByIdDal = async (id: string) => {
  return await repository.findOne({ where: { id } });
};

export const findProjectByIdAndContractorDal = async (
  id: string,
  contractorId: string,
) => {
  return await repository
    .createQueryBuilder("project")
    .innerJoin(Client, "client", "client.id = project.clientId")
    .where("project.id = :id", { id })
    .andWhere("client.contractorId = :contractorId", { contractorId })
    .getOne();
};

export const insertProjectDal = async (data: CreateProjectDto) => {
  const item = repository.create(data);
  return await repository.save(item);
};

export const updateProjectByIdDal = async (id: string, data: UpdateProjectDto) => {
  await repository.update(id, data);
  return await repository.findOne({ where: { id } });
};

export const deleteProjectDal = async (id: string) => {
  const result = await repository.delete(id);
  return (result.affected ?? 0) > 0;
};
