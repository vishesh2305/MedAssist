import { logger } from '../config/logger';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

interface PlaceDetails {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string; // Google Maps URL
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  photos?: { photo_reference: string; width: number; height: number }[];
  reviews?: {
    author_name: string;
    rating: number;
    text: string;
    time: number;
    profile_photo_url?: string;
    relative_time_description: string;
  }[];
  geometry?: {
    location: { lat: number; lng: number };
  };
  types?: string[];
  business_status?: string;
  place_id?: string;
}

/**
 * Search for a hospital on Google Places by name + coordinates.
 * Returns enriched data including phone, website, reviews, photos.
 */
export async function enrichHospitalWithGoogleData(
  hospitalName: string,
  latitude: number,
  longitude: number
): Promise<PlaceDetails | null> {
  if (!GOOGLE_API_KEY) {
    return null; // No API key configured
  }

  try {
    // Step 1: Find the place using text search near the coordinates
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(hospitalName)}&inputtype=textquery&locationbias=circle:2000@${latitude},${longitude}&fields=place_id&key=${GOOGLE_API_KEY}`;

    const searchResponse = await fetch(searchUrl, { signal: AbortSignal.timeout(8000) });
    const searchData: any = await searchResponse.json();

    if (!searchData.candidates?.length) {
      logger.debug(`No Google Places match for "${hospitalName}"`);
      return null;
    }

    const placeId = searchData.candidates[0].place_id;

    // Step 2: Get full place details
    const detailFields = 'name,formatted_address,formatted_phone_number,international_phone_number,website,url,rating,user_ratings_total,opening_hours,photos,reviews,geometry,types,business_status,place_id';
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${detailFields}&key=${GOOGLE_API_KEY}`;

    const detailResponse = await fetch(detailUrl, { signal: AbortSignal.timeout(8000) });
    const detailData: any = await detailResponse.json();

    if (detailData.result) {
      return detailData.result as PlaceDetails;
    }
    return null;
  } catch (error) {
    logger.warn(`Google Places API error for "${hospitalName}": ${error}`);
    return null;
  }
}

/**
 * Get a Google Places photo URL.
 */
export function getPhotoUrl(photoReference: string, maxWidth: number = 800): string {
  if (!GOOGLE_API_KEY) return '';
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

/**
 * Generate a Google Maps URL for directions.
 * This works WITHOUT an API key - just opens Google Maps.
 */
export function getDirectionsUrl(
  destLat: number,
  destLng: number,
  destName: string,
  originLat?: number,
  originLng?: number
): string {
  const destination = `${destLat},${destLng}`;
  const origin = originLat && originLng ? `${originLat},${originLng}` : '';
  if (origin) {
    return `https://www.google.com/maps/dir/${origin}/${destination}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destName)}&query_place_id=`;
}

/**
 * Check if Google Places API is available.
 */
export function isGooglePlacesAvailable(): boolean {
  return !!GOOGLE_API_KEY;
}
