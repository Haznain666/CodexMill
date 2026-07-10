/**
 * Supported countries for the discovery form's phone + City/State fields.
 * Phone formatting/validation is per-country; the City/State autocomplete
 * (cities.ts) tags each city with one of these codes so the two can be matched.
 */
export type CountryCode = 'US' | 'CA' | 'GB' | 'AU';

export interface Country {
  code: CountryCode;
  name: string;
  /** label shown in the compact phone-country select */
  short: string;
  dial: string;
  placeholder: string;
  minDigits: number;
  maxDigits: number;
}

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', short: 'US', dial: '+1', placeholder: '(555) 123-4567', minDigits: 10, maxDigits: 10 },
  { code: 'CA', name: 'Canada', short: 'CA', dial: '+1', placeholder: '(416) 555-0199', minDigits: 10, maxDigits: 10 },
  { code: 'GB', name: 'United Kingdom', short: 'UK', dial: '+44', placeholder: '07700 900123', minDigits: 10, maxDigits: 11 },
  { code: 'AU', name: 'Australia', short: 'AU', dial: '+61', placeholder: '0412 345 678', minDigits: 9, maxDigits: 10 },
];

export const countryByCode = (code: string): Country | undefined =>
  COUNTRIES.find((c) => c.code === code);

/** Friendly name for messages (e.g. "the US", "the UK"). */
export const countryName = (code: string): string => countryByCode(code)?.name ?? code;

/** Progressive formatting as the user types (keeps the () and - per country). */
export function formatPhone(code: string, raw: string): string {
  const c = countryByCode(code);
  if (!c) return raw;
  const d = raw.replace(/\D/g, '').slice(0, c.maxDigits);
  switch (code) {
    case 'US':
    case 'CA':
      if (d.length === 0) return '';
      if (d.length <= 3) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    case 'GB':
      if (d.length <= 5) return d;
      return `${d.slice(0, 5)} ${d.slice(5, 11)}`;
    case 'AU':
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 10)}`;
    default:
      return d;
  }
}

/** Valid when the digit count fits the selected country's range. */
export function validatePhone(code: string, value: string): boolean {
  const c = countryByCode(code);
  if (!c) return false;
  const d = value.replace(/\D/g, '');
  return d.length >= c.minDigits && d.length <= c.maxDigits;
}
