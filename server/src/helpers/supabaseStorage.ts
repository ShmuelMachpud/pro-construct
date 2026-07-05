import { createClient } from "@supabase/supabase-js";
import { ENV } from "../config/environments";

const BUCKET = "quotes";

const getClient = () =>
  createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);

// Uploads the generated PDF buffer to the "quotes" bucket in Supabase
// Storage and returns a public URL that is saved on the quote record
export const uploadPdfToStorage = async (
  buffer: Buffer,
  fileName: string,
): Promise<string> => {
  try {
    const supabase = getClient();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: false, // never overwrite an existing file
      });
    if (error) return Promise.reject(error);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deletePdfFromStorage = async (pdfUrl: string): Promise<void> => {
  try {
    const supabase = getClient();
    const fileName = pdfUrl.split(`/${BUCKET}/`)[1];
    if (!fileName) return;
    await supabase.storage.from(BUCKET).remove([fileName]);
  } catch (error) {
    return Promise.reject(error);
  }
};
