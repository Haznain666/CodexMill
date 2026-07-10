export interface DiscoveryPayload {
  [key: string]: unknown;
}

// Server-side only env vars (do NOT prefix with PUBLIC_ — this is a secret).
// Read via process.env, not import.meta.env: Astro/Vite statically inlines
// import.meta.env.X as a literal at build time from whatever .env is present
// on the machine running `astro build`, baking the secret into dist/server as
// plaintext. process.env.X is a genuine runtime lookup, so the value always
// comes from the host's actual process environment when the server runs.
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

const GHL_UPSERT_URL = "https://services.leadconnectorhq.com/contacts/upsert";
const GHL_API_VERSION = "2021-07-28";

const FETCH_TIMEOUT_MS = 8000;

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

async function postToGHL(body: Record<string, unknown>): Promise<Response> {
  const { signal, clear } = withTimeout(FETCH_TIMEOUT_MS);
  try {
    return await fetch(GHL_UPSERT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GHL_API_KEY}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify(body),
      signal,
    });
  } finally {
    clear();
  }
}

function customField(key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  return { key, field_value: value };
}

export async function submitDiscoveryForm(
  payload: DiscoveryPayload
): Promise<boolean> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.error("Missing GHL_API_KEY or GHL_LOCATION_ID env vars");
    return false;
  }

  let callDate = "";
  let callTime = "";
  const callDateTimeISO = payload.selectedCallSlot || null;

  if (payload.selectedCallSlot && typeof payload.selectedCallSlot === "string") {
    const dateObj = new Date(payload.selectedCallSlot);
    if (!isNaN(dateObj.getTime())) {
      callDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      callTime = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  const rec = payload.recommendation as
    | { tierId?: string; tierName?: string; monthly?: number; confidence?: string; reason?: string }
    | undefined;

  const fullName = String(payload.firstName || "").trim();
  const firstName = fullName.split(" ")[0] || "";
  const lastName = fullName.split(" ").slice(1).join(" ") || "";

  const customFields = [
    customField("name", fullName),
    customField("firstname", firstName),
    customField("lastname", lastName),
    customField("email", payload.email),
    customField("phone", payload.phone),
    customField("businessname", payload.businessName),
    customField("industry", payload.industry),
    customField("phonecountry", payload.phoneCountry),
    customField("citystate", payload.cityState),
    customField("citycountry", payload.cityCountry),
    customField("contactmethod", payload.contactMethod),
    customField("website", payload.website),
    customField("hosting", payload.hosting),
    customField("crm", Array.isArray(payload.crm) ? payload.crm.join(", ") : payload.crm),
    customField(
      "leadsources",
      Array.isArray(payload.leadSources) ? payload.leadSources.join(", ") : payload.leadSources
    ),
    customField("autotext", payload.autoText),
    customField("collectreviews", payload.collectReviews),
    customField(
      "challenges",
      Array.isArray(payload.challenges) ? payload.challenges.join(", ") : payload.challenges
    ),
    customField("responsetime", payload.responseTime),
    customField("leadvolume", payload.leadVolume),
    customField("conversion", payload.conversion),
    customField("primarygoal", payload.primaryGoal),
    customField(
      "services",
      Array.isArray(payload.services) ? payload.services.join(", ") : payload.services
    ),
    customField("budget", payload.budget),
    customField("urgency", payload.urgency),
    customField("referralsource", payload.referralSource),
    customField("idealoutcome", payload.idealOutcome),
    customField("triedbefore", payload.triedBefore),
    customField("explorefirst", payload.exploreFirst ? "Yes" : "No"),
    customField("requestedcall", payload.requestedCall ? "Yes" : "No"),
    customField("recommendedtier", rec?.tierName),
    customField("recommendedprice", rec?.monthly),
    customField("recommendationconfidence", rec?.confidence),
    customField("recommendationreason", rec?.reason),
    customField("selectedcallslot", callDateTimeISO),
    customField("calldate", callDate),
    customField("calltime", callTime),
    customField("formstage", payload.formStage),
    customField("captchatoken", payload.captchaToken),
    customField("source", payload.source || "Astro Discovery Form"),
  ].filter(Boolean);

  const body: Record<string, unknown> = {
    locationId: GHL_LOCATION_ID,
    name: fullName || undefined,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email: payload.email || undefined,
    phone: payload.phone || undefined,
    customFields,
  };

  try {
    const res = await postToGHL(body);
    if (!res.ok) throw new Error(`GHL upsert failed: ${res.status} ${await res.text()}`);
    console.log("Lead successfully sent to GHL");
    return true;
  } catch (error) {
    console.error("Error sending lead to GHL (attempt 1):", error);
    try {
      const res2 = await postToGHL(body);
      if (!res2.ok) throw new Error(`GHL upsert failed on retry: ${res2.status}`);
      console.log("Lead successfully sent to GHL on retry");
      return true;
    } catch (error2) {
      console.error("Error sending lead to GHL (retry failed):", error2);
      return false;
    }
  }
}