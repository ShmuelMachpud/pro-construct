import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  onChange: (value: string) => void;
}

interface GenericFormProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  infoForm: FieldConfig[];
  onSubmit: () => void;
  submitLabel: string;
  loading?: boolean;
  error?: string;
  footer?: ReactNode;
  sx?: SxProps<Theme>;
}

const GenericForm = ({
  title,
  subtitle,
  icon,
  infoForm,
  onSubmit,
  submitLabel,
  loading,
  error,
  footer,
  sx,
}: GenericFormProps) => {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const togglePassword = (name: string) =>
    setShowPasswords((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <Paper elevation={0} sx={sx}>
      <Box display="flex" flexDirection="column">
        {(icon || title) && (
          <Box display="flex" flexDirection="column" alignItems="center" mb={4} gap={1}>
            {icon && <Box display="flex" alignItems="center" gap={1}>{icon}</Box>}
            <Typography variant="h4" fontWeight="bold" color="white">
              {title}
            </Typography>
          </Box>
        )}

        {subtitle && (
          <Typography variant="h6" textAlign="center" color="grey.400" mb={4}>
            {subtitle}
          </Typography>
        )}

        {infoForm.map((field) => {
          const isPassword = field.type === "password";
          const visible = showPasswords[field.name];

          return (
            <TextField
              key={field.name}
              fullWidth
              label={field.label}
              type={isPassword && !visible ? "password" : "text"}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              margin="normal"
              slotProps={
                isPassword
                  ? {
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => togglePassword(field.name)} edge="end">
                              {visible ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }
                  : undefined
              }
            />
          );
        })}

        {error && (
          <Typography color="error" textAlign="center" mt={1} fontSize="0.9rem">
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
          sx={{ mt: 3, py: 1.5 }}
        >
          {loading ? "..." : submitLabel}
        </Button>

        {footer && (
          <Box textAlign="center" mt={2}>
            {footer}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default GenericForm;
