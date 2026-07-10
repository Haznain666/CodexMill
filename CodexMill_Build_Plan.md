# CodexMill — Build Plan & Claude Code Prompts

> How to have Claude Code build the site cleanly and in order. Pair this with `CLAUDE.md`, `CodexMill_Pricing.md`, and `CodexMill_Copy.md`. Stack: **Astro + Tailwind CSS** (static output).

---

## 1. Recommended project structure

```
codexmill-site/
├─ CLAUDE.md                      ← master brief (root, auto-read by Claude Code)
├─ docs/
│  ├─ CodexMill_Pricing.md        ← pricing source of truth (human reference)
│  └─ CodexMill_Copy.md           ← all page copy
├─ public/
│  ├─ logo/                       ← logo SVGs (placeholders for now)
│  ├─ images/                     ← illustration/image placeholders
│  └─ favicon.png
├─ src/
│  ├─ config/
│  │  ├─ pricing.ts               ← SINGLE SOURCE OF TRUTH for prices (see §3)
│  │  └─ site.ts                  ← booking URL, nav, founder promo settings
│  ├─ layouts/
│  │  └─ BaseLayout.astro         ← <head>/SEO, fonts, announcement bar, header, footer
│  ├─ components/
│  │  ├─ AnnouncementBar.astro    ← site-wide founder promo bar (dismissible)
│  │  ├─ Header.astro             ← sticky nav w/ Industries + Our Services dropdowns
│  │  ├─ .astro
│  │  ├─ Button.astro             ← primary/secondary CTA
│  │  ├─ GlassCard.astro          ← frosted-white card primitive
│  │  ├─ SectionReveal.astro      ← scroll-triggered reveal wrapper
│  │  ├─ DeviceMock.astro         ← laptop/phone/browser frame w/ slotted UI
│  │  ├─ FloatingStat.astro       ← floating glass metric/notification card
│  │  ├─ Hero.astro               ← reusable hero (eyebrow/headline/sub/CTAs/visual slot)
│  │  ├─ HowItWorks.astro         ← Capture→Follow Up→Book→Grow block
│  │  ├─ PricingTable.astro       ← reads pricing.ts; Monthly/Annual/Founder toggle
│  │  ├─ IndustryCard.astro
│  │  ├─ ServiceCard.astro
│  │  └─ CTASection.astro         ← navy final-CTA band
│  ├─ styles/
│  │  └─ global.css               ← base styles, gradient-blob utilities
│  └─ pages/
│     ├─ index.astro                       ← Home
│     ├─ industries/index.astro            ← Industries overview
│     ├─ industries/home-services.astro
│     ├─ industries/med-spa.astro
│     ├─ industries/pet-grooming.astro
│     ├─ services/index.astro              ← Our Services overview (light)
│     ├─ services/automation.astro
│     ├─ services/website-design.astro
│     ├─ services/digital-marketing.astro
│     ├─ ghl.astro
│     ├─ privacy.astro
│     ├─ terms.astro
│     └─ thank-you.astro
├─ tailwind.config.mjs            ← brand tokens (colors + fonts from CLAUDE.md §4)
├─ astro.config.mjs
└─ package.json
```

**Interactivity note (Astro):** the Monthly/Annual/Founder toggle, mobile-nav, announcement-bar dismiss, and scroll reveals are small client-side scripts — use Astro `<script>` tags (vanilla JS) or tiny islands. No heavy framework needed.

---

## 2. Build order (phases)

Don't build everything at once. Go phase by phase, reviewing after each:

- **Phase 0 — Init & tokens:** scaffold Astro + Tailwind; load Barlow/Inter; put the §4 palette into `tailwind.config.mjs`; set up `global.css` (white base, gradient-blob utilities, reduced-motion handling).
- **Phase 1 — Config:** `pricing.ts` (see §3) and `site.ts` (booking URL, nav data, founder promo settings).
- **Phase 2 — Chrome:** `BaseLayout`, `AnnouncementBar`, `Header` (with both dropdowns, sticky frosted-on-scroll, mobile menu), `Footer`, `Button`.
- **Phase 3 — Primitives:** `GlassCard`, `SectionReveal`, `DeviceMock`, `FloatingStat`, `Hero`, `HowItWorks`, `PricingTable`, `CTASection`, `IndustryCard`, `ServiceCard`.
- **Phase 4 — Home page:** assemble from components; build the signature hero device cluster + animated automation flow.
- **Phase 5 — Industry pages:** Home Services, Med Spa, Pet Grooming — each with its themed signature visual and `PricingTable` wired to the right plans.
- **Phase 6 — Services + GHL pages:** Automation, Website Design, Digital Marketing (GHL-forward), and the GHL page (navy hero).
- **Phase 7 — Stubs & SEO:** Industries/Services overviews, privacy/terms/thank-you, per-page meta/OG + JSON-LD, internal linking.
- **Phase 8 — Polish:** entrance/scroll/hover animations, signature visuals, `prefers-reduced-motion`, accessibility pass, Lighthouse/performance pass.

