import {
  Box, Typography, Chip, Button, Grid, Card, CardContent, CircularProgress,
  Divider, Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FolderIcon from "@mui/icons-material/Folder";
import InventoryIcon from "@mui/icons-material/Inventory";
import DescriptionIcon from "@mui/icons-material/Description";
import { useParams, useNavigate } from "react-router-dom";
import { useContractorDetail } from "../hooks/useContractorDetail";
import { subscriptionLabel, subscriptionColor, formatDate } from "../../users/helpers/users.helpers";
import { statusConfig } from "../../projects/helpers/projects.helpers";

const quoteStatusLabel: Record<string, string> = {
  DRAFT: "טיוטה",
  SENT: "נשלחה",
  APPROVED: "אושרה",
  REJECTED: "נדחתה",
  EXPIRED: "פגה",
};

const quoteStatusColor: Record<string, string> = {
  DRAFT: "#9E9E9E",
  SENT: "#2196F3",
  APPROVED: "#4CAF50",
  REJECTED: "#F44336",
  EXPIRED: "#FF9800",
};

const ContractorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useContractorDetail(id!);
  const { contractor, projects, clients, materials, quotes } = data;

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;
  if (!contractor) return <Typography color="error" sx={{ mt: 4 }}>{error || "קבלן לא נמצא"}</Typography>;

  const isApproved = contractor.isApproved;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard")} sx={{ color: "grey.400" }}>
          דשבורד
        </Button>
        <PersonIcon sx={{ color: "primary.main", fontSize: 28 }} />
        <Typography variant="h5" fontWeight="bold" color="white">{contractor.name}</Typography>
        <Chip
          label={isApproved ? "מאושר" : "ממתין"}
          size="small"
          sx={{
            backgroundColor: isApproved ? "rgba(76,175,80,0.15)" : "rgba(255,107,0,0.15)",
            color: isApproved ? "#4CAF50" : "#FF6B00",
            fontWeight: "bold",
          }}
        />
        {contractor.subscriptionStatus && (
          <Chip
            label={subscriptionLabel[contractor.subscriptionStatus]}
            size="small"
            sx={{
              backgroundColor: `${subscriptionColor[contractor.subscriptionStatus]}22`,
              color: subscriptionColor[contractor.subscriptionStatus],
            }}
          />
        )}
      </Box>

      {/* Contractor info */}
      <Box sx={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 3, p: 3, maxWidth: 700, mb: 5 }}>
        <Typography fontWeight="bold" color="grey.300" mb={2}>פרטי קבלן</Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon sx={{ color: "grey.500", fontSize: 18 }} />
              <Box>
                <Typography color="grey.600" fontSize="0.72rem">אימייל</Typography>
                <Typography color="white" fontSize="0.9rem">{contractor.email}</Typography>
              </Box>
            </Box>
          </Grid>
          {contractor.phone && (
            <Grid size={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ color: "grey.500", fontSize: 18 }} />
                <Box>
                  <Typography color="grey.600" fontSize="0.72rem">טלפון</Typography>
                  <Typography color="white" fontSize="0.9rem">{contractor.phone}</Typography>
                </Box>
              </Box>
            </Grid>
          )}
          {contractor.companyName && (
            <Grid size={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BusinessIcon sx={{ color: "grey.500", fontSize: 18 }} />
                <Box>
                  <Typography color="grey.600" fontSize="0.72rem">חברה</Typography>
                  <Typography color="white" fontSize="0.9rem">{contractor.companyName}</Typography>
                </Box>
              </Box>
            </Grid>
          )}
          <Grid size={6}>
            <Typography color="grey.600" fontSize="0.72rem">הצטרף</Typography>
            <Typography color="white" fontSize="0.9rem">{formatDate(contractor.createdAt)}</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Stats row */}
      <Box sx={{ display: "flex", gap: 3, mb: 5 }}>
        {[
          { label: "פרויקטים", value: projects.length },
          { label: "לקוחות", value: clients.length },
          { label: "חומרים", value: materials.length },
          { label: "הצעות מחיר", value: quotes.length },
        ].map(({ label, value }) => (
          <Paper key={label} sx={{ flex: 1, p: 2, backgroundColor: "#1A1A1A", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main">{value}</Typography>
            <Typography color="grey.400" fontSize="0.85rem" mt={0.5}>{label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Projects */}
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        <FolderIcon sx={{ mr: 1, fontSize: 20, verticalAlign: "middle", color: "primary.main" }} />
        פרויקטים ({projects.length})
      </Typography>
      {projects.length === 0 ? (
        <Typography color="grey.600" mb={4}>אין פרויקטים</Typography>
      ) : (
        <Grid container spacing={2} mb={5}>
          {projects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                <Card sx={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography fontWeight="bold" color="white" fontSize="0.9rem">{project.name}</Typography>
                      <Chip
                        label={status?.label ?? project.status}
                        size="small"
                        sx={{ backgroundColor: `${status?.color}22`, color: status?.color, border: `1px solid ${status?.color}66` }}
                      />
                    </Box>
                    <Typography color="grey.500" fontSize="0.8rem">{project.location}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 4 }} />

      {/* Clients */}
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        <PersonIcon sx={{ mr: 1, fontSize: 20, verticalAlign: "middle", color: "primary.main" }} />
        לקוחות ({clients.length})
      </Typography>
      {clients.length === 0 ? (
        <Typography color="grey.600" mb={4}>אין לקוחות</Typography>
      ) : (
        <Grid container spacing={2} mb={5}>
          {clients.map((client) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={client.id}>
              <Card sx={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography fontWeight="bold" color="white" fontSize="0.9rem">{client.name}</Typography>
                    <Chip
                      label={client.type === "private" ? "פרטי" : "עסקי"}
                      size="small"
                      sx={{ backgroundColor: "rgba(255,107,0,0.1)", color: "primary.main", border: "1px solid rgba(255,107,0,0.3)" }}
                    />
                  </Box>
                  <Typography color="grey.500" fontSize="0.8rem">{client.phone}</Typography>
                  {client.email && <Typography color="grey.500" fontSize="0.8rem">{client.email}</Typography>}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 4 }} />

      {/* Materials */}
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        <InventoryIcon sx={{ mr: 1, fontSize: 20, verticalAlign: "middle", color: "primary.main" }} />
        חומרים ({materials.length})
      </Typography>
      {materials.length === 0 ? (
        <Typography color="grey.600" mb={4}>אין חומרים</Typography>
      ) : (
        <Grid container spacing={2} mb={5}>
          {materials.map((mat) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={mat.id}>
              <Card sx={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 2 }}>
                <CardContent>
                  <Typography fontWeight="bold" color="white" fontSize="0.9rem">{mat.globalMaterial?.name ?? "—"}</Typography>
                  <Typography color="grey.500" fontSize="0.8rem">{mat.globalMaterial?.category?.name ?? "—"}</Typography>
                  {mat.price != null && (
                    <Typography color="primary.main" fontSize="0.85rem" mt={0.5}>
                      ₪{mat.price} / {mat.globalMaterial?.unit}
                    </Typography>
                  )}
                  {mat.supplier && <Typography color="grey.500" fontSize="0.78rem">{mat.supplier}</Typography>}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 4 }} />

      {/* Quotes */}
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        <DescriptionIcon sx={{ mr: 1, fontSize: 20, verticalAlign: "middle", color: "primary.main" }} />
        הצעות מחיר ({quotes.length})
      </Typography>
      {quotes.length === 0 ? (
        <Typography color="grey.600" mb={4}>אין הצעות מחיר</Typography>
      ) : (
        <Grid container spacing={2} mb={4}>
          {quotes.map((quote) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={quote.id}>
              <Card sx={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography fontWeight="bold" color="white" fontSize="0.9rem">{quote.title}</Typography>
                    <Chip
                      label={quoteStatusLabel[quote.status] ?? quote.status}
                      size="small"
                      sx={{
                        backgroundColor: `${quoteStatusColor[quote.status]}22`,
                        color: quoteStatusColor[quote.status],
                        border: `1px solid ${quoteStatusColor[quote.status]}66`,
                      }}
                    />
                  </Box>
                  <Typography color="grey.500" fontSize="0.8rem">{quote.projectName}</Typography>
                  <Typography color="grey.600" fontSize="0.75rem" mt={0.5}>{formatDate(quote.createdAt)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ContractorPage;
