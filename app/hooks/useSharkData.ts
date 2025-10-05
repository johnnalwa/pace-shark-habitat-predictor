import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export interface SharkDataPoint {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  depth: number;
  temperature: number;
  speed: number;
  direction: number;
}

export interface HabitatData {
  suitability: number[][];
  coordinates: {
    lat: [number, number];
    lon: [number, number];
  };
  timestamp: string;
  confidence: number;
}

export const useSharkData = () => {
  const [sharkData, setSharkData] = useState<SharkDataPoint[]>([]);
  const [habitatData, setHabitatData] = useState<HabitatData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSharkData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch real shark tracking data from backend - no fallback
      const response = await fetch('/api/shark/tracking');
      if (!response.ok) {
        throw new Error('Failed to fetch shark tracking data');
      }
      const data = await response.json();
      setSharkData(data.shark_data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shark data');
      setSharkData([]); // No fallback data
    } finally {
      setLoading(false);
    }
  };

  const fetchHabitatData = async () => {
    try {
      const data = await apiService.getAdvancedPrediction();
      if (data.components && Object.keys(data.components).length > 0) {
        const firstComponent = Object.values(data.components)[0] as any;
        setHabitatData({
          suitability: firstComponent.data || [],
          coordinates: {
            lat: [32, 36],
            lon: [-120, -116]
          },
          timestamp: new Date().toISOString(),
          confidence: 0.85
        });
      }
    } catch (err) {
      setError('Failed to fetch habitat data');
      setHabitatData(null); // No fallback data
    }
  };

  useEffect(() => {
    fetchSharkData();
    fetchHabitatData();
  }, []);

  return {
    sharkData,
    habitatData,
    loading,
    error,
    refetch: () => {
      fetchSharkData();
      fetchHabitatData();
    }
  };
};
