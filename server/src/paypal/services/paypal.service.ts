import axios from "axios";
import { ENV_PAYPAL } from "../../config/environments";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
const { BASE_URL, CLIENT_ID, CLIENT_SECRET, MONTHLY_PLAN_ID, YEARLY_PLAN_ID, RETURN_URL, CANCEL_URL } = ENV_PAYPAL;

const getAccessTokenService = async (): Promise<string> => {
  try {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) return cachedToken;

    const response = await axios.post(
      `${BASE_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: { username: CLIENT_ID, password: CLIENT_SECRET },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

    return cachedToken!;
  } catch (error) {
    cachedToken = null;
    tokenExpiry = null;
    return Promise.reject(error);
  }
};

const resolvePlanId = (interval: string): string =>
  interval === "MONTH" ? MONTHLY_PLAN_ID : YEARLY_PLAN_ID;

export const createSubscriptionService = async (
  interval: string,
): Promise<{ subscriptionId: string; approvalUrl: string }> => {
  try {
    const accessToken = await getAccessTokenService();
    const planId = resolvePlanId(interval);

    const response = await axios.post(
      `${BASE_URL}/v1/billing/subscriptions`,
      {
        plan_id: planId,
        application_context: {
          return_url: RETURN_URL,
          cancel_url: CANCEL_URL,
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
  } catch (error) {
    return Promise.reject(error);
  }
};
