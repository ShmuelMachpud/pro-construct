import {
  findPriceQuoteByIdDal,
  updatePriceQuoteByIdDal,
} from "../dal/price_quotes.dal";
import { UpdatePriceQuoteInternalDto } from "../types/price_quotes.types";
import { findAllQuoteItemsDal } from "../../quote_items/dal/quote_items.dal";
import { findProjectByIdDal } from "../../projects/dal/projects.dal";
import { generateQuotePdf } from "../../helpers/generateQuotePdf";
import {
  uploadPdfToStorage,
  deletePdfFromStorage,
} from "../../helpers/supabaseStorage";
import { logger } from "../../utils/logger";

// Background pipeline that rebuilds the quote PDF after every change.
// Runs fire-and-forget: failures are logged but never break the API flow.
export const regenerateQuotePdf = async (
  quoteId: number,
  projectId: string,
): Promise<void> => {
  try {
    // Fetch the quote, its items and the parent project concurrently
    const [quote, items, project] = await Promise.all([
      findPriceQuoteByIdDal(quoteId, projectId),
      findAllQuoteItemsDal(quoteId),
      findProjectByIdDal(projectId),
    ]);
    if (!quote || !project) return;

    // Remove the previous PDF from cloud storage (non-blocking cleanup)
    if (quote.pdfUrl)
      deletePdfFromStorage(quote.pdfUrl).catch((err) =>
        logger.warn(`Failed to delete old PDF: ${err}`),
      );

    // Render a fresh PDF, upload it, and store the public URL on the quote.
    // Timestamp in the file name guarantees uniqueness and cache-busting
    const buffer = await generateQuotePdf(quote, items, project.name);
    const fileName = `quote_${quoteId}_${projectId}_${Date.now()}.pdf`;
    const pdfUrl = await uploadPdfToStorage(buffer, fileName);
    await updatePriceQuoteByIdDal(quoteId, projectId, { pdfUrl });
  } catch (err) {
    logger.error(`Failed to regenerate PDF for quote ${quoteId}: ${err}`);
  }
};
