# CLAUDE.md — CodexMill Website Project Brief (v2)

> Single source of truth for the CodexMill marketing website. Read fully before writing any code. Pricing lives in `CodexMill_Pricing.md`; page copy lives in `CodexMill_Copy.md`. If anything conflicts with a later chat instruction, ask before proceeding. Items marked **[CONFIRM]** need Ray's input before publishing.

---

## 1. What we're building

A fast, modern, **graphics-rich multi-page marketing website** for **CodexMill** — a GoHighLevel (GHL) automation + marketing agency. The site's job: turn a business owner into a booked **free automation audit**. Every page drives toward that.

This is a multi-page marketing site (not a blog, app, or store). It must look **premium, bright, and highly polished**, with a **white/light design system** and lots of tasteful animation and visual graphics (device mockups, dashboards, illustrations).

---

## 2. The business (positioning)

- **Brand:** CodexMill (a service of Dispatch Globally LLC)
- **What we do:** Done-for-you automation, websites, and marketing — all built on GoHighLevel
- **Who we serve:** US small businesses across selected industries (see §5 site map)
- **Positioning:** "GHL Automation & Growth Specialists"
- **Master tagline:** **"More Calls. More Jobs. Less Chaos."**
- **Industry sub-taglines** (use on each industry page):
  - Home Services → *More Calls. More Jobs. Less Chaos.*
  - Med Spa → *More Bookings. Fewer No-Shows. Less Chaos.*
  - Pet Grooming → *More Bookings. Happier Clients. Less Chaos.*

---

## 3. Core value proposition (drives all copy)

Small businesses lose money in predictable places: missed calls/inquiries, weak follow-up, no booking system, no reviews, and no reactivation of past customers. CodexMill installs a system — built on GoHighLevel — that **captures every lead, follows up automatically, books the appointment, requests the review, and reactivates old customers**, plus (on higher tiers) runs the ads and marketing that feed it.

**Copy voice:** Owner-to-owner. Plain, confident, outcome-driven. Sell results (more bookings, full calendar, less stress, recurring revenue), not jargon. Keep "GoHighLevel/GHL" mostly to the **GHL page** and **Our Services** pages, where the platform itself is the point. On industry/home pages, lead with outcomes.

---

## 4. Brand identity & design system

### 4.1 Color system — LIGHT / WHITE THEME (primary direction)
**White is the prime color.** The site is bright and airy, with navy reserved for text and occasional dark "feature" bands, and orange/blue as accents.

| Role | Name | Hex |
|---|---|---|
| Primary canvas | White | `#FFFFFF` |
| Secondary canvas (alt sections) | Off-white / Mist | `#F7F9FC` |
| Headings & dark sections | Midnight Navy | `#0B1A30` |
| Primary accent / CTA | Forge Orange | `#F26419` |
| Secondary accent / highlights | Circuit Blue | `#2E9BE6` |
| Body text | Slate | `#41505F` |
| Muted text | Cool Gray | `#7C8A99` |
| Borders / hairlines | Light Gray | `#E6EBF1` |

> **[CONFIRM]** hex values against real brand assets. Rules: white/off-white dominate; alternate `#FFFFFF` and `#F7F9FC` between sections for rhythm. **Forge Orange is for primary CTAs and key highlights only.** Use full-bleed **Midnight Navy bands** sparingly for contrast/punch (e.g., the GHL hero, a mid-page CTA band, the footer). Maintain strong contrast — never put small body text in orange.

### 4.2 Typography
- **Headlines:** Barlow (700/800)
- **Body:** Inter (400/500)
- Strong, confident type scale. Big headlines, generous spacing.

### 4.3 Logo
Monogram badge (favicon/mobile mark) + inline lockup (header/footer). On a light theme use the **dark/navy version** of the logo. Leave labeled placeholder slots if asset files aren't in the repo.

---

## 4A. Visual design direction — premium, bright, graphics-rich

