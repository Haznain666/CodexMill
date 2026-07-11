// Server-side only — GoHighLevel Calendar API (free slots + appointment booking).
// Read via process.env, not import.meta.env: see comment in ../components/discovery/submit.ts
// for why (Vite would otherwise inline these secrets into the built server bundle).
const GHL_CALENDAR_KEY = process.env.GHL_CALENDAR_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const CALENDAR_ID = process.env.CALENDAR_ID;

const GHL_BASE_URL = "https://services.leadconnectorhq.com";
// The Calendars resource group (free-slots) and the Appointments resource group
// are versioned independently in GHL's v2 API — confirmed against GHL's own
// free-slots sample code and docs. If GHL changes these, update only here.
const FREE_SLOTS_API_VERSION = "2021-04-15";
const APPOINTMENTS_API_VERSION = "2021-07-28";

const FETCH_TIMEOUT_MS = 8000;

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

export interface FreeSlotsByDate {
  [date: string]: string[]; // ISO 8601 datetime strings, keyed by "YYYY-MM-DD"
}

/**
 * Fetch real available booking slots for the configured calendar between
 * startDate and endDate (inclusive), in the given IANA timezone.
 */
export async function getFreeSlots(
  startDate: Date,
  endDate: Date,
  timezone: string
): Promise<FreeSlotsByDate> {
  if (!GHL_CALENDAR_KEY || !CALENDAR_ID) {
    throw new Error("Missing GHL_CALENDAR_KEY or CALENDAR_ID env vars");
  }

  const params = new URLSearchParams({
    startDate: String(startDate.getTime()),
    endDate: String(endDate.getTime()),
    timezone,
  });

  const { signal, clear } = withTimeout(FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(
      `${GHL_BASE_URL}/calendars/${CALENDAR_ID}/free-slots?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${GHL_CALENDAR_KEY}`,
          Version: FREE_SLOTS_API_VERSION,
        },
        signal,
      }
    );
    if (!res.ok) {
      throw new Error(`GHL free-slots failed: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    const result: FreeSlotsByDate = {};
    for (const [key, value] of Object.entries(data ?? {})) {
      if (value && typeof value === "object" && Array.isArray((value as any).slots)) {
        result[key] = (value as any).slots;
      }
    }
    return result;
  } finally {
    clear();
  }
}

export interface BookAppointmentInput {
  contactId: string;
  /** ISO 8601 datetime string, as returned by getFreeSlots. */
  startTime: string;
  title?: string;
}

export interface BookAppointmentResult {
  success: boolean;
  appointmentId?: string;
}

/**
 * Create an appointment on the configured calendar for an existing contact.
 * Best-effort: failures are logged and returned as { success: false } rather
 * than thrown, since appointment booking should not take down lead capture.
 */
export async function bookAppointment(
  input: BookAppointmentInput
): Promise<BookAppointmentResult> {
  if (!GHL_CALENDAR_KEY || !GHL_LOCATION_ID || !CALENDAR_ID) {
    console.error("Missing GHL_CALENDAR_KEY, GHL_LOCATION_ID, or CALENDAR_ID env vars");
    return { success: false };
  }

  const body = {
    calendarId: CALENDAR_ID,
    locationId: GHL_LOCATION_ID,
    contactId: input.contactId,
    startTime: input.startTime,
    title: input.title || "Free Strategy Call",
    appointmentStatus: "confirmed",
  };

  const { signal, clear } = withTimeout(FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${GHL_BASE_URL}/calendars/events/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GHL_CALENDAR_KEY}`,
        Version: APPOINTMENTS_API_VERSION,
      },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      throw new Error(`GHL create-appointment failed: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    return { success: true, appointmentId: data?.id };
  } catch (error) {
    console.error("Error booking GHL appointment:", error);
    return { success: false };
  } finally {
    clear();
  }
}
