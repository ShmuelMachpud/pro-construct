import { useState, useEffect } from "react";
import { useForm } from "../../global/hooks/useForm";
import { getProjectById, updateProject } from "../services/project.service";
import { getEditProjectInitialData, editProjectSchema } from "../helpers/editProject.helpers";
import type { Project, UpdateProjectFormType, ProjectType, ProjectStatus } from "../types/projects.types";

const emptyForm: UpdateProjectFormType = {
  name: "", type: "", location: "", status: "",
  startDate: "", endDate: "", description: "",
  squareMeters: "", permitNumber: "", notes: "",
};

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const { values, setValue, errors, validate } = useForm<UpdateProjectFormType>(emptyForm);

  useEffect(() => {
    getProjectById(id)
      .then(setProject)
      .catch(() => setError("שגיאה בטעינת הפרויקט"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!project || !editMode) return;
    const data = getEditProjectInitialData(project);
    (Object.keys(data) as (keyof UpdateProjectFormType)[]).forEach((key) => setValue(key, data[key]));
  }, [editMode, project]);

  const handleCancelEdit = () => setEditMode(false);

  const handleSave = async () => {
    if (!validate(editProjectSchema)) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateProject(id, {
        name: values.name,
        type: values.type as ProjectType,
        location: values.location,
        status: values.status ? (values.status as ProjectStatus) : undefined,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        description: values.description || null,
        squareMeters: values.squareMeters ? Number(values.squareMeters) : null,
        permitNumber: values.permitNumber || null,
        notes: values.notes || null,
      });
      setProject(updated);
      setEditMode(false);
    } catch {
      setError("שגיאה בשמירת הפרויקט");
    } finally {
      setSaving(false);
    }
  };

  return { project, loading, saving, error, editMode, setEditMode, handleCancelEdit, handleSave, values, setValue, errors };
};
