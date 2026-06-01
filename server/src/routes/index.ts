import { Router, Request, Response } from "express";

import { handleError } from "../utils/handleError";
import { CustomError } from "../utils/customError";
import { clientsRouter } from "../clients/routes/clients.router";
import { projectsRouter } from "../projects/routes/projects.router";
import { paypalRouter } from "../paypal/routes/paypal.router";
import { materialCategoriesRouter } from "../material_categories/routes/material_categories.router";
import { globalMaterialsRouter } from "../global_materials/routes/global_materials.router";
import { contractorMaterialsRouter } from "../contractor_materials/routes/contractor_materials.router";
import { projectMaterialsRouter } from "../project_materials/routes/project_materials.router";

export const router = Router();

router.use("/clients", clientsRouter);
router.use("/projects", projectsRouter);
router.use("/paypal", paypalRouter);
router.use("/material-categories", materialCategoriesRouter);
router.use("/global-materials", globalMaterialsRouter);
router.use("/contractor-materials", contractorMaterialsRouter);
router.use("/projects/:projectId/materials", projectMaterialsRouter);

router.use((req: Request, res: Response) =>
  handleError(
    new CustomError(`Route not found: ${req.method} ${req.originalUrl}`, 404),
    res,
  ),
);
