import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/auth.types";
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
quoteItemsRouter.post("/", authorize(UserRole.CONTRACTOR), addQuoteItemController);
quoteItemsRouter.patch("/:itemId", authorize(UserRole.CONTRACTOR), updateQuoteItemController);
quoteItemsRouter.delete("/:itemId", authorize(UserRole.CONTRACTOR), removeQuoteItemController);
