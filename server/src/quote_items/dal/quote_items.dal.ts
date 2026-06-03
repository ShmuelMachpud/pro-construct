import { AppDataSource } from "../../config/database";
import { QuoteItem } from "../model/quote_item.entity";
import { CreateQuoteItemDto, UpdateQuoteItemDto } from "../types/quote_items.types";

const repository = AppDataSource.getRepository(QuoteItem);

export const findAllQuoteItemsDal = async (quoteId: number) => {
  return await repository.find({
    where: { quoteId },
    order: { createdAt: "ASC" },
  });
};

export const findQuoteItemByIdDal = async (id: number, quoteId: number) => {
  return await repository.findOne({ where: { id, quoteId } });
};

export const insertQuoteItemDal = async (quoteId: number, dto: CreateQuoteItemDto) => {
  const item = repository.create({ quoteId, ...dto });
  return await repository.save(item);
};

export const updateQuoteItemByIdDal = async (
  id: number,
  quoteId: number,
  dto: UpdateQuoteItemDto,
) => {
  await repository.update({ id, quoteId }, dto);
  return await repository.findOne({ where: { id, quoteId } });
};

export const deleteQuoteItemDal = async (id: number, quoteId: number) => {
  const result = await repository.delete({ id, quoteId });
  return (result.affected ?? 0) > 0;
};
