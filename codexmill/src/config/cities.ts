/**
 * Curated, offline city list for the City/State autocomplete (no API/backend).
 * Each entry is tagged with a CountryCode so the form can match it against the
 * selected phone country. Covers the supported markets (US heavy, + CA/GB/AU).
 *
 * TODO[Ray]: expand this list anytime — it's just data. (Note: a few names like
 * "London" appear in two countries, which is exactly why selections carry a code.)
 */
import type { CountryCode } from './countries';

export interface City {
  city: string;
  /** state / province / region */
  region: string;
  country: CountryCode;
}

const US: [string, string][] = [
  ['New York', 'NY'], ['Los Angeles', 'CA'], ['Chicago', 'IL'], ['Houston', 'TX'], ['Phoenix', 'AZ'],
  ['Philadelphia', 'PA'], ['San Antonio', 'TX'], ['San Diego', 'CA'], ['Dallas', 'TX'], ['Austin', 'TX'],
  ['San Jose', 'CA'], ['Jacksonville', 'FL'], ['Fort Worth', 'TX'], ['Columbus', 'OH'], ['Charlotte', 'NC'],
  ['Indianapolis', 'IN'], ['San Francisco', 'CA'], ['Seattle', 'WA'], ['Denver', 'CO'], ['Nashville', 'TN'],
  ['Oklahoma City', 'OK'], ['Boston', 'MA'], ['Las Vegas', 'NV'], ['Portland', 'OR'], ['Detroit', 'MI'],
  ['Memphis', 'TN'], ['Louisville', 'KY'], ['Baltimore', 'MD'], ['Milwaukee', 'WI'], ['Albuquerque', 'NM'],
  ['Tucson', 'AZ'], ['Fresno', 'CA'], ['Sacramento', 'CA'], ['Kansas City', 'MO'], ['Mesa', 'AZ'],
  ['Atlanta', 'GA'], ['Omaha', 'NE'], ['Raleigh', 'NC'], ['Miami', 'FL'], ['Tampa', 'FL'],
  ['Orlando', 'FL'], ['Minneapolis', 'MN'], ['Cleveland', 'OH'], ['Pittsburgh', 'PA'], ['Cincinnati', 'OH'],
  ['St. Louis', 'MO'], ['Salt Lake City', 'UT'], ['Charleston', 'SC'], ['Richmond', 'VA'], ['Boise', 'ID'],
];

const CA: [string, string][] = [
  ['Toronto', 'ON'], ['Montreal', 'QC'], ['Vancouver', 'BC'], ['Calgary', 'AB'], ['Edmonton', 'AB'],
  ['Ottawa', 'ON'], ['Winnipeg', 'MB'], ['Quebec City', 'QC'], ['Hamilton', 'ON'], ['Halifax', 'NS'],
  ['Victoria', 'BC'], ['Saskatoon', 'SK'], ['Regina', 'SK'], ['London', 'ON'], ['Kitchener', 'ON'],
];

const GB: [string, string][] = [
  ['London', 'England'], ['Birmingham', 'England'], ['Manchester', 'England'], ['Glasgow', 'Scotland'],
  ['Liverpool', 'England'], ['Leeds', 'England'], ['Edinburgh', 'Scotland'], ['Bristol', 'England'],
  ['Cardiff', 'Wales'], ['Sheffield', 'England'], ['Newcastle', 'England'], ['Belfast', 'Northern Ireland'],
  ['Nottingham', 'England'], ['Leicester', 'England'], ['Brighton', 'England'],
];

const AU: [string, string][] = [
  ['Sydney', 'NSW'], ['Melbourne', 'VIC'], ['Brisbane', 'QLD'], ['Perth', 'WA'], ['Adelaide', 'SA'],
  ['Gold Coast', 'QLD'], ['Canberra', 'ACT'], ['Newcastle', 'NSW'], ['Wollongong', 'NSW'], ['Hobart', 'TAS'],
  ['Geelong', 'VIC'], ['Darwin', 'NT'], ['Cairns', 'QLD'], ['Townsville', 'QLD'], ['Sunshine Coast', 'QLD'],
];

const build = (rows: [string, string][], country: CountryCode): City[] =>
  rows.map(([city, region]) => ({ city, region, country }));

export const CITIES: City[] = [
  ...build(US, 'US'),
  ...build(CA, 'CA'),
  ...build(GB, 'GB'),
  ...build(AU, 'AU'),
];

/** Country suffix used in the display label. */
const COUNTRY_LABEL: Record<CountryCode, string> = { US: 'USA', CA: 'Canada', GB: 'UK', AU: 'Australia' };

/** Human label, e.g. "Austin, TX, USA" / "London, ON, Canada". */
export const cityLabel = (c: City): string => `${c.city}, ${c.region}, ${COUNTRY_LABEL[c.country]}`;

/** Match cities whose name starts with the query first, then contains it. */
export function searchCities(query: string, limit = 8): City[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const starts: City[] = [];
  const contains: City[] = [];
  for (const c of CITIES) {
    const name = c.city.toLowerCase();
    if (name.startsWith(q)) starts.push(c);
    else if (name.includes(q)) contains.push(c);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}
