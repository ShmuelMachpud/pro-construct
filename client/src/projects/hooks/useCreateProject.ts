import { useState, useEffect } from "react";
import { useForm } from "../../global/hooks/useForm";
import { createProject } from "../services/project.service";
import { getClients } from "../../clients/services/client.service";
import { createProjectInitialData, createProjectSchema } from "../helpers/createProject.helpers";
import type { Client } from "../../clients/types/clients.types";
import type { CreateProjectFormType, ProjectType, ProjectStatus } from "../types/projects.types";

export const useCreateProject = (open: boolean, onCreated: () => void, onClose: () => void) => {
  const { values, setValue, errors, setFieldError, onBlur, isValid, validate, reset } =
    useForm<CreateProjectFormType>(createProjectInitialData, createProjectSchema);

  const validateDateRange = (startDate: string, endDate: string) => {
    if (startDate && endDate && endDate < startDate)
      setFieldError("endDate", "תאריך סיום חייב להיות אחרי תאריך ההתחלה");
    else
      setFieldError("endDate", undefined);
  };

  const setDateValue = (field: "startDate" | "endDate", value: string) => {
    setValue(field, value);
    const start = field === "startDate" ? value : values.startDate;
    const end = field === "endDate" ? value : values.endDate;
    validateDateRange(start, end);
  };
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoadingClients(true);
    getClients()
      .then(setClients)
      .catch(() => setServerError("שגיאה בטעינת רשימת הלקוחות"))
      .finally(() => setLoadingClients(false));
  }, [open]);

  const handleClose = () => {
    reset();
    setServerError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setServerError("");
    setLoading(true);
    try {
      await createProject({
        name: values.name,
        type: values.type as ProjectType,
        location: values.location,
        clientId: values.clientId,
        status: values.status ? (values.status as ProjectStatus) : undefined,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        description: values.description || null,
        squareMeters: values.squareMeters ? Number(values.squareMeters) : null,
        permitNumber: values.permitNumber || null,
        notes: values.notes || null,
      });
      onCreated();
      handleClose();
    } catch {
      setServerError("אירעה שגיאה ביצירת הפרויקט");
    } finally {
      setLoading(false);
    }
  };

  return { values, setValue, setDateValue, errors, onBlur, isValid, clients, loadingClients, loading, serverError, handleSubmit, handleClose };
};
