import { useState, useEffect } from "react";
import { getProjects } from "../../projects/services/project.service";
import { getProjectMaterials } from "../services/quotes.service";
import type { ProjectWithTotal } from "../types/quotes.types";
import type { Project } from "../../projects/types/projects.types";

const calcTotal = (materials: Awaited<ReturnType<typeof getProjectMaterials>>) =>
  materials.reduce((sum, m) => {
    const price = m.contractorMaterial.price ?? 0;
    return sum + Number(price) * Number(m.quantity);
  }, 0);

export const useQuotesList = () => {
  const [projects, setProjects] = useState<ProjectWithTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjects()
      .then(async (list: Project[]) => {
        const withTotals = await Promise.all(
          list.map(async (project) => {
            try {
              const materials = await getProjectMaterials(project.id);
              return { ...project, total: calcTotal(materials) };
            } catch {
              return { ...project, total: 0 };
            }
          }),
        );
        setProjects(withTotals);
      })
      .catch(() => setError("שגיאה בטעינת הפרויקטים"))
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error };
};
