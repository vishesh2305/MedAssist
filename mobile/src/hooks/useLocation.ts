import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { GeoLocation } from '../types';

interface UseLocationResult {
  location: GeoLocation | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return false;
      }
      return true;
    } catch {
      setError('Failed to request location permission');
      return false;
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const address = geocode[0]
        ? `${geocode[0].street || ''}, ${geocode[0].city || ''}, ${geocode[0].country || ''}`
            .replace(/^, /, '')
            .replace(/, $/, '')
        : undefined;

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address,
      });
    } catch {
      setError('Failed to get current location');
    } finally {
      setIsLoading(false);
    }
  }, [requestPermission]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return { location, isLoading, error, requestPermission, refreshLocation };
}
