/**
 * Emergency numbers by ISO 3166-1 alpha-2 country code.
 * Sources: ITU, local government publications.
 */
export const emergencyNumbers: Record<
  string,
  { police: string; ambulance: string; fire: string; general: string }
> = {
  // ── Americas ────────────────────────────────────
  US: { police: '911', ambulance: '911', fire: '911', general: '911' },
  CA: { police: '911', ambulance: '911', fire: '911', general: '911' },
  MX: { police: '911', ambulance: '911', fire: '911', general: '911' },
  BR: { police: '190', ambulance: '192', fire: '193', general: '190' },
  AR: { police: '101', ambulance: '107', fire: '100', general: '911' },
  CL: { police: '133', ambulance: '131', fire: '132', general: '131' },
  CO: { police: '123', ambulance: '123', fire: '123', general: '123' },
  PE: { police: '105', ambulance: '116', fire: '116', general: '105' },
  VE: { police: '171', ambulance: '171', fire: '171', general: '171' },
  EC: { police: '911', ambulance: '911', fire: '911', general: '911' },
  UY: { police: '911', ambulance: '911', fire: '911', general: '911' },
  PY: { police: '911', ambulance: '911', fire: '911', general: '911' },
  BO: { police: '110', ambulance: '118', fire: '119', general: '110' },
  CR: { police: '911', ambulance: '911', fire: '911', general: '911' },
  PA: { police: '911', ambulance: '911', fire: '911', general: '911' },
  CU: { police: '106', ambulance: '104', fire: '105', general: '106' },
  DO: { police: '911', ambulance: '911', fire: '911', general: '911' },
  JM: { police: '119', ambulance: '110', fire: '110', general: '119' },
  TT: { police: '999', ambulance: '990', fire: '990', general: '999' },
  GT: { police: '110', ambulance: '128', fire: '122', general: '110' },
  HN: { police: '199', ambulance: '195', fire: '198', general: '911' },

  // ── Europe ──────────────────────────────────────
  GB: { police: '999', ambulance: '999', fire: '999', general: '112' },
  DE: { police: '110', ambulance: '112', fire: '112', general: '112' },
  FR: { police: '17', ambulance: '15', fire: '18', general: '112' },
  IT: { police: '113', ambulance: '118', fire: '115', general: '112' },
  ES: { police: '091', ambulance: '061', fire: '080', general: '112' },
  PT: { police: '112', ambulance: '112', fire: '112', general: '112' },
  NL: { police: '112', ambulance: '112', fire: '112', general: '112' },
  BE: { police: '101', ambulance: '112', fire: '112', general: '112' },
  AT: { police: '133', ambulance: '144', fire: '122', general: '112' },
  CH: { police: '117', ambulance: '144', fire: '118', general: '112' },
  SE: { police: '112', ambulance: '112', fire: '112', general: '112' },
  NO: { police: '112', ambulance: '113', fire: '110', general: '112' },
  DK: { police: '112', ambulance: '112', fire: '112', general: '112' },
  FI: { police: '112', ambulance: '112', fire: '112', general: '112' },
  IE: { police: '999', ambulance: '999', fire: '999', general: '112' },
  PL: { police: '997', ambulance: '999', fire: '998', general: '112' },
  CZ: { police: '158', ambulance: '155', fire: '150', general: '112' },
  SK: { police: '158', ambulance: '155', fire: '150', general: '112' },
  HU: { police: '107', ambulance: '104', fire: '105', general: '112' },
  RO: { police: '112', ambulance: '112', fire: '112', general: '112' },
  BG: { police: '166', ambulance: '150', fire: '160', general: '112' },
  HR: { police: '192', ambulance: '194', fire: '193', general: '112' },
  GR: { police: '100', ambulance: '166', fire: '199', general: '112' },
  RS: { police: '192', ambulance: '194', fire: '193', general: '112' },
  UA: { police: '102', ambulance: '103', fire: '101', general: '112' },
  RU: { police: '102', ambulance: '103', fire: '101', general: '112' },
  TR: { police: '155', ambulance: '112', fire: '110', general: '112' },
  IS: { police: '112', ambulance: '112', fire: '112', general: '112' },
  LU: { police: '113', ambulance: '112', fire: '112', general: '112' },
  MT: { police: '112', ambulance: '112', fire: '112', general: '112' },
  CY: { police: '112', ambulance: '112', fire: '112', general: '112' },
  EE: { police: '112', ambulance: '112', fire: '112', general: '112' },
  LV: { police: '112', ambulance: '113', fire: '112', general: '112' },
  LT: { police: '112', ambulance: '112', fire: '112', general: '112' },
  SI: { police: '113', ambulance: '112', fire: '112', general: '112' },
  BA: { police: '122', ambulance: '124', fire: '123', general: '112' },
  ME: { police: '122', ambulance: '124', fire: '123', general: '112' },
  MK: { police: '192', ambulance: '194', fire: '193', general: '112' },
  AL: { police: '129', ambulance: '127', fire: '128', general: '112' },

  // ── Asia ────────────────────────────────────────
  IN: { police: '100', ambulance: '108', fire: '101', general: '112' },
  CN: { police: '110', ambulance: '120', fire: '119', general: '110' },
  JP: { police: '110', ambulance: '119', fire: '119', general: '110' },
  KR: { police: '112', ambulance: '119', fire: '119', general: '112' },
  TH: { police: '191', ambulance: '1669', fire: '199', general: '191' },
  VN: { police: '113', ambulance: '115', fire: '114', general: '113' },
  MY: { police: '999', ambulance: '999', fire: '994', general: '999' },
  SG: { police: '999', ambulance: '995', fire: '995', general: '999' },
  ID: { police: '110', ambulance: '118', fire: '113', general: '112' },
  PH: { police: '117', ambulance: '911', fire: '911', general: '911' },
  BD: { police: '999', ambulance: '999', fire: '199', general: '999' },
  PK: { police: '15', ambulance: '115', fire: '16', general: '15' },
  LK: { police: '119', ambulance: '110', fire: '110', general: '119' },
  NP: { police: '100', ambulance: '102', fire: '101', general: '100' },
  MM: { police: '199', ambulance: '192', fire: '191', general: '199' },
  KH: { police: '117', ambulance: '119', fire: '118', general: '117' },
  LA: { police: '191', ambulance: '195', fire: '190', general: '191' },
  TW: { police: '110', ambulance: '119', fire: '119', general: '110' },
  HK: { police: '999', ambulance: '999', fire: '999', general: '999' },
  MO: { police: '999', ambulance: '999', fire: '999', general: '999' },
  MN: { police: '102', ambulance: '103', fire: '101', general: '102' },
  KZ: { police: '102', ambulance: '103', fire: '101', general: '112' },
  UZ: { police: '102', ambulance: '103', fire: '101', general: '112' },
  GE: { police: '112', ambulance: '112', fire: '112', general: '112' },
  AM: { police: '102', ambulance: '103', fire: '101', general: '112' },
  AZ: { police: '102', ambulance: '103', fire: '101', general: '112' },

  // ── Middle East ─────────────────────────────────
  AE: { police: '999', ambulance: '998', fire: '997', general: '999' },
  SA: { police: '999', ambulance: '997', fire: '998', general: '911' },
  QA: { police: '999', ambulance: '999', fire: '999', general: '999' },
  KW: { police: '112', ambulance: '112', fire: '112', general: '112' },
  BH: { police: '999', ambulance: '999', fire: '999', general: '999' },
  OM: { police: '9999', ambulance: '9999', fire: '9999', general: '9999' },
  JO: { police: '911', ambulance: '911', fire: '911', general: '911' },
  LB: { police: '112', ambulance: '140', fire: '175', general: '112' },
  IL: { police: '100', ambulance: '101', fire: '102', general: '100' },
  IQ: { police: '104', ambulance: '122', fire: '115', general: '104' },
  IR: { police: '110', ambulance: '115', fire: '125', general: '112' },

  // ── Africa ──────────────────────────────────────
  ZA: { police: '10111', ambulance: '10177', fire: '10177', general: '112' },
  EG: { police: '122', ambulance: '123', fire: '180', general: '122' },
  MA: { police: '19', ambulance: '15', fire: '15', general: '19' },
  TN: { police: '197', ambulance: '190', fire: '198', general: '197' },
  KE: { police: '999', ambulance: '999', fire: '999', general: '112' },
  NG: { police: '112', ambulance: '112', fire: '112', general: '112' },
  GH: { police: '191', ambulance: '193', fire: '192', general: '112' },
  TZ: { police: '112', ambulance: '114', fire: '112', general: '112' },
  ET: { police: '991', ambulance: '907', fire: '939', general: '911' },
  SN: { police: '17', ambulance: '15', fire: '18', general: '17' },
  CI: { police: '110', ambulance: '185', fire: '180', general: '110' },
  CM: { police: '117', ambulance: '119', fire: '118', general: '112' },
  UG: { police: '999', ambulance: '911', fire: '112', general: '112' },
  RW: { police: '112', ambulance: '912', fire: '112', general: '112' },
  MU: { police: '999', ambulance: '114', fire: '115', general: '999' },
  MG: { police: '117', ambulance: '124', fire: '118', general: '117' },

  // ── Oceania ─────────────────────────────────────
  AU: { police: '000', ambulance: '000', fire: '000', general: '000' },
  NZ: { police: '111', ambulance: '111', fire: '111', general: '111' },
  FJ: { police: '917', ambulance: '911', fire: '910', general: '911' },
  PG: { police: '112', ambulance: '112', fire: '112', general: '112' },
};

/**
 * Get emergency numbers for a given country code.
 * Falls back to 112 (international standard) if country not found.
 */
export function getEmergencyNumbersForCountry(countryCode: string) {
  const code = countryCode.toUpperCase();
  return (
    emergencyNumbers[code] || {
      police: '112',
      ambulance: '112',
      fire: '112',
      general: '112',
    }
  );
}
