import { useState, useEffect } from "react";
import { getProjects } from "../services/project.service";
import type { Project } from "../types/projects.types";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = () => {
    setLoading(true);
    getProjects()
      .then(setProjects)
      .catch(() => setError("שגיאה בטעינת הפרויקטים"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, selectedProject, setSelectedProject, fetchProjects };
};
