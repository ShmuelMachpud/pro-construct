import Joi from "joi";
import { CustomError } from "../../utils/customError";
import {
  CreateProjectDto,
  ProjectType,
  ProjectStatus,
} from "../types/projects.types";

const createProjectSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  name: Joi.string().min(2).max(150).required(),
  type: Joi.string()
    .valid(...Object.values(ProjectType))
    .required(),
  location: Joi.string().min(2).max(255).required(),
  status: Joi.string().valid(...Object.values(ProjectStatus)),
  startDate: Joi.string().allow(null),
  endDate: Joi.string().allow(null),
  description: Joi.string().allow(null, ""),
  squareMeters: Joi.number().positive().allow(null),
  permitNumber: Joi.string().allow(null, ""),
  notes: Joi.string().allow(null, ""),
});

export const validateCreateProjectDto = (
  dto: CreateProjectDto,
): CreateProjectDto => {
  const { error, value } = createProjectSchema.validate(dto, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    throw new CustomError(message, 400);
  }

  return value;
};