The site must feel **expensive, clean, and alive** — like a top-tier SaaS product site, on a white canvas. Ray wants it **rich in graphics and animation**. Deliver that, but with intention: orchestrated motion and purposeful graphics, not clutter. The rule still holds — **one signature moment per page, everything else disciplined** — but overall density of polished visuals should be high.

### Graphics & visual assets (HIGH PRIORITY)
Every major page should feature substantial visual content, not walls of text:
- **Device mockups:** browser-framed dashboards, laptop frames, and phone frames containing stylized (NOT real-product) UI — pipelines, calendars, charts, chat threads, review stars. Cluster a laptop + phone in heroes for depth.
- **Floating glass UI cards** around devices: metric tiles, notification toasts ("New 5-star review", "Lead replied in 0:47"), mini charts. Animate gently (float, fade-in, count-up).
- **Illustrations / iconography:** clean modern line or soft-3D style. For illustrations, use free libraries — leave labeled `<img>` placeholders and suggest sources (unDraw, Storyset, Humaaans) OR build as inline SVG. Do NOT fabricate or hotlink licensed/stock images.
- **Animated data:** bar/line charts that grow on scroll, number count-ups, progress rings.
- **Process/flow graphics:** an animated automation flow (lead → text-back → pipeline → booked → review) as a recurring signature.
- Theme device mockups per industry (HVAC job dashboard, med spa booking calendar, pet grooming reminder thread).

### Glassmorphism on light
Frosted **white** glass for elevated elements (cards, sticky nav, floating UI): `background: rgba(255,255,255,0.65)`, `backdrop-filter: blur(14–18px)`, hairline border `1px solid rgba(255,255,255,0.9)` or `rgba(11,26,48,0.06)`, soft layered shadow e.g. `0 20px 45px rgba(11,26,48,0.10)`. Light, airy, premium. Cap stacked blur layers (GPU cost).

### Gradients (soft, light)
- **Ambient:** large, very soft blurred mesh blobs in pale orange and pale blue (8–14% opacity) drifting behind white sections for subtle depth.
- **Accent:** an orange→blue gradient used sparingly on a hero highlight word, the primary CTA hover, the "Most Popular"/"Founder" badge, and section dividers.
- Base stays white; gradients are accents only. No rainbow.

### Animation (orchestrated, richer than a typical site)
- Hero load: staggered entrance of headline → subhead → CTA → device cluster.
- Scroll-triggered reveals on sections/cards (fade + translate-up, ~400–600ms, easing `cubic-bezier(0.16,1,0.3,1)`).
- Hover micro-interactions: cards lift + soft glow; buttons brighten/scale slightly.
- Number count-ups; chart grow-ins; animated automation flow.
- Ambient device/card float + slow gradient drift.
- **Respect `prefers-reduced-motion`** (show final states). Animate **only transform/opacity**. Test for jank on mobile.

### Signature element per page
Each major page gets ONE memorable hero visual (see per-page specs in §6). Spend polish there; keep the rest clean.

---

## 5. Site map / Information architecture

Multi-page site with a top nav that has two dropdown menus.

```
Home
Industries (dropdown)
   ├─ Home Services        (shows Launchpad / Momentum / Pinnacle)
   ├─ Med Spa              (shows Glow Engine / Glow Authority)
   └─ Pet Grooming         (shows Fetch / Best in Show)

Our Services (dropdown)
   ├─ Automation           (emphasis: built on GHL)
   ├─ Website Design       (emphasis: built on GHL funnels/sites)
   └─ Digital Marketing    (emphasis: tracked/managed via GHL)
GHL                        (what GoHighLevel can do; CodexMill as the experts)
[CTA button] Book Free Audit
```

**Standalone:** `/privacy-policy`, `/terms-condition`, `/thank-you`. Optional lightweight landing pages for the two dropdowns (an Industries overview and an Our Services overview).

**Announcement bar (site-wide, top):** promotes the **Founder Members** offer (see §7.2). Dismissible. Links to pricing/CTA.

**Nav behavior:** sticky, frosted-white on scroll; dropdowns on hover (desktop) and tap (mobile); orange "Book Free Audit" button persistent.

---

## 6. Page-by-page spec

