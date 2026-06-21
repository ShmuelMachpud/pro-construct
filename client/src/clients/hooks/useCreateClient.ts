import { useState } from "react";
import { useForm } from "../../global/hooks/useForm";
import { createClient } from "../services/client.service";
import { createClientInitialData, createClientSchema, type CreateClientFormType } from "../helpers/createClient.helpers";
import { getServerError } from "../../global/utils/getServerError";
import type { ClientType } from "../types/clients.types";

export const useCreateClient = (onCreated: () => void, onClose: () => void) => {
  const form = useForm<CreateClientFormType>(createClientInitialData, createClientSchema);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async () => {
    if (!form.validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await createClient({
        type: form.values.type as ClientType,
        name: form.values.name,
        phone: form.values.phone,
        email: form.values.email,
        address: form.values.address,
        billingName: form.values.billingName || undefined,
        billingPhone: form.values.billingPhone || undefined,
        billingAddress: form.values.billingAddress || undefined,
      });
      form.reset();
      onCreated();
      onClose();
    } catch (err: unknown) {
      setServerError(getServerError(err) ?? "שגיאה ביצירת הלקוח, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setServerError("");
    onClose();
  };

  return { ...form, loading, serverError, handleSubmit, handleClose };
};
