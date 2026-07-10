/**
 * CodexMill — PRICING: single source of truth.
 * Mirrors docs/CodexMill_Pricing.md. Only LIST MONTHLY prices are stored;
 * annual (15% off) and Founder (70% / 80% off) prices are COMPUTED here.
 * No price should ever be hardcoded in markup — read it from this module.
 *
 * Rules (CLAUDE.md §7, CodexMill_Pricing.md):
 *  - Annual = 15% off:  effMonthly = list × 0.85 ; annualTotal = list × 12 × 0.85
 *  - Founder (first 50 clients, BASE plans only, 1-year term):
 *      Founder Monthly      = 70% off list monthly = list × 0.30
 *      Founder Annual       = 80% off list annual   = list × 12 × 0.20
 *      Founder Annual effMo  = list × 0.20
 *  - Display: round to nearest whole dollar.
 */

export const ANNUAL_DISCOUNT = 0.15; // 15% off list
export const FOUNDER_MONTHLY_DISCOUNT = 0.7; // 70% off list monthly
export const FOUNDER_ANNUAL_DISCOUNT = 0.8; // 80% off list annual

export type IndustryId = 'home-services' | 'med-spa' | 'pet-grooming';

export type BillingMode = 'monthly' | 'annual';

export interface Plan {
  /** stable slug used in markup / anchors */
  id: string;
  name: string;
  industryId: IndustryId;
  /** LIST monthly price in whole USD — the only stored number */
  monthly: number;
  /** short positioning line (from copy deck) */
  tagline: string;
  /** one-sentence summary (from copy deck) */
  blurb: string;
  /** feature bullets (from CodexMill_Pricing.md §Package contents) */
  features: string[];
  /** "Most Popular" / premium emphasis card */
  popular?: boolean;
  /** Only base plans qualify for Founder pricing */
  founderEligible: boolean;
  /** "Everything in X, plus…" lead-in for higher tiers */
  inheritsFrom?: string;
}

/* ------------------------------------------------------------------ */
/* Compute helpers — pure, rounded to nearest whole dollar for display */
/* ------------------------------------------------------------------ */

const round = (n: number) => Math.round(n);

/** Annual plan, shown as an effective monthly price. */
export const annualEffectiveMonthly = (list: number) => round(list * (1 - ANNUAL_DISCOUNT));
/** Annual plan billed-yearly total. */
export const annualTotal = (list: number) => round(list * 12 * (1 - ANNUAL_DISCOUNT));

/** Founder monthly price (70% off list monthly). */
export const founderMonthly = (list: number) => round(list * (1 - FOUNDER_MONTHLY_DISCOUNT));
/** Founder annual, shown as an effective monthly price (list × 0.20). */
export const founderAnnualEffectiveMonthly = (list: number) =>
  round(list * (1 - FOUNDER_ANNUAL_DISCOUNT));
/** Founder annual billed-yearly total (80% off list annual). */
export const founderAnnualTotal = (list: number) => round(list * 12 * (1 - FOUNDER_ANNUAL_DISCOUNT));

/** Fully-resolved price set for a plan — everything a PricingTable needs. */
export interface PlanPricing {
  /** list monthly */
  monthly: number;
  annual: {
    /** effective monthly under annual billing */
    effectiveMonthly: number;
    /** billed-yearly total */
    total: number;
    /** what you save vs. paying monthly for a year (whole $) */
    savings: number;
  };
  founder: null | {
    monthly: {
      /** founder monthly price */
      price: number;
      /** struck-through reference (list monthly) */
      was: number;
    };
    annual: {
      /** founder annual effective monthly */
      effectiveMonthly: number;
      /** founder billed-yearly total */
      total: number;
      /** struck-through reference (list annual total) */
      was: number;
    };
  };
}

/** Resolve all price variants for a plan from its single list monthly figure. */
export function getPlanPricing(plan: Plan): PlanPricing {
  const list = plan.monthly;
  const annual = {
    effectiveMonthly: annualEffectiveMonthly(list),
    total: annualTotal(list),
    savings: round(list * 12 - annualTotal(list)),
  };

  const founder = plan.founderEligible
    ? {
        monthly: { price: founderMonthly(list), was: list },
        annual: {
          effectiveMonthly: founderAnnualEffectiveMonthly(list),
          total: founderAnnualTotal(list),
          was: annualTotal(list),
        },
      }
    : null;

  return { monthly: list, annual, founder };
}

/* ------------------------------------------------------------------ */
/* Plans — list prices + features from CodexMill_Pricing.md            */
/* ------------------------------------------------------------------ */

