import { useState } from "react";
import {
  Popover, Box, TextField, Button, Checkbox, FormControlLabel, Typography, Divider,
} from "@mui/material";

interface ColumnFilterMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  options: string[];
  isValueChecked: (value: string) => boolean;
  onToggle: (value: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const ColumnFilterMenu = ({
  anchorEl,
  open,
  onClose,
  options,
  isValueChecked,
  onToggle,
  onSelectAll,
  onClearAll,
}: ColumnFilterMenuProps) => {
  const [search, setSearch] = useState("");

  const visibleOptions = search
    ? options.filter((option) => option.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={() => { setSearch(""); onClose(); }}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#1E1E1E",
            border: "1px solid rgba(255,107,0,0.2)",
            borderRadius: 2,
            minWidth: 240,
            maxWidth: 320,
          },
        },
      }}
    >
      <Box sx={{ p: 1.5 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="חיפוש..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Button size="small" onClick={onSelectAll} sx={{ color: "#FF6B00" }}>
            בחר הכל
          </Button>
          <Button size="small" onClick={onClearAll} sx={{ color: "grey.500" }}>
            נקה הכל
          </Button>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 1 }} />
        <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
          {visibleOptions.length === 0 ? (
            <Typography color="grey.500" fontSize="0.875rem" sx={{ p: 1 }}>
              אין ערכים
            </Typography>
          ) : (
            visibleOptions.map((option) => (
              <FormControlLabel
                key={option}
                sx={{ display: "flex", ml: 0, color: "grey.300" }}
                control={
                  <Checkbox
                    size="small"
                    checked={isValueChecked(option)}
                    onChange={() => onToggle(option)}
                    sx={{ color: "grey.600", "&.Mui-checked": { color: "#FF6B00" } }}
                  />
                }
                label={<Typography fontSize="0.875rem" color="grey.300">{option}</Typography>}
              />
            ))
          )}
        </Box>
      </Box>
    </Popover>
  );
};
