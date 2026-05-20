import Joi from "joi";
import type { CreateProjectFormType, ProjectType, ProjectStatus } from "../types/projects.types";

export const projectTypeOptions: { value: ProjectType; label: string }[] = [
  { value: "construction", label: "בנייה חדשה" },
  { value: "renovation", label: "שיפוץ" },
];

export const projectStatusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "תכנון" },
  { value: "in_progress", label: "בביצוע" },
  { value: "completed", label: "הושלם" },
];

export const createProjectInitialData: CreateProjectFormType = {
  name: "",
  type: "",
  location: "",
  clientId: "",
  status: "",
  startDate: "",
  endDate: "",
  description: "",
  squareMeters: "",
  permitNumber: "",
  notes: "",
};

export const createProjectSchema = Joi.object<CreateProjectFormType>({
  name: Joi.string().required().messages({ "string.empty": "שם פרויקט הוא שדה חובה", "any.required": "שם פרויקט הוא שדה חובה" }),
  type: Joi.string().valid("construction", "renovation").required().messages({ "any.only": "סוג פרויקט לא תקין", "string.empty": "סוג פרויקט הוא שדה חובה", "any.required": "סוג פרויקט הוא שדה חובה" }),
  location: Joi.string().required().messages({ "string.empty": "מיקום הוא שדה חובה", "any.required": "מיקום הוא שדה חובה" }),
  clientId: Joi.string().required().messages({ "string.empty": "יש לבחור לקוח", "any.required": "יש לבחור לקוח" }),
  status: Joi.string().valid("planning", "in_progress", "completed").allow("").optional(),
  startDate: Joi.string().allow("").optional(),
  endDate: Joi.string().allow("").optional(),
  description: Joi.string().allow("").optional(),
  squareMeters: Joi.string().allow("").optional(),
  permitNumber: Joi.string().allow("").optional(),
  notes: Joi.string().allow("").optional(),
});
