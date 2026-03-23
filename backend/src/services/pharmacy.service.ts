import { logger } from '../config/logger';
import { ApiError } from '../utils/ApiError';
import { findMedicineEquivalent } from '../data/medicine-equivalents';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

interface PharmacyResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  phone?: string;
  openingHours?: string;
  website?: string;
  distance?: number;
}

/**
 * Haversine distance in km.
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class PharmacyService {
  /**
   * Find nearby pharmacies using the Overpass API (OpenStreetMap).
   */
  async findNearby(lat: number, lng: number, radiusMeters: number = 5000): Promise<PharmacyResult[]> {
    try {
      const query = `
        [out:json][timeout:15];
        (
          node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
          way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
        );
        out center body;
      `.trim();

      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        logger.warn(`Overpass API returned ${response.status}`);
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data: any = await response.json();
      const elements = data.elements || [];

      const pharmacies: PharmacyResult[] = elements.map((el: any) => {
        const latitude = el.lat || el.center?.lat;
        const longitude = el.lon || el.center?.lon;
        const tags = el.tags || {};

        return {
          id: el.id,
          name: tags.name || tags['name:en'] || 'Pharmacy',
          latitude,
          longitude,
          address: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']]
            .filter(Boolean)
            .join(', ') || undefined,
          phone: tags.phone || tags['contact:phone'] || undefined,
          openingHours: tags.opening_hours || undefined,
          website: tags.website || tags['contact:website'] || undefined,
          distance: haversineDistance(lat, lng, latitude, longitude),
        };
      });

      // Sort by distance
      pharmacies.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return pharmacies;
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        logger.warn('Overpass API request timed out');
        throw ApiError.internal('Pharmacy search timed out. Please try again.');
      }
      logger.error('Error finding pharmacies:', error);
      throw ApiError.internal('Failed to find nearby pharmacies');
    }
  }

  /**
   * Find medicine equivalent name in another country.
   */
  findMedicineEquivalent(medicineName: string, countryCode?: string) {
    if (!medicineName || medicineName.trim().length < 2) {
      throw ApiError.badRequest('Medicine name must be at least 2 characters');
    }

    const results = findMedicineEquivalent(medicineName, countryCode);

    if (results.length === 0) {
      return {
        query: medicineName,
        targetCountry: countryCode || 'all',
        results: [],
        message: 'No equivalent found. Please consult a local pharmacist.',
      };
    }

    return {
      query: medicineName,
      targetCountry: countryCode || 'all',
      results: results.map((med) => ({
        generic: med.generic,
        category: med.category,
        brandNames: med.brandNames,
      })),
    };
  }
}

export const pharmacyService = new PharmacyService();
