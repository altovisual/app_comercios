import * as Location from 'expo-location';

// Solicitar permisos de ubicación
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        success: false,
        error: 'Permiso de ubicación denegado',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return { success: false, error: error.message };
  }
};

// Obtener ubicación actual
export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      const permissionResult = await requestLocationPermission();
      if (!permissionResult.success) {
        return permissionResult;
      }
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      success: true,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      },
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return { success: false, error: error.message };
  }
};

// Observar cambios de ubicación en tiempo real
export const watchLocation = async (callback) => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      const permissionResult = await requestLocationPermission();
      if (!permissionResult.success) {
        return null;
      }
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Actualizar cada 5 segundos
        distanceInterval: 10, // O cada 10 metros
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          heading: location.coords.heading,
          speed: location.coords.speed,
        });
      }
    );

    return subscription;
  } catch (error) {
    console.error('Error watching location:', error);
    return null;
  }
};

// Geocodificación: Convertir dirección a coordenadas
export const geocodeAddress = async (address) => {
  try {
    const results = await Location.geocodeAsync(address);
    
    if (results.length === 0) {
      return {
        success: false,
        error: 'No se encontró la dirección',
      };
    }

    return {
      success: true,
      location: {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      },
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return { success: false, error: error.message };
  }
};

// Geocodificación inversa: Convertir coordenadas a dirección
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (results.length === 0) {
      return {
        success: false,
        error: 'No se encontró la dirección',
      };
    }

    const address = results[0];
    const formattedAddress = [
      address.street,
      address.streetNumber,
      address.district,
      address.city,
      address.region,
      address.country,
    ]
      .filter(Boolean)
      .join(', ');

    return {
      success: true,
      address: formattedAddress,
      details: address,
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return { success: false, error: error.message };
  }
};

// Calcular distancia entre dos puntos (en km)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

// Convertir grados a radianes
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Calcular tiempo estimado de llegada
export const calculateETA = (distanceKm, speedKmh = 30) => {
  // speedKmh: velocidad promedio (30 km/h para moto en ciudad)
  const timeHours = distanceKm / speedKmh;
  const timeMinutes = Math.round(timeHours * 60);
  
  return {
    minutes: timeMinutes,
    formatted: timeMinutes < 60
      ? `${timeMinutes} min`
      : `${Math.floor(timeMinutes / 60)}h ${timeMinutes % 60}min`,
  };
};

// Verificar si una ubicación está dentro de un radio
export const isWithinRadius = (
  centerLat,
  centerLon,
  pointLat,
  pointLon,
  radiusKm
) => {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon);
  return distance <= radiusKm;
};
