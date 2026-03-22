'use client';

import React, { useEffect, useState, useRef } from 'react';
import type { Hospital } from '@/types';
import { cn } from '@/lib/utils';

interface HospitalMapProps {
  hospitals: Hospital[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMarkerClick?: (hospital: Hospital) => void;
  selectedHospital?: string;
  userLocation?: [number, number];
}

export function HospitalMap({
  hospitals,
  center = [20, 0],
  zoom = 3,
  className,
  onMarkerClick,
  selectedHospital,
  userLocation,
}: HospitalMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={cn('bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center', className)}>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContent
      hospitals={hospitals}
      center={center}
      zoom={zoom}
      className={className}
      onMarkerClick={onMarkerClick}
      selectedHospital={selectedHospital}
      userLocation={userLocation}
    />
  );
}

function MapContent({ hospitals, center, zoom, className, onMarkerClick, selectedHospital, userLocation }: HospitalMapProps) {
  const [leafletModules, setLeafletModules] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const L = await import('leaflet');
      const RL = await import('react-leaflet');

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Create custom icons
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

  // Auto-fit bounds when hospitals or user location changes
  useEffect(() => {
    if (!mapRef.current || !leafletModules) return;
    const map = mapRef.current;
    const { L } = leafletModules;

    const points: [number, number][] = [];
    if (userLocation) {
      points.push(userLocation);
    }
    hospitals.forEach((h) => {
      if (h.latitude != null && h.longitude != null) {
        points.push([h.latitude, h.longitude]);
      }
    });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p: [number, number]) => L.latLng(p[0], p[1])));
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch {
        // fitBounds can fail with invalid bounds
      }
    }
  }, [hospitals, userLocation, leafletModules]);

  if (!leafletModules) {
    return (
      <div className={cn('bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center min-h-[400px]', className)}>
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  const { RL, hospitalIcon, userIcon } = leafletModules;
  const { MapContainer, TileLayer, Marker, Popup, CircleMarker } = RL;

  return (
    <div className={cn('rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700', className)}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <MapContainer
        center={userLocation || center || [20, 0]}
        zoom={userLocation ? 13 : (zoom || 3)}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        className="z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="p-1 text-center">
                <p className="font-semibold text-sm text-primary-600">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hospital markers */}
        {hospitals.map((hospital) => {
          if (hospital.latitude == null || hospital.longitude == null) return null;
          const isSelected = selectedHospital === hospital.id;
          return (
            <Marker
              key={hospital.id}
              position={[hospital.latitude, hospital.longitude]}
              icon={hospitalIcon}
              eventHandlers={{
                click: () => onMarkerClick?.(hospital),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-1">{hospital.name}</h3>
                  {(hospital.city || hospital.country) && (
                    <p className="text-xs text-gray-500 mb-1">
                      {[hospital.city, hospital.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {hospital.distance != null && (
                    <p className="text-xs font-medium text-primary-600 mb-1">
                      {hospital.distance < 1
                        ? `${Math.round(hospital.distance * 1000)}m away`
                        : `${hospital.distance.toFixed(1)}km away`}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs mt-1">
                    {hospital.isEmergencyCapable && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-medium">ER</span>
                    )}
                    {hospital.isVerified && (
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium">Verified</span>
                    )}
                    {hospital.rating > 0 && (
                      <span className="text-gray-500">★ {hospital.rating.toFixed(1)}</span>
                    )}
                  </div>
                  {hospital.phone && (
                    <a
                      href={`tel:${hospital.phone}`}
                      className="mt-2 block text-xs text-primary-600 hover:underline"
                    >
                      📞 {hospital.phone}
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-xs text-primary-600 hover:underline"
                  >
                    🗺️ Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
