import { AppDataSource } from "../../config/database";
import { Project } from "../../entities/Project";

const projectRepository = AppDataSource.getRepository(Project);

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const project = projectRepository.create(data);
  return await projectRepository.save(project);
};

export const getProjectsByContractor = async (contractorId: number): Promise<Project[]> => {
  return await projectRepository.find({
    where: { contractorId },
    relations: ["client", "siteManager"],
    order: { createdAt: "DESC" },
  });
};

export const getProjectById = async (id: number, contractorId: number): Promise<Project | null> => {
  return await projectRepository.findOne({
    where: { id, contractorId },
    relations: ["client", "siteManager"],
  });
};
