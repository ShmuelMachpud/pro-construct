import {
  Box, Typography, Chip, Button, Grid, Card, CardContent, CircularProgress, Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FolderIcon from "@mui/icons-material/Folder";
import { useParams, useNavigate } from "react-router-dom";
import { useClientPage } from "../hooks/useClientPage";
import { statusConfig, typeLabels } from "../../projects/helpers/projects.helpers";

const ClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, projects, loading, error } = useClientPage(id!);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;
  if (!client) return <Typography color="error" sx={{ mt: 4 }}>{error || "לקוח לא נמצא"}</Typography>;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/clients")} sx={{ color: "grey.400" }}>
          לקוחות
        </Button>
        {client.type === "business"
          ? <BusinessIcon sx={{ color: "primary.main", fontSize: 28 }} />
          : <PersonIcon sx={{ color: "primary.main", fontSize: 28 }} />
        }
        <Typography variant="h5" fontWeight="bold" color="white">{client.name}</Typography>
        <Chip
          label={client.type === "private" ? "פרטי" : "עסקי"}
          size="small"
          sx={{
            backgroundColor: "rgba(255,107,0,0.1)",
            color: "primary.main",
            border: "1px solid rgba(255,107,0,0.3)",
            fontWeight: "bold",
          }}
        />
      </Box>

      {/* Contact info */}
      <Box sx={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 3, p: 3, maxWidth: 700, mb: 5 }}>
        <Typography fontWeight="bold" color="grey.300" mb={2}>פרטי קשר</Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon sx={{ color: "grey.500", fontSize: 18 }} />
              <Box>
                <Typography color="grey.600" fontSize="0.72rem">טלפון</Typography>
                <Typography color="white" fontSize="0.9rem">{client.phone}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon sx={{ color: "grey.500", fontSize: 18 }} />
              <Box>
                <Typography color="grey.600" fontSize="0.72rem">אימייל</Typography>
                <Typography color="white" fontSize="0.9rem">{client.email}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon sx={{ color: "grey.500", fontSize: 18 }} />
              <Box>
                <Typography color="grey.600" fontSize="0.72rem">כתובת</Typography>
                <Typography color="white" fontSize="0.9rem">{client.address}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {(client.billingName || client.billingPhone || client.billingAddress) && (
          <>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", my: 2 }} />
            <Typography fontWeight="bold" color="grey.300" mb={2}>פרטי חיוב</Typography>
            <Grid container spacing={2}>
              {client.billingName && (
                <Grid size={6}>
                  <Typography color="grey.600" fontSize="0.72rem">שם לחיוב</Typography>
                  <Typography color="white" fontSize="0.9rem">{client.billingName}</Typography>
                </Grid>
              )}
              {client.billingPhone && (
                <Grid size={6}>
                  <Typography color="grey.600" fontSize="0.72rem">טלפון לחיוב</Typography>
                  <Typography color="white" fontSize="0.9rem">{client.billingPhone}</Typography>
                </Grid>
              )}
              {client.billingAddress && (
                <Grid size={12}>
                  <Typography color="grey.600" fontSize="0.72rem">כתובת לחיוב</Typography>
                  <Typography color="white" fontSize="0.9rem">{client.billingAddress}</Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Box>

      {/* Projects */}
      <Typography variant="h6" fontWeight="bold" color="white" mb={3}>
        פרויקטים ({projects.length})
      </Typography>

      {projects.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4, color: "grey.600" }}>
          <FolderIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography>אין פרויקטים ללקוח זה עדיין</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                <Card
                  onClick={() => navigate(`/projects/${project.id}`)}
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
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <FolderIcon sx={{ color: "primary.main", fontSize: 20 }} />
                        <Typography fontWeight="bold" color="white" fontSize="0.95rem">{project.name}</Typography>
                      </Box>
                      <Chip
                        label={status?.label ?? project.status}
                        size="small"
                        sx={{
                          backgroundColor: `${status?.color}22`,
                          color: status?.color,
                          fontWeight: "bold",
                          border: `1px solid ${status?.color}66`,
                        }}
                      />
                    </Box>
                    <Typography color="grey.500" fontSize="0.82rem" mb={1}>{typeLabels[project.type] ?? project.type}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <LocationOnIcon sx={{ color: "grey.500", fontSize: 15 }} />
                      <Typography color="grey.400" fontSize="0.82rem">{project.location}</Typography>
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

export default ClientPage;
