import { Dimensions, Platform } from 'react-native';

// Breakpoints para diseño responsive
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

// Obtener dimensiones actuales
export const getWindowDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Determinar el tipo de dispositivo basado en el ancho
export const getDeviceType = () => {
  const { width } = getWindowDimensions();
  
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
};

// Verificar si es web
export const isWeb = Platform.OS === 'web';

// Verificar si es móvil
export const isMobile = () => {
  return getDeviceType() === 'mobile';
};

// Verificar si es tablet
export const isTablet = () => {
  return getDeviceType() === 'tablet';
};

// Verificar si es desktop
export const isDesktop = () => {
  return getDeviceType() === 'desktop';
};

// Obtener número de columnas según el ancho de pantalla
export const getColumns = (minColumnWidth = 300) => {
  const { width } = getWindowDimensions();
  const columns = Math.floor(width / minColumnWidth);
  return Math.max(1, columns);
};

// Obtener ancho máximo del contenedor
export const getMaxContainerWidth = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return 1200;
    case 'tablet':
      return 900;
    default:
      return '100%';
  }
};

// Obtener padding horizontal según el dispositivo
export const getHorizontalPadding = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return 40;
    case 'tablet':
      return 32;
    default:
      return 20;
  }
};

// Obtener ancho de columna para grids
export const getGridItemWidth = (columns = 2, gap = 16) => {
  const { width } = getWindowDimensions();
  const padding = getHorizontalPadding();
  const availableWidth = width - (padding * 2) - (gap * (columns - 1));
  return availableWidth / columns;
};

// Hook personalizado para responsive (usar con useState)
export const useResponsive = () => {
  const deviceType = getDeviceType();
  const { width, height } = getWindowDimensions();
  
  return {
    deviceType,
    width,
    height,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isWeb,
  };
};
