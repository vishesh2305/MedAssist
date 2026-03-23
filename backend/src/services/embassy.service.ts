import { findEmbassies, findAllEmbassiesByNationality, findAllEmbassiesInCountry } from '../data/embassy-directory';
import { getEmergencyNumbersForCountry } from '../data/emergency-numbers';
import { ApiError } from '../utils/ApiError';

export class EmbassyService {
  /**
   * Find embassy/consulate for a nationality in a specific country.
   */
  findByNationality(nationalityCode: string, countryCode: string) {
    if (!nationalityCode || !countryCode) {
      throw ApiError.badRequest('Both nationality code and country code are required');
    }

    const embassies = findEmbassies(nationalityCode, countryCode);

    return {
      nationalityCode: nationalityCode.toUpperCase(),
      hostCountryCode: countryCode.toUpperCase(),
      results: embassies,
      count: embassies.length,
      note: embassies.length === 0
        ? 'No embassy/consulate found. Contact your Ministry of Foreign Affairs for assistance.'
        : undefined,
    };
  }

  /**
   * Find all embassies for a nationality worldwide.
   */
  findAllByNationality(nationalityCode: string) {
    const embassies = findAllEmbassiesByNationality(nationalityCode);
    return {
      nationalityCode: nationalityCode.toUpperCase(),
      results: embassies,
      count: embassies.length,
    };
  }

  /**
   * Find all embassies in a given country.
   */
  findAllInCountry(countryCode: string) {
    const embassies = findAllEmbassiesInCountry(countryCode);
    return {
      hostCountryCode: countryCode.toUpperCase(),
      results: embassies,
      count: embassies.length,
    };
  }

  /**
   * Get emergency contacts for a country (police, ambulance, fire, embassy hotlines).
   */
  getEmergencyContacts(countryCode: string) {
    const numbers = getEmergencyNumbersForCountry(countryCode);

    return {
      countryCode: countryCode.toUpperCase(),
      emergencyNumbers: numbers,
      tips: [
        'In most European countries, 112 works as a universal emergency number.',
        'When calling emergency services, state your location first.',
        'If you cannot speak the local language, ask for an English-speaking operator.',
        'Contact your embassy for non-emergency consular assistance.',
      ],
    };
  }
}

export const embassyService = new EmbassyService();
