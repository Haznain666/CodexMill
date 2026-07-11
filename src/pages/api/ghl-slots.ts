import type { APIRoute } from "astro";
import { getFreeSlots } from "../../lib/ghlCalendar";
import { GHL_TIMEZONE } from "../../config/site";

export const prerender = false; // must be server-rendered — this is what makes it an API route

export const GET: APIRoute = async ({ url }) => {
  try {
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    // Always the GHL calendar's own timezone — never the visitor's browser/location,
    // so slots match what's actually booked in GHL no matter where the site is opened from.
    const timezone = GHL_TIMEZONE;

    if (!start || !end) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing start or end date" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T23:59:59`);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid date format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const slots = await getFreeSlots(startDate, endDate, timezone);
    return new Response(JSON.stringify({ success: true, slots }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ghl-slots API route error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Unable to load availability" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
