import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  getAllQuoteItemsController,
  getQuoteItemByIdController,
  addQuoteItemController,
  updateQuoteItemController,
  removeQuoteItemController,
} from "../controllers/quote_items.controller";

export const quoteItemsRouter = Router({ mergeParams: true });

quoteItemsRouter.use(authenticate);

quoteItemsRouter.get("/", getAllQuoteItemsController);
quoteItemsRouter.get("/:itemId", getQuoteItemByIdController);
quoteItemsRouter.post("/", addQuoteItemController);
quoteItemsRouter.patch("/:itemId", updateQuoteItemController);
quoteItemsRouter.delete("/:itemId", removeQuoteItemController);
