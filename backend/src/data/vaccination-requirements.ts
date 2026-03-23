/**
 * Vaccination requirements and recommendations by country code.
 * Based on WHO and CDC travel health guidelines.
 */

export interface VaccinationInfo {
  name: string;
  type: 'required' | 'recommended';
  notes?: string;
}

export const vaccinationRequirements: Record<string, VaccinationInfo[]> = {
  // ── Africa ──────────────────────────────────────
  KE: [
    { name: 'Yellow Fever', type: 'required', notes: 'Required if arriving from endemic area' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Meningococcal', type: 'recommended', notes: 'Especially during dry season' },
    { name: 'Rabies', type: 'recommended', notes: 'If extended outdoor activities planned' },
    { name: 'Cholera', type: 'recommended', notes: 'If visiting rural areas' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Required in most areas' },
  ],
  NG: [
    { name: 'Yellow Fever', type: 'required' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Meningococcal', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Cholera', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
    { name: 'Polio', type: 'recommended' },
  ],
  ZA: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended', notes: 'If visiting wildlife areas' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Limpopo, Mpumalanga, KwaZulu-Natal' },
  ],
  EG: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Polio', type: 'recommended', notes: 'Booster recommended' },
  ],
  TZ: [
    { name: 'Yellow Fever', type: 'required', notes: 'Required if arriving from endemic area' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Cholera', type: 'recommended' },
    { name: 'Meningococcal', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
  ],
  GH: [
    { name: 'Yellow Fever', type: 'required' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Meningococcal', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
  ],
  ET: [
    { name: 'Yellow Fever', type: 'required' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Meningococcal', type: 'recommended' },
    { name: 'Cholera', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
    { name: 'Polio', type: 'recommended' },
  ],
  MA: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
  ],
  SN: [
    { name: 'Yellow Fever', type: 'required' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Meningococcal', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
  ],
  UG: [
    { name: 'Yellow Fever', type: 'required' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Cholera', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
  ],
  RW: [
    { name: 'Yellow Fever', type: 'required', notes: 'If arriving from endemic area' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
  ],

  // ── Asia ────────────────────────────────────────
  IN: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended', notes: 'If visiting rural areas' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Cholera', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'In many regions' },
    { name: 'Polio', type: 'recommended', notes: 'Booster recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  TH: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended', notes: 'If visiting rural areas' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Border areas only' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  VN: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Rural/forest areas' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  ID: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Outside Bali/Jakarta' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  PH: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Rural areas' },
  ],
  MY: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended', notes: 'Rural Sarawak' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  CN: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Yunnan, Hainan provinces' },
    { name: 'Polio', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  JP: [
    { name: 'Japanese Encephalitis', type: 'recommended', notes: 'If extended rural stay' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
  ],
  KR: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended', notes: 'If rural areas' },
    { name: 'Typhoid', type: 'recommended' },
  ],
  SG: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  BD: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Cholera', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
  ],
  PK: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Polio', type: 'required', notes: 'OPV required to exit country' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
  ],
  NP: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended', notes: 'Terai region' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Terai region' },
  ],
  LK: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  KH: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Forest/border areas' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  MM: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
    { name: 'Polio', type: 'recommended' },
  ],

  // ── Middle East ─────────────────────────────────
  AE: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
  ],
  SA: [
    { name: 'Meningococcal ACWY', type: 'required', notes: 'Required for Hajj/Umrah pilgrims' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'If arriving from endemic country' },
    { name: 'Polio', type: 'required', notes: 'Required for pilgrims from certain countries' },
  ],
  JO: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
  ],
  TR: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
  ],
  IL: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
  ],

  // ── Americas ────────────────────────────────────
  BR: [
    { name: 'Yellow Fever', type: 'recommended', notes: 'Required for certain states' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Amazon region' },
  ],
  MX: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Some rural areas' },
  ],
  CO: [
    { name: 'Yellow Fever', type: 'recommended', notes: 'Required for certain areas' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Rural areas below 1700m' },
  ],
  PE: [
    { name: 'Yellow Fever', type: 'recommended', notes: 'Amazon/jungle areas' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Amazon region' },
  ],
  AR: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Yellow Fever', type: 'recommended', notes: 'Northern provinces only' },
  ],
  CR: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Limon province' },
  ],
  CU: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
  ],
  EC: [
    { name: 'Yellow Fever', type: 'recommended', notes: 'Eastern lowlands' },
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Below 1500m' },
  ],

  // ── Europe (minimal requirements) ───────────────
  GB: [
    { name: 'Routine boosters', type: 'recommended', notes: 'Ensure routine vaccinations are up to date' },
  ],
  FR: [
    { name: 'Routine boosters', type: 'recommended', notes: 'Ensure routine vaccinations are up to date' },
  ],
  DE: [
    { name: 'Tick-borne Encephalitis', type: 'recommended', notes: 'If hiking in southern forests' },
  ],
  IT: [
    { name: 'Routine boosters', type: 'recommended', notes: 'Ensure routine vaccinations are up to date' },
  ],
  ES: [
    { name: 'Routine boosters', type: 'recommended', notes: 'Ensure routine vaccinations are up to date' },
  ],
  GR: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Routine boosters', type: 'recommended' },
  ],
  PT: [
    { name: 'Routine boosters', type: 'recommended' },
  ],
  CZ: [
    { name: 'Tick-borne Encephalitis', type: 'recommended', notes: 'If outdoor activities in forested areas' },
  ],
  AT: [
    { name: 'Tick-borne Encephalitis', type: 'recommended', notes: 'Forested areas' },
  ],
  SE: [
    { name: 'Tick-borne Encephalitis', type: 'recommended', notes: 'Coastal and lake areas' },
  ],
  RU: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Tick-borne Encephalitis', type: 'recommended', notes: 'Siberia, far east' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
  ],

  // ── Oceania ─────────────────────────────────────
  AU: [
    { name: 'Routine boosters', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  NZ: [
    { name: 'Routine boosters', type: 'recommended' },
  ],
  FJ: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  PG: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Japanese Encephalitis', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],

  // ── North America / Caribbean ───────────────────
  US: [
    { name: 'Routine boosters', type: 'recommended', notes: 'Ensure routine vaccinations are up to date' },
  ],
  CA: [
    { name: 'Routine boosters', type: 'recommended' },
  ],
  JM: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Yellow Fever', type: 'required', notes: 'Only if arriving from endemic country' },
  ],
  DO: [
    { name: 'Hepatitis A', type: 'recommended' },
    { name: 'Hepatitis B', type: 'recommended' },
    { name: 'Typhoid', type: 'recommended' },
    { name: 'Rabies', type: 'recommended' },
    { name: 'Malaria prophylaxis', type: 'recommended', notes: 'Some rural areas' },
  ],
};

/**
 * Returns vaccination requirements for a country.
 * Returns a general advisory if country is not in the database.
 */
export function getVaccinationsForCountry(countryCode: string): VaccinationInfo[] {
  const code = countryCode.toUpperCase();
  return (
    vaccinationRequirements[code] || [
      {
        name: 'Routine boosters',
        type: 'recommended' as const,
        notes: 'Ensure routine vaccinations (MMR, DPT, Polio) are up to date. Check with your physician for country-specific advice.',
      },
    ]
  );
}
