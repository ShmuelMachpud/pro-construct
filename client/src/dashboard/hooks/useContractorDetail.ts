import { useEffect, useState } from "react";
import { getContractorById } from "../services/dashboard.service";
import {
  getContractorProjects,
  getContractorClients,
  getContractorMaterials,
  getContractorQuotes,
} from "../services/contractor.admin.service";
import type { UserInterface } from "../../users/types/users.types";
import type { Project } from "../../projects/types/projects.types";
import type { Client } from "../../clients/types/clients.types";
import type { ContractorMaterial } from "../../materials/types/materials.types";
import type { PriceQuoteWithProject } from "../../quotes/types/quotes.types";

interface ContractorDetail {
  contractor: UserInterface | null;
  projects: Project[];
  clients: Client[];
  materials: ContractorMaterial[];
  quotes: PriceQuoteWithProject[];
}

const initialDetail: ContractorDetail = {
  contractor: null,
  projects: [],
  clients: [],
  materials: [],
  quotes: [],
};

export const useContractorDetail = (contractorId: string) => {
  const [data, setData] = useState<ContractorDetail>(initialDetail);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [contractorResult, projectsResult, clientsResult, materialsResult, quotesResult] =
        await Promise.allSettled([
          getContractorById(contractorId),
          getContractorProjects(contractorId),
          getContractorClients(contractorId),
          getContractorMaterials(contractorId),
          getContractorQuotes(contractorId),
        ]);

      if (contractorResult.status === "rejected") {
        setError("קבלן לא נמצא");
        setLoading(false);
        return;
      }

      setData({
        contractor: contractorResult.value,
        projects: projectsResult.status === "fulfilled" ? projectsResult.value : [],
        clients: clientsResult.status === "fulfilled" ? clientsResult.value : [],
        materials: materialsResult.status === "fulfilled" ? materialsResult.value : [],
        quotes: quotesResult.status === "fulfilled" ? quotesResult.value : [],
      });
      setLoading(false);
    };

    fetchData();
  }, [contractorId]);

  return { data, loading, error };
};