export const PLANS: Record<IndustryId, Plan[]> = {
  'home-services': [
    {
      id: 'launchpad',
      name: 'Launchpad',
      industryId: 'home-services',
      monthly: 497,
      founderEligible: true,
      tagline: 'Never miss another lead.',
      blurb: 'Capture, answer, and book every lead automatically.',
      features: [
        'Missed-call text-back',
        'Instant lead response (forms auto-reply in minutes)',
        'Appointment booking automation',
        'Automated Google review requests post-job',
        'Basic CRM (contacts + lead source)',
        'Monthly report',
      ],
    },
    {
      id: 'momentum',
      name: 'Momentum',
      industryId: 'home-services',
      monthly: 797,
      founderEligible: true,
      popular: true,
      inheritsFrom: 'Launchpad',
      tagline: 'Capture, follow up, and grow.',
      blurb: 'Adds unified inbox, pipeline, nurture, reactivation, and basic ads.',
      features: [
        'Unified inbox (SMS / email / calls / FB DMs)',
        'Visual lead & job pipeline',
        'Appointment reminders',
        'Google Business Profile optimization',
        'Basic single-platform ad setup (Google OR Meta)',
        'Email & SMS nurture',
        'Referral automation',
        'Reactivation (6–12mo inactive)',
      ],
    },
        {
      id: 'Apex — Built For You',
      name: 'Apex — Built For You',
      industryId: 'home-services',
      monthly: 1497,
      founderEligible: true,
      tagline: 'When off-the-shelf isn\'t enough.',
      blurb: 'We scope it on a strategy call, then build it around how you actually run your business.',
      features: [
        'Fully customized to your operation',
        'Bespoke workflow automation built around your actual processes',
        'Dedicated build & ongoing strategy partnership',
        'Custom ad, nurture, and reactivation strategy — scoped, not templated',
      ],
    },
  ],

  'med-spa': [
    {
      id: 'glow-engine',
      name: 'Glow Engine',
      industryId: 'med-spa',
      monthly: 497,
      founderEligible: true,
      tagline: 'Automation essentials.',
      blurb: 'Booking, reminders, instant inquiry replies, reviews, and a client CRM — your front desk that never sleeps.',
      features: [
        'Missed-call text-back',
        'Instant response to web / IG / FB consult inquiries',
        'Online booking + automated appointment reminders (cut no-shows)',
        'Automated review requests post-visit',
        'Basic client CRM (contact + visit/treatment tracking + source)',
        'Monthly report',
      ],
    },
    {
      id: 'glow-authority',
      name: 'Glow Authority',
      industryId: 'med-spa',
      monthly: 997,
      founderEligible: true,
      popular: true,
      inheritsFrom: 'Glow Engine',
      tagline: 'Automation + marketing.',
      blurb: 'Everything in Glow Engine plus rebooking, nurture, reactivation, ads, seasonal promos, reputation, and a monthly strategy call.',
      features: [
        'Unified inbox (SMS / email / IG & FB DMs)',
        'Rebooking & treatment-cycle reminders (Botox 3-mo, facials monthly)',
        'Membership & package follow-up',
        'Email & SMS nurture for consult leads',
        'Lapsed-client reactivation',
        'Google & Meta ad management (consult/promo lead gen)',
        'Seasonal promo campaigns (wedding season, holidays, Mother’s Day)',
        'Reputation management',
        'Monthly strategy call',
      ],
    },
        {
      id: 'Apex — Built For You',
      name: 'Apex — Built For You',
      industryId: 'home-services',
      monthly: 1497,
      founderEligible: true,
      tagline: 'When off-the-shelf isn\'t enough.',
      blurb: 'We scope it on a strategy call, then build it around how you actually run your business.',
      features: [
        'Fully customized to your operation',
        'Bespoke workflow automation built around your actual processes',
        'Dedicated build & ongoing strategy partnership',
        'Custom ad, nurture, and reactivation strategy — scoped, not templated',
      ],
    },
  ],

  'pet-grooming': [
    {
      id: 'fetch',
      name: 'Fetch',
      industryId: 'pet-grooming',
      monthly: 397,
      founderEligible: true,
      tagline: 'Automation essentials.',
      blurb: 'Booking, reminders, instant inquiry replies, review requests, and a client + pet CRM.',
      features: [
        'Missed-call text-back',
        'Instant response to booking inquiries',
        'Online booking + automated reminders (reduce no-shows)',
        'Automated review requests post-groom',
        'Basic client & pet CRM (owner + pet, breed/service, source)',
        'Monthly report',
      ],
    },
    {
      id: 'best-in-show',
      name: 'Best in Show',
      industryId: 'pet-grooming',
      monthly: 797,
      founderEligible: true,
      popular: true,
      inheritsFrom: 'Fetch',
      tagline: 'Automation + marketing.',
      blurb: 'Everything in Fetch plus recurring reminders, loyalty follow-ups, nurture, reactivation, ads, seasonal campaigns, reputation, and a monthly strategy call.',
      features: [
        'Unified inbox',
        'Recurring grooming reminders on cycle (“Buddy’s due for a groom,” ~6–8 weeks)',
        'Loyalty / package follow-up',
        'Email & SMS nurture for new inquiries',
        'Lapsed-client reactivation',
        'Google & Meta ad management',
        'Seasonal campaigns (shedding season, summer, holidays)',
        'Reputation management',
        'Monthly strategy call',
      ],
    },
        {
      id: 'Apex — Built For You',
      name: 'Apex — Built For You',
      industryId: 'home-services',
      monthly: 1497,
      founderEligible: true,
      tagline: 'When off-the-shelf isn\'t enough.',
      blurb: 'We scope it on a strategy call, then build it around how you actually run your business.',
      features: [
        'Fully customized to your operation',
        'Bespoke workflow automation built around your actual processes',
        'Dedicated build & ongoing strategy partnership',
        'Custom ad, nurture, and reactivation strategy — scoped, not templated',
      ],
    },
  ],
};

/** Convenience: flat list of every plan. */
export const ALL_PLANS: Plan[] = Object.values(PLANS).flat();

/** Get the plans for one industry. */
export const getPlans = (industryId: IndustryId): Plan[] => PLANS[industryId];
