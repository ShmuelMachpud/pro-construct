import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { CalendarMonth, CalendarToday } from "@mui/icons-material";
import type { RegisterPlan } from "../../types/auth.types";

interface PlanSelectorProps {
  value: RegisterPlan;
  onChange: (plan: RegisterPlan) => void;
}

const PlanSelector = ({ value, onChange }: PlanSelectorProps) => (
  <Box sx={{ mt: 2 }}>
    <Typography variant="body2" color="grey.400" sx={{ mb: 1 }}>
      בחר תוכנית
    </Typography>
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, val) => { if (val) onChange(val); }}
      fullWidth
      size="small"
    >
      <ToggleButton value="monthly" sx={{ gap: 1, py: 1.5 }}>
        <CalendarToday fontSize="small" />
        <Box textAlign="right">
          <Typography variant="body2" fontWeight={600}>חודשי</Typography>
          <Typography variant="caption" color="grey.400">99 ₪ / חודש</Typography>
        </Box>
      </ToggleButton>
      <ToggleButton value="annual" sx={{ gap: 1, py: 1.5 }}>
        <CalendarMonth fontSize="small" />
        <Box textAlign="right">
          <Typography variant="body2" fontWeight={600}>שנתי</Typography>
          <Typography variant="caption" color="grey.400">1,000 ₪ / שנה</Typography>
        </Box>
      </ToggleButton>
    </ToggleButtonGroup>
  </Box>
);

export default PlanSelector;
