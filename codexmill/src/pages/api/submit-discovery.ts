import type { APIRoute } from "astro";
import { submitDiscoveryForm } from "../../components/discovery/submit"; // adjust to your actual submit.ts path
 
export const prerender = false; // must be server-rendered — this is what makes it an API route
 
export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    const success = await submitDiscoveryForm(payload);
 
    return new Response(JSON.stringify({ success }), {
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
 