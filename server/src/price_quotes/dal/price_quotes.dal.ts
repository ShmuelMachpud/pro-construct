import { AppDataSource } from "../../config/database";
import { PriceQuote } from "../model/price_quote.entity";
import { CreatePriceQuoteDto, UpdatePriceQuoteDto } from "../types/price_quotes.types";

const repository = AppDataSource.getRepository(PriceQuote);

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
  dto: UpdatePriceQuoteDto,
) => {
  await repository.update({ id, projectId }, dto);
  return await repository.findOne({ where: { id, projectId } });
};

export const deletePriceQuoteDal = async (id: number, projectId: string) => {
  const result = await repository.delete({ id, projectId });
  return (result.affected ?? 0) > 0;
};