---

## 3. Pricing config (the linchpin — `src/config/pricing.ts`)

All prices flow from this one file. The `PricingTable` computes annual/founder from list monthly. Populate the `features` arrays from `docs/CodexMill_Pricing.md`.

```ts
// src/config/pricing.ts
export const ANNUAL_DISCOUNT = 0.15;          // 15% off annual
export const FOUNDER_MONTHLY_DISCOUNT = 0.70; // 70% off monthly
export const FOUNDER_ANNUAL_DISCOUNT = 0.80;  // 80% off annual total

export type Plan = {
  id: string;
  name: string;
  monthly: number;        // list monthly price (the only number you edit)
  tagline: string;
  popular?: boolean;
  founderEligible?: boolean; // true ONLY for base plans (founder promo, 1-year term)
  features: string[];
};

export type IndustryPricing = { industry: string; plans: Plan[] };

export const pricing: Record<string, IndustryPricing> = {
  homeServices: {
    industry: "Home Services",
    plans: [
      { id: "launchpad", name: "Launchpad", monthly: 497, tagline: "Never miss another lead.", founderEligible: true, features: [/* from pricing doc */] },
      { id: "momentum",  name: "Momentum",  monthly: 797, tagline: "Capture, follow up, and grow.", popular: true, features: [/* ... */] },
      { id: "pinnacle",  name: "Pinnacle",  monthly: 1497, tagline: "Your full growth engine.", features: [/* ... */] },
    ],
  },
  medSpa: {
    industry: "Med Spa",
    plans: [
      { id: "glow-engine",    name: "Glow Engine",    monthly: 497, tagline: "Automation essentials.", founderEligible: true, features: [/* ... */] },
      { id: "glow-authority", name: "Glow Authority", monthly: 997, tagline: "Automation + marketing.", popular: true, features: [/* ... */] },
    ],
  },
  petGrooming: {
    industry: "Pet Grooming",
    plans: [
      { id: "fetch",         name: "Fetch",         monthly: 397, tagline: "Automation essentials.", founderEligible: true, features: [/* ... */] },
      { id: "best-in-show",  name: "Best in Show",  monthly: 797, tagline: "Automation + marketing.", popular: true, features: [/* ... */] },
    ],
  },
};

// --- derived prices (rounded for display) ---
const r = (n: number) => Math.round(n);
export const annualMonthly       = (m: number) => r(m * (1 - ANNUAL_DISCOUNT));        // effective $/mo billed annually
export const annualTotal         = (m: number) => r(m * 12 * (1 - ANNUAL_DISCOUNT));   // $/yr
export const founderMonthly      = (m: number) => r(m * (1 - FOUNDER_MONTHLY_DISCOUNT)); // 70% off $/mo
export const founderAnnualMonthly= (m: number) => r(m * (1 - FOUNDER_ANNUAL_DISCOUNT));  // 80% off, effective $/mo
export const founderAnnualTotal  = (m: number) => r(m * 12 * (1 - FOUNDER_ANNUAL_DISCOUNT)); // 80% off $/yr
```

```ts
// src/config/site.ts
export const BOOKING_URL = "https://REPLACE-WITH-GHL-BOOKING-LINK"; // TODO
export const founderPromo = {
  active: true,
  spotsTotal: 50,
  showCounter: false,          // [CONFIRM] — if true, set spotsRemaining manually
  spotsRemaining: 50,
  termYears: 1,                // founder rate valid 1 year, then reverts to standard
  // applies to base plans only (see founderEligible flag in pricing.ts)
};
// nav data (labels + hrefs) for Header dropdowns lives here too
```

