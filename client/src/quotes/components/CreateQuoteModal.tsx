import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Stepper, Step, StepLabel,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useForm } from "../../global/hooks/useForm";
import { useQuoteItemForm } from "../hooks/useQuoteItemForm";
import { createQuoteInitialData, createQuoteSchema, type CreateQuoteFormType } from "../helpers/createQuote.helpers";
import { getProjects } from "../../projects/services/project.service";
import { addQuoteItem } from "../services/quotes.service";
import { useContractorMaterials } from "../../materials/hooks/useContractorMaterials";
import { getServerError } from "../../global/utils/getServerError";
import { QuoteDetailsStep } from "./QuoteDetailsStep";
import { QuoteItemsStep } from "./QuoteItemsStep";
import type { Project } from "../../projects/types/projects.types";
import type { CreatePriceQuoteDto, PriceQuote } from "../types/quotes.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (projectId: string, dto: CreatePriceQuoteDto) => Promise<PriceQuote>;
  fixedProjectId?: string;
}

interface AddedItem { tempId: number; description: string; quantity: number; unitPrice: number }

export const CreateQuoteModal = ({ open, onClose, onSave, fixedProjectId }: Props) => {
  const quoteForm = useForm<CreateQuoteFormType>(createQuoteInitialData, createQuoteSchema(!fixedProjectId));
  const { materials: contractorMaterials } = useContractorMaterials();
  const itemForm = useQuoteItemForm(contractorMaterials);

  const [step, setStep] = useState(0);
  const [createdQuote, setCreatedQuote] = useState<PriceQuote | null>(null);
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [itemError, setItemError] = useState("");

  useEffect(() => {
    if (!open) {
      setStep(0);
      quoteForm.reset();
      itemForm.reset();
      setAddedItems([]);
      setCreatedQuote(null);
      setServerError("");
      setItemError("");
      return;
    }
    if (!fixedProjectId) {
      setProjectsLoading(true);
      getProjects().then(setProjects).finally(() => setProjectsLoading(false));
    }
  }, [open]);

  const handleNextStep = async () => {
    if (!quoteForm.validate()) return;
    const projectId = fixedProjectId ?? quoteForm.values.projectId;
    setLoading(true);
    setServerError("");
    try {
      const quote = await onSave(projectId, {
        title: quoteForm.values.title.trim(),
        validUntil: quoteForm.values.validUntil || undefined,
        notes: quoteForm.values.notes.trim() || undefined,
      });
      setCreatedQuote(quote);
      setStep(1);
    } catch (err: unknown) {
      setServerError(getServerError(err) ?? "שגיאה ביצירה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!itemForm.validate()) return;
    const projectId = fixedProjectId ?? quoteForm.values.projectId;
    setItemLoading(true);
    setItemError("");
    try {
      const dto = itemForm.buildDto();
      await addQuoteItem(projectId, createdQuote!.id, dto);
      setAddedItems((prev) => [...prev, { tempId: Date.now(), description: dto.description, quantity: dto.quantity, unitPrice: dto.unitPrice }]);
      itemForm.reset();
    } catch (err: unknown) {
      setItemError(getServerError(err) ?? "שגיאה בהוספת פריט");
    } finally {
      setItemLoading(false);
    }
  };

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
          <QuoteDetailsStep
            form={quoteForm}
            projects={projects}
            projectsLoading={projectsLoading}
            fixedProjectId={fixedProjectId}
            serverError={serverError}
          />
        )}
        {step === 1 && (
          <QuoteItemsStep
            itemForm={itemForm}
            contractorMaterials={contractorMaterials}
            addedItems={addedItems}
            itemError={itemError}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {step === 0 && (
          <>
            <Button onClick={onClose} color="inherit">ביטול</Button>
            <Button variant="contained" onClick={handleNextStep} disabled={loading || !quoteForm.isValid}>
              {loading ? "יוצר..." : "הבא — הוסף פריטים"}
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <Button onClick={onClose} color="inherit" sx={{ mr: "auto" }}>סיום</Button>
            <Button variant="outlined" onClick={handleAddItem} disabled={itemLoading || !itemForm.isValid}>
              {itemLoading ? "מוסיף..." : "הוסף פריט"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
