import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Box, MenuItem, Select,
  FormControl, InputLabel, CircularProgress, Typography,
  Stepper, Step, StepLabel, Divider, Chip,
  ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { getProjects } from "../../projects/services/project.service";
import { addQuoteItem } from "../services/quotes.service";
import { useContractorMaterials } from "../../materials/hooks/useContractorMaterials";
import type { Project } from "../../projects/types/projects.types";
import type { CreatePriceQuoteDto, PriceQuote, QuoteItemType, CreateQuoteItemDto } from "../types/quotes.types";
import { formatCurrency, quoteItemTypeLabel } from "../helpers/quotes.helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (projectId: string, dto: CreatePriceQuoteDto) => Promise<PriceQuote>;
  fixedProjectId?: string;
}

const emptyQuoteForm = { projectId: "", title: "", validUntil: "", notes: "" };
const emptyItemForm = { type: "MATERIAL" as QuoteItemType, contractorMaterialId: 0, description: "", quantity: "", unitPrice: "" };

interface AddedItem extends CreateQuoteItemDto { tempId: number }

const CreateQuoteModal = ({ open, onClose, onSave, fixedProjectId }: Props) => {
  const [step, setStep] = useState(0);
  const [quoteForm, setQuoteForm] = useState(emptyQuoteForm);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);
  const [createdQuote, setCreatedQuote] = useState<PriceQuote | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemError, setItemError] = useState("");

  const { materials: contractorMaterials } = useContractorMaterials();

  useEffect(() => {
    if (!open) {
      setStep(0);
      setQuoteForm(emptyQuoteForm);
      setItemForm(emptyItemForm);
      setAddedItems([]);
      setCreatedQuote(null);
      setError("");
      setItemError("");
      return;
    }
    if (!fixedProjectId) {
      setProjectsLoading(true);
      getProjects().then(setProjects).finally(() => setProjectsLoading(false));
    }
  }, [open, fixedProjectId]);

  const handleQuoteChange = (field: keyof typeof emptyQuoteForm, value: string) =>
    setQuoteForm((prev) => ({ ...prev, [field]: value }));

  const handleItemChange = (field: keyof typeof emptyItemForm, value: string | number) =>
    setItemForm((prev) => ({ ...prev, [field]: value }));

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, value: QuoteItemType | null) => {
    if (value) setItemForm({ ...emptyItemForm, type: value });
  };

  const handleMaterialSelect = (materialId: number) => {
    const mat = contractorMaterials.find((m) => m.id === materialId);
    setItemForm((prev) => ({
      ...prev,
      contractorMaterialId: materialId,
      description: mat ? mat.globalMaterial.name : "",
      unitPrice: mat?.price != null ? String(mat.price) : "",
    }));
  };

  const handleNextStep = async () => {
    const projectId = fixedProjectId ?? quoteForm.projectId;
    if (!projectId) { setError("יש לבחור פרויקט"); return; }
    if (!quoteForm.title.trim()) { setError("יש להזין כותרת להצעה"); return; }
    setLoading(true);
    setError("");
    try {
      const quote = await onSave(projectId, {
        title: quoteForm.title.trim(),
        validUntil: quoteForm.validUntil || undefined,
        notes: quoteForm.notes.trim() || undefined,
      });
      setCreatedQuote(quote);
      setStep(1);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "שגיאה ביצירה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (itemForm.type === "MATERIAL" && !itemForm.contractorMaterialId) {
      setItemError("יש לבחור חומר"); return;
    }
    if (!itemForm.description.trim()) { setItemError("יש להזין תיאור"); return; }
    if (!itemForm.quantity || Number(itemForm.quantity) <= 0) { setItemError("יש להזין כמות תקינה"); return; }
    if (!itemForm.unitPrice || Number(itemForm.unitPrice) < 0) { setItemError("יש להזין מחיר ליחידה"); return; }

    const projectId = fixedProjectId ?? quoteForm.projectId;
    const dto: CreateQuoteItemDto = {
      type: itemForm.type,
      sourceId: itemForm.type === "MATERIAL" ? itemForm.contractorMaterialId : undefined,
      description: itemForm.description.trim(),
      quantity: Number(itemForm.quantity),
      unitPrice: Number(itemForm.unitPrice),
    };

    setItemLoading(true);
    setItemError("");
    try {
      await addQuoteItem(projectId, createdQuote!.id, dto);
      setAddedItems((prev) => [...prev, { ...dto, tempId: Date.now() }]);
      setItemForm(emptyItemForm);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setItemError(msg ?? "שגיאה בהוספת פריט");
    } finally {
      setItemLoading(false);
    }
  };

  const selectedMaterial = contractorMaterials.find((m) => m.id === itemForm.contractorMaterialId);
  const lineTotal = itemForm.quantity && itemForm.unitPrice
    ? Number(itemForm.quantity) * Number(itemForm.unitPrice) : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
        {step === 0
          ? <><ReceiptLongIcon sx={{ color: "primary.main" }} /> צור הצעת מחיר חדשה</>
          : <><PlaylistAddIcon sx={{ color: "primary.main" }} /> הוסף פריטים להצעה</>
        }
      </DialogTitle>

      <Box sx={{ px: 3, pb: 1 }}>
        <Stepper activeStep={step} sx={{ "& .MuiStepLabel-label": { color: "grey.500" }, "& .MuiStepLabel-label.Mui-active": { color: "white" } }}>
          <Step><StepLabel>פרטי הצעה</StepLabel></Step>
          <Step><StepLabel>פריטים</StepLabel></Step>
        </Stepper>
      </Box>

      <DialogContent>
        {step === 0 && (
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {!fixedProjectId && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>פרויקט *</InputLabel>
                  <Select
                    value={quoteForm.projectId}
                    label="פרויקט *"
                    onChange={(e) => handleQuoteChange("projectId", e.target.value)}
                    disabled={projectsLoading}
                    startAdornment={projectsLoading ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
                  >
                    {projects.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <TextField label="כותרת *" fullWidth value={quoteForm.title}
                onChange={(e) => handleQuoteChange("title", e.target.value)} autoFocus />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="תאריך תפוגה" fullWidth type="date" value={quoteForm.validUntil}
                onChange={(e) => handleQuoteChange("validUntil", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="הערות" fullWidth multiline rows={2} value={quoteForm.notes}
                onChange={(e) => handleQuoteChange("notes", e.target.value)} />
            </Grid>
            {error && <Grid size={{ xs: 12 }}><Box sx={{ color: "error.main", fontSize: "0.875rem" }}>{error}</Box></Grid>}
          </Grid>
        )}

        {step === 1 && (
          <Box>
            {addedItems.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography color="grey.500" fontSize="0.8rem" mb={1}>פריטים שנוספו ({addedItems.length})</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {addedItems.map((item) => (
                    <Chip
                      key={item.tempId}
                      label={`${item.description} · ${formatCurrency(item.quantity * item.unitPrice)}`}
                      size="small"
                      sx={{ backgroundColor: "rgba(255,107,0,0.1)", color: "grey.300", border: "1px solid rgba(255,107,0,0.3)" }}
                    />
                  ))}
                </Box>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mt: 2, mb: 1 }} />
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <ToggleButtonGroup value={itemForm.type} exclusive onChange={handleTypeChange} fullWidth size="small">
                  {(["MATERIAL", "LABOR", "OTHER"] as QuoteItemType[]).map((t) => (
                    <ToggleButton key={t} value={t} sx={{ color: "grey.400", "&.Mui-selected": { color: "primary.main", borderColor: "primary.main" } }}>
                      {quoteItemTypeLabel[t]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>

              {itemForm.type === "MATERIAL" && (
                <Grid size={{ xs: 12 }}>
                  <TextField select label="חומר *" fullWidth value={itemForm.contractorMaterialId || ""}
                    onChange={(e) => handleMaterialSelect(Number(e.target.value))}>
                    {contractorMaterials.length === 0 ? (
                      <MenuItem disabled><Typography color="grey.500" fontSize="0.875rem">אין חומרים ברשימה</Typography></MenuItem>
                    ) : contractorMaterials.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        <Box>
                          <Typography fontSize="0.9rem">{m.globalMaterial.name}</Typography>
                          <Typography fontSize="0.75rem" color="grey.500">
                            {m.globalMaterial.category.name} · {m.price != null ? `₪${Number(m.price).toFixed(2)}` : "ללא מחיר"}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              {selectedMaterial && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ p: 1.5, backgroundColor: "rgba(255,107,0,0.06)", borderRadius: 2 }}>
                    <Typography color="grey.400" fontSize="0.8rem">
                      יחידת מידה: <strong style={{ color: "white" }}>{selectedMaterial.globalMaterial.unit}</strong>
                      {selectedMaterial.supplier && <> · ספק: <strong style={{ color: "white" }}>{selectedMaterial.supplier}</strong></>}
                    </Typography>
                  </Box>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <TextField label="תיאור *" fullWidth value={itemForm.description}
                  onChange={(e) => handleItemChange("description", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField label="כמות *" fullWidth type="number" inputProps={{ min: 0.001, step: 0.001 }}
                  value={itemForm.quantity} onChange={(e) => handleItemChange("quantity", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField label="מחיר ליחידה *" fullWidth type="number" inputProps={{ min: 0, step: 0.01 }}
                  value={itemForm.unitPrice} onChange={(e) => handleItemChange("unitPrice", e.target.value)} />
              </Grid>
              {lineTotal !== null && lineTotal > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="grey.400" fontSize="0.875rem">
                    סה"כ שורה: <strong style={{ color: "#FF6B00", fontSize: "1rem" }}>{formatCurrency(lineTotal)}</strong>
                  </Typography>
                </Grid>
              )}
              {itemError && <Grid size={{ xs: 12 }}><Box sx={{ color: "error.main", fontSize: "0.875rem" }}>{itemError}</Box></Grid>}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {step === 0 && (
          <>
            <Button onClick={onClose} color="inherit">ביטול</Button>
            <Button variant="contained" onClick={handleNextStep} disabled={loading}>
              {loading ? "יוצר..." : "הבא — הוסף פריטים"}
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <Button onClick={onClose} color="inherit" sx={{ mr: "auto" }}>סיום</Button>
            <Button variant="outlined" onClick={handleAddItem} disabled={itemLoading}>
              {itemLoading ? "מוסיף..." : "הוסף פריט"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateQuoteModal;