---

## 4. PricingTable behavior
- Three states: **Monthly** (list), **Annual** (15% off — show effective $/mo + "Save 15%" badge + annual total), **Founder Member** (only on `founderEligible` plans — show founder $/mo, and on annual show the 80%-off price with the standard price struck through).
- **Founder pricing renders only on base plans** (`founderEligible: true` — Launchpad, Glow Engine, Fetch). Non-eligible plans always show standard Monthly/Annual only — no founder badge or toggle on those cards.
- Founder fine print: "Founder pricing applies to the first 50 clients, on this plan, for the first year. Reverts to standard rate at renewal."
- Reads plans from `pricing.ts` by industry key (e.g. `<PricingTable industry="medSpa" />`).
- Mark the `popular` plan with a "Most Popular" ribbon; mark founder pricing with an accent gradient badge.
- All "Choose plan" buttons → `BOOKING_URL`.

---

## 5. Claude Code — kickoff prompt (paste this first)

> Read `CLAUDE.md`, `docs/CodexMill_Pricing.md`, and `docs/CodexMill_Copy.md` in full before doing anything. We're building the CodexMill marketing site in Astro + Tailwind, white/light theme, graphics-rich, per the brief.
>
> Don't build the whole site yet. Start with **Phase 0 and Phase 1** only:
> 1. Scaffold an Astro + Tailwind project.
> 2. Put the brand palette and Barlow/Inter fonts into `tailwind.config.mjs` and `global.css`, with white as the primary canvas and the reduced-motion + gradient-blob utilities set up.
> 3. Create `src/config/pricing.ts` exactly as specified in the build plan, populating the `features` arrays from the pricing doc, and `src/config/site.ts` with the booking-URL placeholder and founder-promo settings.
>
> Then **show me:** the project structure, the Tailwind token config, and the pricing config — and wait for my approval before Phase 2. Flag anything in the brief marked `[CONFIRM]` that blocks you.

---

## 6. Follow-up prompts (one phase at a time)

- **Phase 2:** "Approved. Build Phase 2 — `BaseLayout`, `AnnouncementBar` (founder promo, dismissible), `Header` with the Industries + Our Services dropdowns (sticky, frosted-on-scroll, working mobile menu), `Footer`, and `Button`. Use the nav data from `site.ts` and copy from the copy deck. Show me the header/footer rendered before moving on."
- **Phase 3:** "Build the reusable primitives: `GlassCard`, `SectionReveal`, `DeviceMock` (laptop/phone/browser frames with a content slot), `FloatingStat`, `Hero`, `HowItWorks`, `PricingTable` (Monthly/Annual/Founder per the build plan, reading `pricing.ts`), `IndustryCard`, `ServiceCard`, `CTASection`. Keep them generic and reusable."
- **Phase 4:** "Build the Home page from the components, using the Home copy. Build the signature hero device cluster (laptop dashboard + phone text-back) with floating glass stat cards and the animated automation flow. Include the Founder Members band."
- **Phase 5:** "Build the three industry pages (Home Services, Med Spa, Pet Grooming) using their copy and `PricingTable` wired to the right industry key. Give each its themed signature visual."
- **Phase 6:** "Build the three Our Services pages and the GHL page (navy hero). Lead each Services page with how it's delivered on GoHighLevel, per the copy."
- **Phase 7:** "Build the Industries + Our Services overview pages and stub privacy/terms/thank-you. Add per-page SEO meta/OG and `LocalBusiness` JSON-LD, plus internal linking."
- **Phase 8:** "Final polish pass: entrance + scroll + hover animations per the brief, verify `prefers-reduced-motion`, run an accessibility check (focus states, contrast, alt text), and a performance/Lighthouse pass. Tell me where to plug in the real booking link, logo files, illustrations, and the `[CONFIRM]` items."

---

## 7. Before you start — have ready
- Logo files (SVG) in `public/logo/` — or accept placeholders.
- Your GHL booking link for `BOOKING_URL`.
- Real hex codes (if you have a brand guide) to replace the suggested ones.
- Decisions on the `[CONFIRM]` items: Med Spa & Pet prices, founder rate lock/revert, spots counter, setup timeline, contract terms, contact info, legal copy.
