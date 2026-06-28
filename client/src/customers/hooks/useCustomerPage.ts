import { useState, useEffect } from "react";
import { getCustomerById } from "../services/customer.service";
import { getProjectsByCustomer } from "../../projects/services/project.service";
import type { Customer } from "../types/customers.types";
import type { Project } from "../../projects/types/projects.types";

export const useCustomerPage = (id: string) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCustomerById(id), getProjectsByCustomer(id)])
      .then(([customerData, projectsData]) => {
        setCustomer(customerData);
        setProjects(projectsData);
      })
      .catch(() => setError("שגיאה בטעינת נתוני הלקוח"))
      .finally(() => setLoading(false));
  }, [id]);

  return { customer, projects, loading, error };
};
