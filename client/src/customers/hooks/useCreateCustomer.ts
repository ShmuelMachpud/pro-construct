import { useState } from "react";
import { useForm } from "../../global/hooks/useForm";
import { createCustomer } from "../services/customer.service";
import {
  createCustomerInitialData,
  createCustomerSchema,
  type CreateCustomerFormType,
} from "../helpers/createCustomer.helpers";
import { getServerError } from "../../global/utils/getServerError";
import type { CustomerType } from "../types/customers.types";

export const useCreateCustomer = (
  onCreated: () => void,
  onClose: () => void,
) => {
  const form = useForm<CreateCustomerFormType>(
    createCustomerInitialData,
    createCustomerSchema,
  );
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async () => {
    if (!form.validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await createCustomer({
        type: form.values.type as CustomerType,
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
