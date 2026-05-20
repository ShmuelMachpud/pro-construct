import Joi from "joi";
import type { Project, UpdateProjectFormType } from "../types/projects.types";

export const getEditProjectInitialData = (project: Project): UpdateProjectFormType => ({
  name: project.name,
  type: project.type,
  location: project.location,
  status: project.status,
  startDate: project.startDate ? project.startDate.slice(0, 10) : "",
  endDate: project.endDate ? project.endDate.slice(0, 10) : "",
  description: project.description ?? "",
  squareMeters: project.squareMeters ? String(project.squareMeters) : "",
  permitNumber: project.permitNumber ?? "",
  notes: project.notes ?? "",
});

export const editProjectSchema = Joi.object<UpdateProjectFormType>({
  name: Joi.string().required().messages({ "string.empty": "שם פרויקט הוא שדה חובה", "any.required": "שם פרויקט הוא שדה חובה" }),
  type: Joi.string().valid("construction", "renovation").required().messages({ "any.only": "סוג פרויקט לא תקין", "string.empty": "סוג פרויקט הוא שדה חובה" }),
  location: Joi.string().required().messages({ "string.empty": "מיקום הוא שדה חובה", "any.required": "מיקום הוא שדה חובה" }),
  status: Joi.string().valid("planning", "in_progress", "completed").allow("").optional(),
  startDate: Joi.string().allow("").optional(),
  endDate: Joi.string().allow("").optional(),
  description: Joi.string().allow("").optional(),
  squareMeters: Joi.string().allow("").optional(),
  permitNumber: Joi.string().allow("").optional(),
  notes: Joi.string().allow("").optional(),
});
