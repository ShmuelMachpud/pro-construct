import axios from "axios";
import { ENV_PAYPAL } from "../../config/environments";

const {
  BASE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  MONTHLY_PLAN_ID,
  YEARLY_PLAN_ID,
  RETURN_URL,
  CANCEL_URL,
} = ENV_PAYPAL;

// Module-level cache for the PayPal OAuth access token.
// PayPal tokens are valid for ~9 hours; caching avoids an extra
// network round-trip on every subscription request.
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

const getAccessTokenService = async (): Promise<string> => {
  try {
    // Reuse the cached token as long as it has not expired
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry)
      return cachedToken;

    // OAuth 2.0 client-credentials flow: CLIENT_ID + CLIENT_SECRET
    // are sent via HTTP Basic Auth, never hard-coded (env vars only)
    const response = await axios.post(
      `${BASE_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: { username: CLIENT_ID, password: CLIENT_SECRET },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    cachedToken = response.data.access_token;
    // Refresh 60 seconds BEFORE the real expiry as a safety margin
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return cachedToken!;
  } catch (error) {
    // On failure, clear the cache so the next call retries a fresh login
    cachedToken = null;
    tokenExpiry = null;
    return Promise.reject(error);
  }
};

// Maps the requested billing interval to the matching PayPal plan,
// pre-configured in the PayPal developer dashboard
const resolvePlanId = (interval: string): string =>
  interval === "MONTH" ? MONTHLY_PLAN_ID : YEARLY_PLAN_ID;

export const createSubscriptionService = async (
  interval: string,
): Promise<{ subscriptionId: string; approvalUrl: string }> => {
  try {
    const accessToken = await getAccessTokenService();
    const planId = resolvePlanId(interval);

    // Create the subscription resource on PayPal's side
    const response = await axios.post(
      `${BASE_URL}/v1/billing/subscriptions`,
      {
        plan_id: planId,
        application_context: { return_url: RETURN_URL, cancel_url: CANCEL_URL },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    // PayPal returns a HATEOAS links array; extract the user-approval URL
    const subscriptionId = response.data.id;
    const approvalUrl = response.data.links.find(
      (link: { rel: string; href: string }) => link.rel === "approve",
    )?.href;

    return { subscriptionId, approvalUrl };
  } catch (error) {
    return Promise.reject(error);
  }
};
