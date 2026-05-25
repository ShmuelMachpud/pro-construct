import Joi from "joi";
import type { PaymentFormType } from "../types/payment.types";

export const paymentInitialData: PaymentFormType = {
  cardNumber: "",
  cardHolder: "",
  expiry: "",
  cvv: "",
};

export const paymentSchema = Joi.object<PaymentFormType>({
  cardNumber: Joi.string().pattern(/^[\d ]{19}$/).required().messages({
    "string.empty": "מספר כרטיס הוא שדה חובה",
    "string.pattern.base": "מספר כרטיס לא תקין",
    "any.required": "מספר כרטיס הוא שדה חובה",
  }),
  cardHolder: Joi.string().min(2).required().messages({
    "string.empty": "שם בעל הכרטיס הוא שדה חובה",
    "string.min": "שם קצר מדי",
    "any.required": "שם בעל הכרטיס הוא שדה חובה",
  }),
  expiry: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).required().messages({
    "string.empty": "תאריך תפוגה הוא שדה חובה",
    "string.pattern.base": "תאריך תפוגה לא תקין",
    "any.required": "תאריך תפוגה הוא שדה חובה",
  }),
  cvv: Joi.string().min(3).max(4).pattern(/^\d+$/).required().messages({
    "string.empty": "CVV הוא שדה חובה",
    "string.min": "CVV לא תקין",
    "any.required": "CVV הוא שדה חובה",
  }),
});

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};
