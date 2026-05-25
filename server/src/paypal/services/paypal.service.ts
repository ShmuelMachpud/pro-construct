import axios from "axios";
import { ENV } from "../../config/environments";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
const { PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = ENV;

const getAccessTokenService = async (): Promise<string> => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

  return cachedToken!;
};

export const createSubscriptionService = async (
  planId: string,
): Promise<{ subscriptionId: string; approvalUrl: string }> => {
  const accessToken = await getAccessTokenService();

  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v1/billing/subscriptions`,
    {
      plan_id: planId,
      application_context: {
        return_url: "http://localhost:3000/subscription/success",
        cancel_url: "http://localhost:3000/subscription/cancel",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  const subscriptionId = response.data.id;
  const approvalUrl = response.data.links.find(
    (link: { rel: string; href: string }) => link.rel === "approve",
  )?.href;

  return { subscriptionId, approvalUrl };
};
