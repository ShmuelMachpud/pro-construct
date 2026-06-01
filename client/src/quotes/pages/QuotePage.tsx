import { useState } from "react";
import {
  Box, Typography, Button, Chip, Divider, CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectMaterials } from "../hooks/useProjectMaterials";
import { useContractorMaterials } from "../../materials/hooks/useContractorMaterials";
import QuoteMaterialsTable from "../components/QuoteMaterialsTable";
import AddProjectMaterialModal from "../components/AddProjectMaterialModal";
import { calcGrandTotal, formatCurrency } from "../helpers/quotes.helpers";
import { getProjectById } from "../../projects/services/project.service";
import { statusConfig } from "../../projects/helpers/projects.helpers";
import type { Project } from "../../projects/types/projects.types";
import { useEffect } from "react";

const QuotePage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const { materials, loading, handleAdd, handleUpdate, handleDelete } =
    useProjectMaterials(projectId!);
  const { materials: contractorMaterials } = useContractorMaterials();

  useEffect(() => {
    getProjectById(projectId!)
      .then(setProject)
      .finally(() => setProjectLoading(false));
  }, [projectId]);

  const grandTotal = calcGrandTotal(materials);
  const status = project ? statusConfig[project.status] : null;

  if (projectLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/quotes")}
            sx={{ color: "grey.400" }}
          >
            הצעות מחיר
          </Button>
          <Typography variant="h5" fontWeight="bold" color="white">
            {project?.name ?? ""}
          </Typography>
          {status && (
            <Chip
              label={status.label}
              size="small"
              sx={{
                backgroundColor: `${status.color}22`,
                color: status.color,
                border: `1px solid ${status.color}66`,
                fontWeight: "bold",
              }}
            />
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
        >
          הוסף חומר
        </Button>
      </Box>

      {/* Table */}
      <QuoteMaterialsTable
        materials={materials}
        loading={loading}
        onUpdate={(id, quantity, notes) => handleUpdate(id, { quantity, notes: notes || undefined })}
        onDelete={handleDelete}
      />

      {/* Total */}
      {materials.length > 0 && (
        <>
          <Divider sx={{ borderColor: "rgba(255,107,0,0.2)", my: 3 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{
              backgroundColor: "#1E1E1E",
              border: "1px solid rgba(255,107,0,0.3)",
              borderRadius: 2,
              px: 4,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}>
              <Typography color="grey.400">סה"כ הצעת מחיר</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {formatCurrency(grandTotal)}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      <AddProjectMaterialModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
        contractorMaterials={contractorMaterials}
      />
    </Box>
  );
};

export default QuotePage;
