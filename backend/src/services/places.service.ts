import { logger } from '../config/logger';

interface NearbyHospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  phone?: string;
  website?: string;
  isEmergencyCapable: boolean;
  distance: number;
  source: 'osm';
  tags?: Record<string, string>;
}

// Haversine distance in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function findNearbyHospitals(
  latitude: number,
  longitude: number,
  radiusMeters: number = 10000,
  limit: number = 20
): Promise<NearbyHospital[]> {
  try {
    // Overpass API query - simplified for speed
    const query = `[out:json][timeout:15];(node["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});node["amenity"="clinic"](around:${radiusMeters},${latitude},${longitude}););out body ${limit * 2};`;

    // Try multiple Overpass API mirrors for reliability
    const mirrors = [
      'https://overpass.kumi.systems/api/interpreter',
      'https://overpass-api.de/api/interpreter',
    ];

    let data: any = null;
    for (const mirror of mirrors) {
      try {
        const response = await fetch(mirror, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
          signal: AbortSignal.timeout(12000),
        });
        if (response.ok) {
          data = await response.json();
          break;
        }
        logger.warn(`Overpass mirror ${mirror} returned ${response.status}`);
      } catch (err) {
        logger.warn(`Overpass mirror ${mirror} failed: ${err}`);
      }
    }

    if (!data || !data.elements) {
      logger.warn('All Overpass mirrors failed');
      return [];
    }

    const hospitals: NearbyHospital[] = data.elements
      .filter((el: any) => el.tags?.name) // Must have a name
      .map((el: any) => {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        if (!lat || !lon) return null;

        const dist = haversineDistance(latitude, longitude, lat, lon);
        const tags = el.tags || {};

        return {
          id: `osm-${el.id}`,
          name: tags.name,
          latitude: lat,
          longitude: lon,
          address: [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ') || tags['addr:full'] || '',
          city: tags['addr:city'] || tags['addr:suburb'] || '',
          country: tags['addr:country'] || '',
          phone: tags.phone || tags['contact:phone'] || undefined,
          website: tags.website || tags['contact:website'] || undefined,
          isEmergencyCapable: tags.emergency === 'yes' || tags['emergency'] !== undefined || tags.amenity === 'hospital',
          distance: Math.round(dist * 100) / 100,
          source: 'osm' as const,
          tags: {
            type: tags.amenity || tags.healthcare || 'hospital',
            ...(tags['opening_hours'] ? { openingHours: tags['opening_hours'] } : {}),
            ...(tags.operator ? { operator: tags.operator } : {}),
            ...(tags['healthcare:speciality'] ? { speciality: tags['healthcare:speciality'] } : {}),
          },
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, limit);

    logger.info(`Found ${hospitals.length} hospitals near ${latitude},${longitude} within ${radiusMeters}m`);
    return hospitals;
  } catch (error) {
    logger.error('Failed to fetch nearby hospitals from Overpass:', error);
    return [];
  }
}

/**
 * Fetch a specific hospital/clinic from OpenStreetMap by its OSM node ID.
 * Returns a Hospital-shaped object that the frontend can render on the detail page.
 */
export async function fetchOsmHospitalById(osmId: string): Promise<any | null> {
  const mirrors = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter',
  ];

  // Try node first (most hospitals are nodes), fallback to way
  const query = `[out:json][timeout:10];node(${osmId});out body;`;

  let data: any = null;
  for (const mirror of mirrors) {
    try {
      const response = await fetch(mirror, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        data = await response.json();
        break;
      }
    } catch {
      continue;
    }
  }

  if (!data?.elements?.length) return null;

  const el = data.elements[0];
  const tags = el.tags || {};
  const lat = el.lat || el.center?.lat;
  const lon = el.lon || el.center?.lon;
  if (!lat || !lon) return null;

  // Build a Hospital-shaped object matching what the frontend expects
  return {
    id: `osm-${el.id}`,
    name: tags.name || 'Unknown Hospital',
    slug: `osm-${el.id}`,
    description: [
      tags.description,
      tags.operator ? `Operated by ${tags.operator}` : null,
      tags['healthcare:speciality'] ? `Specialties: ${tags['healthcare:speciality'].replace(/;/g, ', ')}` : null,
      tags.amenity === 'hospital' ? 'Hospital' : tags.amenity === 'clinic' ? 'Clinic' : 'Healthcare Facility',
    ].filter(Boolean).join('. '),
    address: [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ') || tags['addr:full'] || tags['addr:place'] || '',
    city: tags['addr:city'] || tags['addr:suburb'] || tags['addr:district'] || '',
    country: tags['addr:country'] || '',
    latitude: lat,
    longitude: lon,
    phone: tags.phone || tags['contact:phone'] || null,
    email: tags.email || tags['contact:email'] || null,
    website: tags.website || tags['contact:website'] || null,
    coverImage: null,
    images: [],
    isVerified: false,
    isEmergencyCapable: tags.emergency === 'yes' || tags.amenity === 'hospital',
    availabilityStatus: tags.opening_hours === '24/7' ? 'OPEN' : 'OPEN',
    rating: 0,
    reviewCount: 0,
    adminUserId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    languages: [],
    specialties: tags['healthcare:speciality']
      ? tags['healthcare:speciality'].split(';').map((s: string) => s.trim())
      : [],
    doctors: [],
    pricing: [],
    reviews: [],
    source: 'osm',
    // Extra OSM-specific data
    osmTags: {
      openingHours: tags.opening_hours || null,
      operator: tags.operator || null,
      beds: tags.beds || null,
      wheelchair: tags.wheelchair || null,
      internetAccess: tags.internet_access || null,
    },
  };
}