> Copy for each page is in `CodexMill_Copy.md`. Pricing tables come from `CodexMill_Pricing.md`. Every page ends with a CTA and shares the global header/footer + announcement bar.

### 6.1 Home (white)
Signature: hero device cluster (laptop dashboard + phone showing missed-call text-back) with floating glass stat cards + animated automation flow.
Sections: Hero → trust strip → Problem (universal) → How It Works (Capture/Follow Up/Book/Grow, graphic per step) → **Industries we serve** (3 cards → industry pages) → **Our Services** (3 cards → service pages) → Why CodexMill / built on GHL → **Founder Members promo band** → Social proof (placeholders) → short FAQ → navy Final CTA band → Footer.

### 6.2 Industries — overview (light, light build)
Brief intro + 3 large industry cards (Home Services, Med Spa, Pet Grooming) linking to each page; each themed with its own illustration/device mock and sub-tagline.

### 6.3 Home Services (white)
Signature: HVAC/Roofing/Lawn dashboard mockup (jobs pipeline + calendar).
Sections: Hero (sub-tagline "More Calls. More Jobs. Less Chaos.") → who it's for (HVAC, Roofing, Lawn Mowing — and other home services) → home-services pains → How It Works → device/graphics → **Pricing: Launchpad / Momentum / Pinnacle** (Monthly/Annual toggle + Founder badge) → FAQ → CTA.

### 6.4 Med Spa (white)
Signature: med-spa booking calendar + treatment-reminder phone mock; soft, premium aesthetic.
Sections: Hero (sub-tagline "More Bookings. Fewer No-Shows. Less Chaos.") → med-spa pains (no-shows, rebooking gaps, lapsed clients, slow consult follow-up) → How It Works → graphics → **Pricing: Glow Engine / Glow Authority** (Monthly/Annual + Founder) → FAQ → CTA.

### 6.5 Pet Grooming (white)
Signature: grooming-reminder chat thread + booking calendar phone mock; friendly, warm.
Sections: Hero (sub-tagline "More Bookings. Happier Clients. Less Chaos.") → pet pains (no-shows, customers forgetting to rebook, missed calls, weak reviews) → How It Works → graphics → **Pricing: Fetch / Best in Show** (Monthly/Annual + Founder) → FAQ → CTA.

### 6.6 Our Services — Automation (light, GHL-forward)
Signature: animated GHL-style workflow/pipeline builder mock (nodes connecting, a lead flowing through).
Emphasis: how CodexMill builds your automation engine on GoHighLevel — missed-call text-back, lead response, pipelines, nurture, reactivation, reviews. Sections: Hero → the problem with manual follow-up → what we automate (icon grid) → "built on GoHighLevel" explainer → graphics → CTA.

### 6.7 Our Services — Website Design (light, GHL-forward)
Signature: device mock of a high-converting site + funnel, with form/booking wired in.
Emphasis: we design fast, conversion-focused websites and funnels **on GoHighLevel**, integrated with your CRM, booking, and automations from day one — not a disconnected brochure site. Sections: Hero → why most small-biz sites don't convert → what we build (funnels, landing pages, booking, forms) → "built on GHL = everything connected" → graphics → CTA.

### 6.8 Our Services — Digital Marketing (light, GHL-forward)
Signature: ad + analytics dashboard mock with attribution flow (ad → lead → pipeline → booked).
Emphasis: Google & Meta ads + local SEO/GBP, **tracked and managed through GoHighLevel** so every lead, call, and dollar is attributed and fed into your pipeline. Sections: Hero → the "marketing without tracking" problem → what we run → "GHL closes the loop" attribution explainer → graphics → CTA.

### 6.9 GHL (navy hero for contrast)
Signature: an all-in-one platform diagram — capture, nurture, convert, retain — animated.
Purpose: showcase what GoHighLevel can do (lead capture via funnels/forms/calendars, automation workflows, sales pipelines, unified inbox, email/SMS, reputation/reviews, reporting) and position CodexMill as the experts who wield it. Keep claims accurate. Sections: Hero → "one platform, total control" → capabilities grid → how CodexMill turns the platform into results → graphics-rich → CTA.

