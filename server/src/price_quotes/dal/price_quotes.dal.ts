import { AppDataSource } from "../../config/database";
import { Client } from "../../clients/model/client.entity";
import { Project } from "../../projects/model/project.entity";
import { PriceQuote } from "../model/price_quote.entity";
import { CreatePriceQuoteDto, PriceQuoteWithProject, UpdatePriceQuoteDto, UpdatePriceQuoteInternalDto } from "../types/price_quotes.types";

const repository = AppDataSource.getRepository(PriceQuote);

export const findAllQuotesByContractorDal = async (contractorId: string): Promise<PriceQuoteWithProject[]> => {
  return await repository
    .createQueryBuilder("quote")
    .innerJoin(Project, "project", "project.id = quote.projectId")
    .innerJoin(Client, "client", "client.id = project.clientId")
    .where("client.contractorId = :contractorId", { contractorId })
    .select([
      "quote.id AS id",
      'quote.projectId AS "projectId"',
      'project.name AS "projectName"',
      "quote.title AS title",
      "quote.status AS status",
      'quote.validUntil AS "validUntil"',
      "quote.notes AS notes",
      'quote.createdAt AS "createdAt"',
      'quote.updatedAt AS "updatedAt"',
    ])
    .orderBy("quote.createdAt", "DESC")
    .getRawMany();
};

export const findAllPriceQuotesDal = async (projectId: string) => {
  return await repository.find({
    where: { projectId },
    order: { createdAt: "DESC" },
  });
};

export const findPriceQuoteByIdDal = async (id: number, projectId: string) => {
  return await repository.findOne({ where: { id, projectId } });
};

export const insertPriceQuoteDal = async (projectId: string, dto: CreatePriceQuoteDto) => {
  const quote = repository.create({ projectId, ...dto });
  return await repository.save(quote);
};

export const updatePriceQuoteByIdDal = async (
  id: number,
  projectId: string,
  dto: UpdatePriceQuoteDto | UpdatePriceQuoteInternalDto,
) => {
  await repository.update({ id, projectId }, dto);
  return await repository.findOne({ where: { id, projectId } });
};

export const deletePriceQuoteDal = async (id: number, projectId: string) => {
  const result = await repository.delete({ id, projectId });
  return (result.affected ?? 0) > 0;
};
