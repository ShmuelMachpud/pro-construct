import { useState, useEffect } from "react";
import { getProjects } from "../../projects/services/project.service";
import { getPriceQuotes } from "../services/quotes.service";
import type { ProjectWithQuoteCount } from "../types/quotes.types";
import type { Project } from "../../projects/types/projects.types";

export const useQuotesList = () => {
  const [projects, setProjects] = useState<ProjectWithQuoteCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjects()
      .then(async (list: Project[]) => {
        const withCounts = await Promise.all(
          list.map(async (project) => {
            try {
              const quotes = await getPriceQuotes(project.id);
              return { ...project, quoteCount: quotes.length };
            } catch {
              return { ...project, quoteCount: 0 };
            }
          }),
        );
        setProjects(withCounts);
      })
      .catch(() => setError("שגיאה בטעינת הפרויקטים"))
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error };
};
