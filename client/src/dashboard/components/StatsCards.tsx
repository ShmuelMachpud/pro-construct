import { Box, Paper, Skeleton, Typography } from "@mui/material";
import type { DashboardStats } from "../types/dashboard.types";

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
  loading?: boolean;
}

const StatCard = ({ label, value, color = "#FF6B00", loading }: StatCardProps) => (
  <Paper
    sx={{
      flex: 1,
      p: 3,
      backgroundColor: "#1A1A1A",
      border: "1px solid rgba(255,107,0,0.2)",
      borderRadius: 2,
      textAlign: "center",
    }}
  >
    {loading ? (
      <Skeleton variant="text" sx={{ fontSize: "3.75rem", bgcolor: "rgba(255,107,0,0.1)", mx: "auto", width: "60%" }} />
    ) : (
      <Typography variant="h3" fontWeight="bold" sx={{ color }}>
        {value}
      </Typography>
    )}
    <Typography color="grey.400" mt={1}>
      {label}
    </Typography>
  </Paper>
);

interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
}

const StatsCards = ({ stats, loading }: StatsCardsProps) => (
  <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
    <StatCard label="קבלנים פעילים" value={stats.activeContractors} loading={loading} />
    <StatCard label="ממתינים לאישור" value={stats.pendingApprovals} color="#FF6B00" loading={loading} />
    <StatCard label="סה״כ פרויקטים" value={stats.totalProjects} color="#4CAF50" loading={loading} />
  </Box>
);

export default StatsCards;
