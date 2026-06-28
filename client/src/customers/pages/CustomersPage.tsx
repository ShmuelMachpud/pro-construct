import { useEffect, useState } from "react";
import {
  Box, Button, Typography, Card, CardContent, Grid, Chip, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import type { Customer } from "../types/customers.types";
import { getCustomers } from "../services/customer.service";
import { CreateCustomerModal } from "../components/CreateCustomerModal";
import { useAuth } from "../../global/hooks/useAuth";

const CustomersPage = () => {
  const { isContractor } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const load = () => {
    setLoading(true);
    getCustomers().then(setCustomers).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="white">לקוחות</Typography>
        {isContractor && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
            לקוח חדש
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : customers.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10, color: "grey.600" }}>
          <PersonIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography>אין לקוחות עדיין. הוסף לקוח חדש להתחיל.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {customers.map((customer) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={customer.id}>
              <Card
                onClick={() => navigate(`/customers/${customer.id}`)}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {customer.type === "business"
                        ? <BusinessIcon sx={{ color: "primary.main", fontSize: 22 }} />
                        : <PersonIcon sx={{ color: "primary.main", fontSize: 22 }} />
                      }
                      <Typography fontWeight="bold" color="white" fontSize="1rem">{customer.name}</Typography>
                    </Box>
                    <Chip
                      label={customer.type === "private" ? "פרטי" : "עסקי"}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,107,0,0.1)",
                        color: "primary.main",
                        border: "1px solid rgba(255,107,0,0.3)",
                        fontWeight: "bold",
                      }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon sx={{ color: "grey.500", fontSize: 16 }} />
                      <Typography color="grey.400" fontSize="0.85rem">{customer.phone}</Typography>
                    </Box>
                    {customer.email && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EmailIcon sx={{ color: "grey.500", fontSize: 16 }} />
                        <Typography color="grey.400" fontSize="0.85rem">{customer.email}</Typography>
                      </Box>
                    )}
                    {customer.address && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOnIcon sx={{ color: "grey.500", fontSize: 16 }} />
                        <Typography color="grey.400" fontSize="0.85rem">{customer.address}</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {isContractor && (
        <CreateCustomerModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onCreated={load}
        />
      )}
    </Box>
  );
};

export default CustomersPage;
