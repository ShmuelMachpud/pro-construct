import { Box, Paper, Typography } from "@mui/material";
import type { DashboardStats } from "../types/dashboard.types";

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

const StatCard = ({ label, value, color = "#FF6B00" }: StatCardProps) => (
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
    <Typography variant="h3" fontWeight="bold" sx={{ color }}>
      {value}
    </Typography>
    <Typography color="grey.400" mt={1}>
      {label}
    </Typography>
  </Paper>
);

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => (
  <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
    <StatCard label="קבלנים פעילים" value={stats.activeContractors} />
    <StatCard label="ממתינים לאישור" value={stats.pendingApprovals} color="#FF6B00" />
    <StatCard label="סה״כ פרויקטים" value={stats.totalProjects} color="#4CAF50" />
  </Box>
);

export default StatsCards;
