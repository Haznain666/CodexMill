/**
 * CodexMill — SITE config: brand metadata, the single BOOKING_URL,
 * nav structure, and the Founder Members promo. Imported everywhere so
 * CTAs, dropdowns, and the announcement bar stay in sync.
 */

import type { IndustryId } from './pricing';

/* ------------------------------------------------------------------ */
/* Booking — every CTA on the site points here.                       */
/* TODO[Ray]: replace with the real GHL booking calendar / discovery   */
/* form URL before launch. (CLAUDE.md §8)                              */
/* ------------------------------------------------------------------ */
export const BOOKING_URL = 'https://link.codexmill.com/book-free-audit'; // [CONFIRM] placeholder

/**
 * On-site discovery wizard. The primary "Book/Claim" CTAs route here first
 * (qualify + recommend), and the form itself ends by linking to BOOKING_URL.
 */
export const GET_STARTED_URL = '/get-started';

/** Client login — hosted app, opens in a new tab (not part of this site). */
export const LOGIN_URL = 'https://app.codexmill.com';

/**
 * IANA timezone the GHL calendar is configured in. Booking slots are always
 * fetched and displayed in this timezone, regardless of the visitor's own
 * browser/location — so what a visitor sees always matches what's booked in GHL.
 * [CONFIRM] must match the timezone set on the GHL calendar itself.
 */
export const GHL_TIMEZONE = 'America/New_York';

/* ------------------------------------------------------------------ */
/* Brand                                                              */
/* ------------------------------------------------------------------ */
export const SITE = {
  name: 'CodexMill',
  legalName: 'Dispatch Globally LLC',
  domain: 'https://codexmill.com', // [CONFIRM] final domain — keep in sync with astro.config.mjs
  positioning: 'GHL Automation & Growth Specialists',
  masterTagline: 'More Calls. More Jobs. Less Chaos.',
  description:
    'CodexMill helps small businesses capture every lead, follow up automatically, and book more appointments — done-for-you on GoHighLevel.',
  // [CONFIRM] real contact details
  contact: {
    email: 'Info@codexmill.com', // [CONFIRM]
    phone: '(239) 72 CODEX', // [CONFIRM]
  },
  social: {
    // [CONFIRM] add real profiles when available
    facebook: '',
    instagram: '',
    linkedin: '',
  },
} as const;

/** Primary CTA label, used by every booking button. ("Book Free Audit" in nav.) */
export const CTA_LABEL = 'Book Your Free Strategy Call';
export const CTA_LABEL_SHORT = 'Book Free Audit';

/* ------------------------------------------------------------------ */
/* Industry sub-taglines (CLAUDE.md §2)                               */
/* ------------------------------------------------------------------ */
export const INDUSTRY_SUBTAGLINES: Record<IndustryId, string> = {
  'home-services': 'More Calls. More Jobs. Less Chaos.',
  'med-spa': 'More Bookings. Fewer No-Shows. Less Chaos.',
  'pet-grooming': 'More Bookings. Happier Clients. Less Chaos.',
};

/* ------------------------------------------------------------------ */
/* Navigation                                                         */
/* ------------------------------------------------------------------ */
export interface NavLink {
  label: string;
  href: string;
  /** short description shown in mega-dropdown rows */
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** dropdown children (Industries / Our Services) */
  children?: NavLink[];
}

export const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Industries',
    href: '/industries',
    children: [
      {
        label: 'Home Services',
        href: '/industries/home-services',
        description: 'HVAC, Roofing, Lawn & more',
      },

      { label: 'Med Spa', href: '/industries/med-spa', description: 'Fuller calendar, fewer no-shows' },
      {
        label: 'Pet Grooming',
        href: '/industries/pet-grooming',
        description: 'Rebookings on every cycle',
      },
    ],
  },
    
  {
    label: 'Our Services',
    href: '/services',
    children: [
      {
        label: 'Automation',
        href: '/services/automation',
        description: 'Your follow-up that never sleeps',
      },
      {
        label: 'Website Design',
        href: '/services/website-design',
        description: 'Sites & funnels that book jobs',
      },
      {
        label: 'Digital Marketing',
        href: '/services/digital-marketing',
        description: 'Ads that turn into appointments',
      },
    ],
  },
  { label: 'GHL', href: '/ghl' },

    {
    label: 'Integrations',
    href: '/integrations',
    children: [
      {
        label: 'Housecall Pro + GHL',
        href: '/integrations/housecall-pro',
        description: 'Sync jobs, customers, and follow-up',
      },
      {
        label: 'Jobber + GHL',
        href: '/integrations/jobber',
        description: 'Estimates, invoices, and rebooking',
      },
    ],
  },
  

  {
    label: 'Pricing',
    href: '#',
    children: [
      {
        label: 'Home Services',
        href: '/industries/home-services/#service-price',
        description: 'HVAC, Roofing, Lawn & more',
      },

      { label: 'Med Spa', href:'/industries/med-spa/#service-price', description: 'Fuller calendar, fewer no-shows' },
      {
        label: 'Pet Grooming',
        href: '/industries/pet-grooming/#service-price',
        description: 'Rebookings on every cycle',
      },
    ],
  },
];

/** Footer link columns. */
export const FOOTER_NAV = {
  Industries: [
    { label: 'Home Services', href: '/industries/home-services' },
    { label: 'Med Spa', href: '/industries/med-spa' },
    { label: 'Pet Grooming', href: '/industries/pet-grooming' },
  ],
  'Our Services': [
    { label: 'Automation', href: '/services/automation' },
    { label: 'Website Design', href: '/services/website-design' },
    { label: 'Digital Marketing', href: '/services/digital-marketing' },
  ],
  Company: [
    { label: 'GHL', href: '/ghl' },
    { label: 'Book a Free Audit', href: GET_STARTED_URL },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy-policy' },
    { label: 'Terms', href: '/terms-condition' },
  ],
} satisfies Record<string, NavLink[]>;

/* ------------------------------------------------------------------ */
/* Founder Members promo (CLAUDE.md §7.2)                             */
/* ------------------------------------------------------------------ */
export const FOUNDER = {
  enabled: true,
  /** First N clients only — honest urgency, not a fake live countdown. */
  totalSpots: 50,
  /**
   * Optional spots-remaining number. [CONFIRM] whether to show a counter.
   * If shown, Ray edits this ONE value (or we wire to GHL later). null = hide.
   */
  spotsRemaining: null as number | null,
  /** Founder rate term, then reverts to standard at renewal. */
  termLabel: '1 year',
  /** Eligible base plans only. */
  eligiblePlanIds: ['launchpad', 'glow-engine', 'fetch'] as const,
  /** Discount headline figures (for copy; math lives in pricing.ts). */
  monthlyOffLabel: '20% off',
  annualOffLabel: '30% off',
  /** Announcement bar (site-wide, dismissible). */
  announcement: {
    text: 'Founder Member pricing is live — up to 30% off your first year on our starter plans, for the first 50 clients.',
    ctaLabel: 'Claim your spot',
    ctaHref: GET_STARTED_URL,
    /** localStor age key so dismissal persists across pages/visits. */
    dismissKey: 'cm-founder-bar-dismissed',
  },
  /** Reusable fine print. */
  finePrint:
    'Available on our starter plans (Launchpad / Glow Engine / Fetch), for the first 50 clients. Founder rate applies to your first year, then reverts to the standard rate at renewal.',
} as const; 
