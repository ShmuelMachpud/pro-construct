import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  getAllQuotesByContractorController,
  getAllPriceQuotesController,
  getPriceQuoteByIdController,
  createPriceQuoteController,
  updatePriceQuoteController,
  removePriceQuoteController,
} from "../controllers/price_quotes.controller";

export const allQuotesRouter = Router();
allQuotesRouter.use(authenticate);
allQuotesRouter.get("/", getAllQuotesByContractorController);

export const priceQuotesRouter = Router({ mergeParams: true });

priceQuotesRouter.use(authenticate);

priceQuotesRouter.get("/", getAllPriceQuotesController);
priceQuotesRouter.get("/:quoteId", getPriceQuoteByIdController);
priceQuotesRouter.post("/", createPriceQuoteController);
priceQuotesRouter.patch("/:quoteId", updatePriceQuoteController);
priceQuotesRouter.delete("/:quoteId", removePriceQuoteController);