---

## 7. Pricing model & promo (build rules)

> Exact numbers: see `CodexMill_Pricing.md`. This section defines behavior.

### 7.1 Monthly / Annual toggle
Every pricing section has a **Monthly ↔ Annual** toggle. **Annual = 15% off**, billed yearly. When Annual is selected, show the discounted effective monthly price, a "Save 15%" badge, and optionally the annual total. Drive prices from a single config object.

### 7.2 Founder Members promo
A limited launch offer, shown via the site-wide announcement bar, a dedicated promo band on Home, and a badge/toggle on **eligible** pricing cards:
- **First 50 clients only.**
- **Base packages only.** Eligible plans: **Launchpad** (Home Services), **Glow Engine** (Med Spa), **Fetch** (Pet Grooming). Higher tiers (Momentum, Pinnacle, Glow Authority, Best in Show) do **not** show founder pricing.
- **Monthly: 70% off** the list monthly price. **Annual: 80% off** the list annual total.
- **Term: 1 year**, then the plan reverts to the standard rate at renewal. State this clearly in the promo fine print.
- On eligible cards, present founder pricing as a badge/toggle showing the founder price next to the standard price (struck through). On non-eligible cards, show standard Monthly/Annual only.
- Use honest urgency: "Limited to the first 50 clients." Do **not** build a fake live countdown. If a spots-remaining number is shown, make it one editable value Ray updates (or wire to GHL later). **[CONFIRM]** whether to show a spots counter.

---

## 8. The primary CTA — booking
Every CTA reads **"Book Your Free Strategy Call"** ("Book Free Audit" in nav). All point to one `BOOKING_URL` constant. Wire to CodexMill's **GHL booking calendar / discovery form** later. No custom backend form.

---

## 9. Tech & build conventions
**Recommended stack (swap only if Ray asks):** **Astro + Tailwind CSS**, static output, deployed to Netlify/Vercel — clean multi-page routing, minimal JS, fast despite heavy visuals.
- **Component-driven:** shared `Header` (dropdowns + announcement bar), `Footer`, `PricingTable` (toggle + founder logic), `DeviceMock`, `GlassCard`, `SectionReveal`. Reuse across pages.
- **One pricing config object** powers every pricing section (list price → computes annual 15% and founder 70/80%). No hardcoded prices in markup.
- **Mobile-first, fully responsive.** Heavy graphics degrade gracefully on phones.
- **Performance is non-negotiable:** lazy-load images/mocks, cap blur layers, animate transform/opacity only, high Lighthouse score. Premium ≠ heavy.
- **Accessibility:** semantic HTML, alt text, visible focus, sufficient contrast (orange = fills/large text only), `prefers-reduced-motion` honored.
- **SEO:** per-page titles/meta/OG, one `<h1>` per page, `LocalBusiness`/`ProfessionalService` JSON-LD, clean internal linking between industries/services.
- **Brand tokens centralized** in the Tailwind theme. No scattered hex.
- **No fake content:** labeled placeholders for testimonials, logos, metrics, and illustration slots. Never invent client names/results.
- Clean, commented code; Ray may make small edits.

---

## 10. Out of scope (don't build unless asked)
Blog/CMS · accounts/dashboards · custom backend/database (booking → GHL) · on-site payments · fabricated testimonials/stats/images.

---

## 11. Definition of done
A responsive, fast, **white-themed, graphics-rich** multi-page site executing §4A (device mockups, glass cards, soft gradients, orchestrated animation, one signature visual per page) with no jank; all pages and nav dropdowns from §5; industry pages showing the correct packages with a working **Monthly/Annual toggle + Founder Members** pricing from a single config; the site-wide founder announcement bar; every CTA wired to `BOOKING_URL`; centralized brand tokens; `prefers-reduced-motion` respected; high Lighthouse score; per-page SEO; legal pages stubbed. Then walk Ray through deploying and plugging in the real booking link, logo files, illustrations, legal copy, and the `[CONFIRM]` items.
