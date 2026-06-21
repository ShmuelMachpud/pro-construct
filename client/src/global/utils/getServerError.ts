export const getServerError = (err: unknown): string | undefined =>
  (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
