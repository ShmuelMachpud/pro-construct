export type LoginFormType = {
  email: string;
  password: string;
};

export type RegisterFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  companyName: string;
  companyId: string;
  address: string;
};

export type PaymentFormType = {
  mockCardNumber: string;
};

export type RegisterPlan = "monthly" | "annual";
