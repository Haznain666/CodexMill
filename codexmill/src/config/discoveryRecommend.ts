/**
 * recommendPackage — transparent, rules-based package recommendation for the
 * discovery wizard (NO AI/ML; plain, adjustable rules). Scores the submitted
 * answers against the three Home Services tiers and returns the best fit plus a
 * confidence flag and a plain-language reason tied to the actual answers.
 *
 * Tier names/prices come from src/config/pricing.ts (single source of truth).
 */
import { getPlans } from './pricing';

export interface DiscoveryAnswers {
  challenges?: string[];
  services?: string[];
  budget?: string;
  urgency?: string;
  primaryGoal?: string;
  crm?: string[];
  [key: string]: unknown;
}

export interface Recommendation {
  tierId: 'launchpad' | 'momentum' | 'pinnacle';
  tierName: string;
  monthly: number;
  confidence: 'high' | 'low';
  reason: string;
}

// Service options grouped by the tier they signal (must match Step 4 chip labels).
const HIGH_SERVICES = [
  'Google & Meta ad management',
  'Seasonal campaign automation',
  'Custom workflows & reporting',
];
const MID_SERVICES = [
  'Unified inbox (calls/SMS/email/social)',
  'Visual lead & job pipeline',
  'Referral & reactivation campaigns',
];
const BASE_SERVICES = [
  'Missed-call text-back',
  'Instant lead response',
  'Appointment booking & reminders',
  'Google review automation',
];

const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Human-friendly "a, b and c". */
const list = (items: string[]): string =>
  items.length <= 1
    ? items[0] ?? ''
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

export function recommendPackage(answers: DiscoveryAnswers): Recommendation {
  const services = arr(answers.services);
  const challenges = arr(answers.challenges);
  const crm = arr(answers.crm);
  const budget = str(answers.budget);
  const urgency = str(answers.urgency);
  const goal = str(answers.primaryGoal);

  const highPicks = services.filter((s) => HIGH_SERVICES.includes(s));
  const midPicks = services.filter((s) => MID_SERVICES.includes(s));
  const onlyBase = services.length > 0 && services.every((s) => BASE_SERVICES.includes(s));
  const minimalSystems = crm.length === 0 || crm.includes('No CRM / just spreadsheets');

  let pinnacle = 0;
  let momentum = 0;
  let launchpad = 0;
  const signals: string[] = []; // each clear signal noted for the confidence check

  // ---- high-tier (Pinnacle) signals ----
  if (highPicks.length) {
    pinnacle += 2 * highPicks.length;
    signals.push('high-service');
  }
  if (budget === '$2,000+/mo') {
    pinnacle += 3;
    signals.push('budget-high');
  }
  if (urgency.startsWith('Immediately') && challenges.length >= 4) {
    pinnacle += 2;
    signals.push('urgent-and-overwhelmed');
  }

  // ---- mid-tier (Momentum) signals ----
  if (midPicks.length) {
    momentum += 2 * midPicks.length;
    signals.push('mid-service');
  }
  if (budget === '$1,000–$2,000/mo') {
    momentum += 2;
    signals.push('budget-mid');
  }

  // ---- base-tier (Launchpad) signals ----
  if (onlyBase && services.length <= 2) {
    launchpad += 2;
    signals.push('base-service');
  }
  if (budget === 'Under $500/mo') {
    launchpad += 3;
    signals.push('budget-low');
  }
  if (minimalSystems && services.length <= 3 && !highPicks.length && !midPicks.length) {
    launchpad += 1;
    signals.push('minimal-systems');
  }

  // ---- challenge volume nudges the tier up ----
  if (challenges.length >= 6) pinnacle += 2;
  else if (challenges.length >= 3) momentum += 1;

  // ---- pick the tier (ties break downward toward the lighter plan) ----
  let tierId: Recommendation['tierId'] = 'launchpad';
  if (pinnacle > 0 && pinnacle >= momentum && pinnacle >= launchpad) tierId = 'pinnacle';
  else if (momentum > 0 && momentum >= launchpad) tierId = 'momentum';
  else tierId = 'launchpad';

  // ---- confidence ----
  const notSureOnly = services.length === 1 && services[0] === 'Not sure — need guidance';
  const vagueGoal = goal === 'Not sure yet' || goal === '';
  const vagueBudget = budget === 'Not sure yet' || budget === '';
  const vagueServices = services.length === 0 || notSureOnly;
  const allZero = pinnacle === 0 && momentum === 0 && launchpad === 0;

  const confidence: Recommendation['confidence'] =
    notSureOnly || signals.length < 2 || (vagueGoal && vagueBudget && vagueServices) || allZero
      ? 'low'
      : 'high';

  // ---- plain-language reason tied to their answers ----
  const cCount = challenges.length;
  const cPhrase = cCount === 1 ? '1 challenge' : `${cCount} challenges`;
  let reason: string;
  if (tierId === 'pinnacle') {
    reason = `You're juggling ${cPhrase}${highPicks.length ? ` and asked about ${list(highPicks)}` : ''} — you're well past the basics. Pinnacle gives you full Google & Meta ad management, advanced multi-step automation, and a monthly strategy call to drive growth end-to-end.`;
  } else if (tierId === 'momentum') {
    reason = `You want to capture more leads and keep them from slipping through${midPicks.length ? ` — things like ${list(midPicks)}` : ''}. Momentum's unified inbox and visual pipeline track every lead from first contact to booked job, with nurture and reactivation built in.`;
  } else {
    reason = `Right now your priority is capturing and answering every lead. Launchpad plugs those leaks — missed-call text-back, instant lead response, booking, and automated review requests — so you stop losing jobs, without paying for marketing you're not ready for yet.`;
  }

  const plan = getPlans('home-services').find((p) => p.id === tierId)!;
  return { tierId, tierName: plan.name, monthly: plan.monthly, confidence, reason };
}
