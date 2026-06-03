import { Box, Typography, Card, CardContent, Grid, Chip, CircularProgress } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";
import { useQuotesList } from "../hooks/useQuotesList";
import { statusConfig } from "../../projects/helpers/projects.helpers";

const QuotesPage = () => {
  const navigate = useNavigate();
  const { projects, loading, error } = useQuotesList();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="white" mb={4}>
        הצעות מחיר
      </Typography>

      {projects.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10, color: "grey.600" }}>
          <ReceiptLongIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography>אין פרויקטים עדיין.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                <Card
                  onClick={() => navigate(`/quotes/${project.id}`)}
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
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography fontWeight="bold" color="white" fontSize="1rem">
                        {project.name}
                      </Typography>
                      <Chip
                        label={status?.label ?? project.status}
                        size="small"
                        sx={{
                          backgroundColor: `${status?.color}22`,
                          color: status?.color,
                          border: `1px solid ${status?.color}66`,
                          fontWeight: "bold",
                        }}
                      />
                    </Box>

                    <Typography color="grey.500" fontSize="0.85rem" mb={2}>
                      {project.location}
                    </Typography>

                    <Box sx={{
                      mt: "auto",
                      pt: 2,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <Typography color="grey.600" fontSize="0.75rem">הצעות מחיר</Typography>
                      <Typography fontWeight="bold" fontSize="1.1rem" color={project.quoteCount > 0 ? "#FF6B00" : "grey.600"}>
                        {project.quoteCount > 0 ? project.quoteCount : "—"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default QuotesPage;
