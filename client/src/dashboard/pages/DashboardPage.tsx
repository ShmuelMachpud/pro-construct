import { Box, Typography } from "@mui/material";
import { useDashboard } from "../hooks/useDashboard";
import StatsCards from "../components/StatsCards";
import GenericTable from "../../global/components/GenericTable";
import { contractorsColumns, projectsColumns } from "../helpers/dashboard.columns";
import { useAuth } from "../../global/hooks/useAuth";

const DashboardPage = () => {
  const { data, loading, error } = useDashboard();
  const { isAdmin } = useAuth();

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
        דשבורד {isAdmin ? "מנהל" : "אופרייטור"}
      </Typography>

      <StatsCards stats={data.stats} />

      <Typography variant="h6" color="white" mb={2}>
        קבלנים
      </Typography>
      <Box mb={4}>
        <GenericTable
          columns={contractorsColumns}
          rows={data.contractors}
          loading={loading}
          emptyMessage="אין קבלנים במערכת"
        />
      </Box>

      <Typography variant="h6" color="white" mb={2}>
        פרויקטים
      </Typography>
      <GenericTable
        columns={projectsColumns}
        rows={data.projects}
        loading={loading}
        emptyMessage="אין פרויקטים במערכת"
      />
    </Box>
  );
};

export default DashboardPage;
