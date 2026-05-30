import axiosInstance from "../../global/services/axiosServer";

export const createSubscription = async (
  interval: "MONTH" | "YEAR",
): Promise<string> => {
  const response = await axiosInstance.post("/paypal/create-subscription", {
    interval,
  });
  return response.data.subscriptionId;
};
