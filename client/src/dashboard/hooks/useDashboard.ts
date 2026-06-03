import { useEffect, useState } from "react";
import { getAllContractors, getAllProjectsAdmin } from "../services/dashboard.service";
import type { DashboardData } from "../types/dashboard.types";

const initialData: DashboardData = {
  contractors: [],
  projects: [],
  stats: { activeContractors: 0, pendingApprovals: 0, totalProjects: 0 },
};

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractors, projects] = await Promise.all([
          getAllContractors(),
          getAllProjectsAdmin(),
        ]);

        const stats = {
          activeContractors: contractors.filter((c) => c.isApproved).length,
          pendingApprovals: contractors.filter((c) => !c.isApproved).length,
          totalProjects: projects.length,
        };

        setData({ contractors, projects, stats });
      } catch {
        setError("שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
