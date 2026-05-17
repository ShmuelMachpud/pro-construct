import type { SubscriptionStatus } from "../types/users.types";

export const roleLabel: Record<string, string> = {
  admin: "מנהל",
  operator: "מפעיל",
  contractor: "קבלן",
};

export const subscriptionLabel: Record<SubscriptionStatus, string> = {
  active: "פעיל",
  trial: "ניסיון",
  inactive: "לא פעיל",
  past_due: "חוב תשלום",
  cancelled: "בוטל",
};

export const subscriptionColor: Record<SubscriptionStatus, string> = {
  active: "#4CAF50",
  trial: "#FF6B00",
  inactive: "#9E9E9E",
  past_due: "#F44336",
  cancelled: "#9E9E9E",
};

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("he-IL");
