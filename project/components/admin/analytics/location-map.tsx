'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

interface LocationData {
  country: string;
  count: number;
}

export function LocationMap() {
  const [data, setData] = useState<LocationData[]>([]);

  useEffect(() => {
    async function fetchLocationData() {
      try {
        const response = await fetch('/api/admin/analytics');
        const { locationStats } = await response.json();
        setData(locationStats);
      } catch (error) {
        console.error('Failed to fetch location data:', error);
      }
    }

    fetchLocationData();
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">User Locations</h2>
      <div className="h-[400px]">
        <ComposableMap>
          <Geographies geography="/world-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const locationData = data.find(d => d.country === geo.properties.ISO_A2);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={locationData ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                    stroke="hsl(var(--border))"
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </Card>
  );
}