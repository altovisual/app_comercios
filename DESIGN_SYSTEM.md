# Sistema de Diseño - MotoTaxi Comercios

## 🎨 Paleta de Colores (Estilo iOS)

### Colores Principales
- **Primary**: `#007AFF` - Azul iOS principal
- **Secondary**: `#5856D6` - Púrpura iOS
- **Success**: `#34C759` - Verde iOS
- **Warning**: `#FF9500` - Naranja iOS
- **Danger**: `#FF3B30` - Rojo iOS
- **Info**: `#5AC8FA` - Azul claro iOS

### Colores de Fondo
- **Background**: `#F2F2F7` - Gris claro iOS
- **Card**: `#FFFFFF` - Blanco
- **Overlay**: `rgba(0, 0, 0, 0.4)` - Overlay oscuro

### Colores de Texto
- **Text**: `#000000` - Negro principal
- **Text Secondary**: `#3C3C43` - Gris oscuro
- **Text Light**: `#8E8E93` - Gris claro

## 📦 Componentes Reutilizables

### Card
Contenedor con sombra y bordes redondeados.
```jsx
import { Card } from '../../components';

<Card style={styles.myCard}>
  <Text>Contenido</Text>
</Card>
```

**Props:**
- `children`: Contenido del card
- `style`: Estilos personalizados
- `noPadding`: Elimina el padding interno

### Button
Botón con múltiples variantes y tamaños.
```jsx
import { Button } from '../../components';

<Button 
  title="Aceptar"
  variant="primary"
  size="medium"
  icon="checkmark"
  onPress={() => {}}
/>
```

**Props:**
- `title`: Texto del botón
- `variant`: `primary` | `secondary` | `outline` | `danger` | `success` | `ghost`
- `size`: `small` | `medium` | `large`
- `icon`: Nombre del icono de Ionicons
- `iconPosition`: `left` | `right`
- `loading`: Muestra indicador de carga
- `disabled`: Deshabilita el botón

### Input
Campo de entrada con label y validación.
```jsx
import { Input } from '../../components';

<Input
  label="Correo electrónico"
  value={email}
  onChangeText={setEmail}
  placeholder="tu@email.com"
  icon="mail-outline"
  error={emailError}
/>
```

**Props:**
- `label`: Etiqueta del campo
- `value`: Valor actual
- `onChangeText`: Función de cambio
- `placeholder`: Texto placeholder
- `icon`: Icono izquierdo
- `rightIcon`: Icono derecho
- `error`: Mensaje de error
- `secureTextEntry`: Para contraseñas

### Badge
Etiqueta de estado o categoría.
```jsx
import { Badge } from '../../components';

<Badge 
  label="Pendiente"
  variant="warning"
  size="small"
/>
```

**Props:**
- `label`: Texto del badge
- `variant`: `primary` | `success` | `warning` | `danger` | `info` | `neutral`
- `size`: `small` | `medium` | `large`

### StatCard
Tarjeta de estadística con icono y tendencia.
```jsx
import { StatCard } from '../../components';

<StatCard
  icon="cash-outline"
  label="Ventas del Día"
  value="$156.50"
  color={COLORS.success}
  trend="up"
  trendValue="+12%"
/>
```

**Props:**
- `icon`: Nombre del icono
- `label`: Etiqueta de la estadística
- `value`: Valor a mostrar
- `color`: Color del icono
- `trend`: `up` | `down` (opcional)
- `trendValue`: Valor de la tendencia

### EmptyState
Estado vacío con icono y acción.
```jsx
import { EmptyState } from '../../components';

<EmptyState
  icon="receipt-outline"
  title="No hay pedidos"
  description="Los pedidos aparecerán aquí"
  actionLabel="Actualizar"
  onAction={() => {}}
/>
```

## 🎯 Principios de Diseño

### 1. Consistencia
- Usar componentes reutilizables en toda la app
- Mantener espaciados consistentes (8px, 12px, 16px, 20px, 24px)
- Aplicar la misma paleta de colores

### 2. Jerarquía Visual
- Títulos: 32px bold
- Subtítulos: 20px bold
- Texto normal: 16px
- Texto secundario: 14px
- Texto pequeño: 12-13px

### 3. Espaciado
- Padding de cards: 16px
- Margin entre secciones: 24px
- Gap entre elementos: 8-12px
- Padding de pantallas: 20px

### 4. Bordes y Sombras
- Border radius cards: 16px
- Border radius botones: 12px
- Border radius pequeño: 8-10px
- Sombras sutiles con opacity 0.08-0.1

### 5. Responsive
- Mobile: 1 columna
- Tablet: 2 columnas
- Desktop: 2-4 columnas con max-width 1200px

## 📱 Estructura de Pantallas

### HomeScreen
- Header con gradiente
- Stats cards en grid responsive
- Acciones rápidas
- Lista de pedidos activos

### OrdersScreen
- Filtros horizontales con scroll
- Cards de pedidos con información completa
- Acciones contextuales según estado
- Grid de 2 columnas en desktop

### MenuScreen
- Header con botón flotante
- Cards de productos con imagen
- Toggle de disponibilidad
- Botón de edición

### LoginScreen / RegisterScreen
- Logo con gradiente
- Formulario centrado
- Card elevado en desktop/tablet
- Inputs con iconos

### SettingsScreen
- Card de estado del comercio
- Secciones agrupadas
- Items con iconos coloridos
- Botón de logout destacado

### StatsScreen
- Grid de estadísticas con tendencias
- Lista de productos más vendidos
- Placeholder para gráficos

## 🚀 Mejoras Implementadas

1. **Sistema de Componentes**: 6 componentes reutilizables
2. **Paleta iOS**: Colores modernos y accesibles
3. **Diseño Responsive**: Adaptativo a todos los tamaños
4. **Gradientes**: En headers y logos
5. **Iconos Coloridos**: Mejor identificación visual
6. **Sombras Sutiles**: Profundidad sin saturación
7. **Badges de Estado**: Identificación rápida
8. **Tendencias**: Indicadores de crecimiento
9. **Empty States**: Mensajes amigables
10. **Mejor Jerarquía**: Tipografía clara y estructurada
