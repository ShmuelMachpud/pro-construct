import { useState, useEffect } from "react";
import { getClientById } from "../services/client.service";
import { getProjectsByClient } from "../../projects/services/project.service";
import type { Client } from "../types/clients.types";
import type { Project } from "../../projects/types/projects.types";

export const useClientPage = (id: string) => {
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getClientById(id), getProjectsByClient(id)])
      .then(([clientData, projectsData]) => {
        setClient(clientData);
        setProjects(projectsData);
      })
      .catch(() => setError("שגיאה בטעינת נתוני הלקוח"))
      .finally(() => setLoading(false));
  }, [id]);

  return { client, projects, loading, error };
};
