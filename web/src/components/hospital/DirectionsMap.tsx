'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Navigation, MapPin, Clock, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DirectionsMapProps {
  hospitalLat: number;
  hospitalLng: number;
  hospitalName: string;
  className?: string;
}

interface RouteInfo {
  distance: number; // meters
  duration: number; // seconds
  geometry: { type: string; coordinates: [number, number][] };
}

export function DirectionsMap({ hospitalLat, hospitalLng, hospitalName, className }: DirectionsMapProps) {
  const { latitude: userLat, longitude: userLng, error: geoError, isLoading: geoLoading } = useGeolocation();
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch route from OSRM when user location is available
  useEffect(() => {
    if (!userLat || !userLng) return;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${hospitalLng},${hospitalLat}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes?.length > 0) {
          const route = data.routes[0];
          setRouteInfo({
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry,
          });
        } else {
          setRouteError('Could not calculate route. The destination may not be reachable by road.');
        }
      } catch {
        setRouteError('Failed to fetch route. Please try again later.');
      }
    };

    fetchRoute();
  }, [userLat, userLng, hospitalLat, hospitalLng]);

  const googleMapsDirectionsUrl = userLat && userLng
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${hospitalLat},${hospitalLng}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${hospitalLat},${hospitalLng}`;

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} min`;
  };

  if (!isClient) {
    return (
      <div className={cn('bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center min-h-[400px]', className)}>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Route info bar */}
      {routeInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatDistance(routeInfo.distance)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatDuration(routeInfo.duration)}
              </span>
            </div>
          </div>
          <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm" icon={<Navigation className="h-4 w-4" />}>
              Open in Google Maps
            </Button>
          </a>
        </div>
      )}

      {/* No location message */}
      {!userLat && !geoLoading && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-center gap-3">
          <LocateFixed className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Allow location access to see directions and route to this hospital.
            </p>
            {geoError && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{geoError}</p>
            )}
          </div>
          <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">Open in Google Maps</Button>
          </a>
        </div>
      )}

      {routeError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-sm text-red-700 dark:text-red-300">{routeError}</p>
        </div>
      )}

      {/* Map */}
      <DirectionsMapContent
        hospitalLat={hospitalLat}
        hospitalLng={hospitalLng}
        hospitalName={hospitalName}
        userLat={userLat}
        userLng={userLng}
        routeGeometry={routeInfo?.geometry || null}
      />
    </div>
  );
}

function DirectionsMapContent({
  hospitalLat,
  hospitalLng,
  hospitalName,
  userLat,
  userLng,
  routeGeometry,
}: {
  hospitalLat: number;
  hospitalLng: number;
  hospitalName: string;
  userLat: number | null;
  userLng: number | null;
  routeGeometry: RouteInfo['geometry'] | null;
}) {
  const [leafletModules, setLeafletModules] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const L = await import('leaflet');
      const RL = await import('react-leaflet');

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const hospitalIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      const userIcon = new L.DivIcon({
        html: `<div style="width:18px;height:18px;background:#2563EB;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        className: '',
      });

      setLeafletModules({ L, RL, hospitalIcon, userIcon });
    })();
  }, []);

  // Fit bounds and draw route when data changes
  useEffect(() => {
    if (!mapRef.current || !leafletModules) return;
    const map = mapRef.current;
    const { L } = leafletModules;

    const points: [number, number][] = [[hospitalLat, hospitalLng]];
    if (userLat && userLng) {
      points.push([userLat, userLng]);
    }

    if (points.length > 1) {
      const bounds = L.latLngBounds(points.map((p: [number, number]) => L.latLng(p[0], p[1])));
      try {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      } catch {
        // fitBounds can fail with invalid bounds
      }
    } else {
      map.setView([hospitalLat, hospitalLng], 14);
    }
  }, [hospitalLat, hospitalLng, userLat, userLng, leafletModules]);

  if (!leafletModules) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  const { RL, hospitalIcon, userIcon, L } = leafletModules;
  const { MapContainer, TileLayer, Marker, Popup, Polyline } = RL;

  // Convert GeoJSON coordinates [lng, lat] to Leaflet [lat, lng]
  const routePositions = routeGeometry
    ? routeGeometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
    : [];

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <MapContainer
        center={[hospitalLat, hospitalLng]}
        zoom={14}
        style={{ height: '400px', width: '100%' }}
        className="z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hospital marker */}
        <Marker position={[hospitalLat, hospitalLng]} icon={hospitalIcon}>
          <Popup>
            <div className="p-1">
              <p className="font-semibold text-sm">{hospitalName}</p>
              <p className="text-xs text-gray-500">Destination</p>
            </div>
          </Popup>
        </Marker>

        {/* User location marker */}
        {userLat && userLng && (
          <Marker position={[userLat, userLng]} icon={userIcon}>
            <Popup>
              <div className="p-1 text-center">
                <p className="font-semibold text-sm text-primary-600">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route polyline */}
        {routePositions.length > 0 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#2563EB', weight: 5, opacity: 0.7 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
