import { Router } from "express";
import {
  getAllCustomersController,
  getCustomersByContractorController,
  getCustomerByIdController,
  createCustomerController,
  updateCustomerController,
  removeCustomerController,
} from "../controllers/customers.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/auth.types";

export const customersRouter = Router();

customersRouter.use(authenticate);

customersRouter.get(
  "/contractor/:contractorId",
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  getCustomersByContractorController,
);
customersRouter.get("/", getAllCustomersController);
customersRouter.get("/:id", getCustomerByIdController);
customersRouter.post(
  "/",
  authorize(UserRole.CONTRACTOR),
  createCustomerController,
);
customersRouter.put(
  "/:id",
  authorize(UserRole.CONTRACTOR),
  updateCustomerController,
);
customersRouter.delete(
  "/:id",
  authorize(UserRole.CONTRACTOR),
  removeCustomerController,
);
