import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Chip, CircularProgress, Card, CardContent, Grid, IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import { useQuotes } from "../hooks/useQuotes";
import CreateQuoteModal from "../components/CreateQuoteModal";
import { quoteStatusConfig } from "../helpers/quotes.helpers";
import { getProjectById } from "../../projects/services/project.service";
import { statusConfig } from "../../projects/helpers/projects.helpers";
import type { Project } from "../../projects/types/projects.types";

const QuotePage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const { quotes, loading, handleCreate, handleDelete } = useQuotes(projectId!);

  useEffect(() => {
    getProjectById(projectId!)
      .then(setProject)
      .finally(() => setProjectLoading(false));
  }, [projectId]);

  const projectStatus = project ? statusConfig[project.status] : null;

  if (projectLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <Box>
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
          {projectStatus && (
            <Chip
              label={projectStatus.label}
              size="small"
              sx={{
                backgroundColor: `${projectStatus.color}22`,
                color: projectStatus.color,
                border: `1px solid ${projectStatus.color}66`,
                fontWeight: "bold",
              }}
            />
          )}
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          צור הצעה
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress sx={{ color: "primary.main" }} />
        </Box>
      ) : quotes.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10, color: "grey.600" }}>
          <Typography>אין הצעות מחיר לפרויקט זה עדיין.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {quotes.map((quote) => {
            const status = quoteStatusConfig[quote.status];
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={quote.id}>
                <Card
                  onClick={() => navigate(`/quotes/${projectId}/${quote.id}`)}
                  sx={{
                    backgroundColor: "#1E1E1E",
                    border: "1px solid rgba(255,107,0,0.15)",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      border: "1px solid rgba(255,107,0,0.5)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(255,107,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Typography fontWeight="bold" color="white" fontSize="1rem">
                        {quote.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleDelete(quote.id); }}
                          sx={{ color: "grey.600", "&:hover": { color: "error.main" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    {quote.validUntil && (
                      <Typography color="grey.500" fontSize="0.8rem">
                        תוקף עד: {new Date(quote.validUntil).toLocaleDateString("he-IL")}
                      </Typography>
                    )}
                    {quote.notes && (
                      <Typography color="grey.600" fontSize="0.8rem" mt={0.5} noWrap>
                        {quote.notes}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <CreateQuoteModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />
    </Box>
  );
};

export default QuotePage;
