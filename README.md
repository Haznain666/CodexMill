# CodexMill — Marketing Website

Fast, static, white-themed multi-page marketing site for **CodexMill** (a service of
Dispatch Globally LLC). Built with **Astro 5 + Tailwind CSS v3**, static output.

- **Pages:** Home · Industries (overview + Home Services / Med Spa / Pet Grooming) ·
  Our Services (overview + Automation / Website Design / Digital Marketing) · GHL ·
  Privacy · Terms · Thank-You
- **Single sources of truth:** pricing in `src/config/pricing.ts`, site/nav/promo in
  `src/config/site.ts`, brand tokens in `tailwind.config.mjs`.

---

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs static site to ./dist
npm run preview  # serve the production build locally
```

Requires Node 18+ (CI pinned to Node 20 via `.nvmrc`).

---

## Deploy

The site is **fully static** — deploy the `dist/` folder to any static host.

### Option A — Netlify
Config is in `netlify.toml` (build `npm run build`, publish `dist`).

1. Push this repo to GitHub/GitLab.
2. Netlify → **Add new site → Import an existing project** → pick the repo.
3. Settings are auto-detected from `netlify.toml`. Click **Deploy**.

Or via CLI:
```bash
npm i -g netlify-cli
netlify deploy --build --prod
```

### Option B — Vercel
Config is in `vercel.json` (framework `astro`, output `dist`).

1. Push the repo. 2. Vercel → **Add New → Project** → import the repo → **Deploy**.

Or via CLI:
```bash
npm i -g vercel
vercel --prod
```

### Option C — any static host / manual
```bash
npm run build
# upload the contents of ./dist to your host (S3, Cloudflare Pages, nginx, etc.)
```

---

## Before you go live — checklist

Set these so links, SEO, and the booking flow are correct:

| What | Where |
|---|---|
| **Booking URL** (GHL calendar / discovery form) | `src/config/site.ts` → `BOOKING_URL` |
| **Production domain** (canonical, OG, sitemap, JSON-LD) | `astro.config.mjs` → `SITE_URL` **and** `src/config/site.ts` → `SITE.domain` |
| **Contact email / phone** | `src/config/site.ts` → `SITE.contact` |
| **Social profiles** (adds JSON-LD `sameAs`) | `src/config/site.ts` → `SITE.social` |
| **Logo files** | `src/components/Logo.astro` + `public/favicon.png` |
| **OG share image** | add `public/og-default.png` (1200×630) |
| **Legal copy** | `src/pages/privacy-policy.astro`, `src/pages/terms-condition.astro` |
| **Testimonials / client logos** | `src/pages/index.astro` (social proof), `src/components/TrustStrip.astro` |
| **Founder spots counter** (optional "X spots left") | `src/config/site.ts` → `FOUNDER.spotsRemaining` (currently `null` = hidden) |

### `[CONFIRM]` items (search the codebase for `[CONFIRM]`)
Brand hex values · contact details · FAQ start-timeline & lock-in/contract terms ·
whether to show the Founder spots counter.

---

## Pricing & promo

All prices derive from **list monthly** values in `src/config/pricing.ts`; annual (15% off)
and Founder (70% monthly / 80% annual) prices are computed. Founder pricing applies only to
the base plans (Launchpad / Glow Engine / Fetch), first 50 clients, first year. Never hardcode
a price in markup — read it from the config.

## Notes
- `npm install` reports advisories in **build/dev tooling only** (Astro SSR XSS vectors that
  don't apply to static output, plus esbuild/vite/yaml dev deps). None ship in `dist/`. See the
  project handoff for details.
- `prefers-reduced-motion` is honored; per-page SEO + `ProfessionalService`/`FAQPage` JSON-LD
  are included; `/thank-you` is `noindex` and excluded from the sitemap.

---

CodexMill is a service of Dispatch Globally LLC.
# CodexMill
# CodexMill
