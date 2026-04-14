/**
 * Geocoding Utility
 * Converts place names to coordinates using Nominatim OSM API
 */

export interface GeocodedStop {
  name: string;
  lat: number;
  lng: number;
}

/**
 * Geocode a single place name to coordinates
 * Uses Nominatim OpenStreetMap API
 */
export async function geocodePlace(placeName: string): Promise<GeocodedStop | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        placeName
      )}&format=json&limit=1`
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn(`No coordinates found for: ${placeName}`);
      return null;
    }

    const result = data[0];
    return {
      name: placeName,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };
  } catch (error) {
    console.error(`Geocoding error for ${placeName}:`, error);
    return null;
  }
}

/**
 * Geocode multiple place names in sequence
 * Returns array of geocoded stops with coordinates
 */
export async function geocodeStops(
  stopNames: string[]
): Promise<GeocodedStop[]> {
  const geocodedStops: GeocodedStop[] = [];

  for (const stopName of stopNames) {
    // Small delay to respect API rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));

    const geocoded = await geocodePlace(stopName);
    if (geocoded) {
      geocodedStops.push(geocoded);
    }
  }

  return geocodedStops;
}

/**
 * Calculate bounds from multiple coordinates
 * Useful for fitting map to show entire route
 */
export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function calculateBounds(
  coordinates: Array<{ lat: number; lng: number }>
): Bounds {
  if (coordinates.length === 0) {
    return { north: 0, south: 0, east: 0, west: 0 };
  }

  const lats = coordinates.map((c) => c.lat);
  const lngs = coordinates.map((c) => c.lng);

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
}
