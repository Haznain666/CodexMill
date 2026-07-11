import type { APIRoute } from "astro";
import { submitDiscoveryForm } from "../../components/discovery/submit"; // adjust to your actual submit.ts path
import { bookAppointment } from "../../lib/ghlCalendar";

export const prerender = false; // must be server-rendered — this is what makes it an API route

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    const { success, contactId } = await submitDiscoveryForm(payload);

    let appointmentBooked = false;
    if (success && contactId && typeof payload.selectedCallSlot === "string" && payload.selectedCallSlot) {
      const fullName = String(payload.firstName || "").trim();
      const result = await bookAppointment({
        contactId,
        startTime: payload.selectedCallSlot,
        title: fullName ? `Free Strategy Call — ${fullName}` : "Free Strategy Call",
      });
      appointmentBooked = result.success;
    }

    return new Response(JSON.stringify({ success, appointmentBooked }), {
      status: success ? 200 : 502,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-discovery API route error:", err);
    return new Response(JSON.stringify({ success: false, error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
